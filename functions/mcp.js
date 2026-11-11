/**
 * An MCP server for exoad.net, over Streamable HTTP.
 *
 * This exists so the server card at /.well-known/mcp/server-card.json points at
 * something real. Every tool answers out of mcp-data.json, which the site build
 * generates from the same data the pages render, so the server can never
 * describe something the site does not have.
 *
 * The site is static and public: the tools are read-only, there is nothing to
 * authenticate, and no state is kept between requests.
 */

const PROTOCOL_VERSION = "2025-06-18";
const SERVER = { name: "exoad.net", version: "1.0.0" };

const TOOLS = [
    {
        name: "describe_site",
        description:
            "Describe exoad.net: whose it is, how it is organised, and where each part " +
            "of it is published in machine-readable form.",
        inputSchema: { type: "object", properties: {} },
        run: (d) => ({ ...d.site, relatedAgent: d.ming }),
    },
    {
        name: "list_photographs",
        description:
            "List the photographs with capture date, camera settings, permalink and " +
            "direct image URLs at three sizes. The whole set is returned unless a limit " +
            "is given; nothing is paginated.",
        inputSchema: {
            type: "object",
            properties: {
                limit: { type: "number", description: "At most this many, newest first." },
                pickedOnly: {
                    type: "boolean",
                    description: "Only the frames the photographer singled out.",
                },
            },
        },
        run: (d, { limit, pickedOnly } = {}) => {
            let list = d.photos;
            if (pickedOnly === true) list = list.filter((p) => p.note);
            if (typeof limit === "number" && Number.isFinite(limit) && limit > 0) {
                list = list.slice(0, Math.floor(limit));
            }
            return { total: d.photos.length, returned: list.length, photographs: list };
        },
    },
    {
        name: "get_photograph",
        description: "Everything known about one photograph, by its id.",
        inputSchema: {
            type: "object",
            properties: { id: { type: "string", description: "e.g. p8050002" } },
            required: ["id"],
        },
        run: (d, { id } = {}) => {
            if (typeof id !== "string") return { error: "id must be a string, e.g. p8050002." };
            return d.photos.find((p) => p.id === id) ?? { error: `No photograph with id "${id.slice(0, 64)}".` };
        },
    },
    {
        name: "list_projects",
        description:
            "The projects, each with a one-line description, its year, its state and a link.",
        inputSchema: {
            type: "object",
            properties: { featuredOnly: { type: "boolean" } },
        },
        run: (d, { featuredOnly } = {}) => {
            const list = featuredOnly === true ? d.projects.filter((p) => p.featured) : d.projects;
            return { count: list.length, projects: list };
        },
    },
];

// Kept as one constant so the preflight and the real responses cannot drift.
const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type, mcp-protocol-version, mcp-session-id",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (payload, status = 200) =>
    new Response(JSON.stringify(payload), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
            ...CORS,
        },
    });

// Every message this server understands fits in a few hundred bytes.
const MAX_BODY = 64 * 1024;

const ok = (id, result) => ({ jsonrpc: "2.0", id, result });
const err = (id, code, message) => ({ jsonrpc: "2.0", id, error: { code, message } });

/** Only a string or a number is a usable JSON-RPC id. */
const idOf = (message) =>
    typeof message?.id === "string" || typeof message?.id === "number" ? message.id : null;

function handle(message, data) {
    if (message === null || typeof message !== "object" || Array.isArray(message)) {
        return err(null, -32600, "Invalid request");
    }
    const { method, params } = message;
    const id = idOf(message);
    // Notifications carry no id and get no reply.
    const isNotification = message.id === undefined || message.id === null;
    if (typeof method !== "string") return isNotification ? null : err(id, -32600, "Invalid request");

    switch (method) {
        case "initialize":
            return ok(id, {
                protocolVersion: PROTOCOL_VERSION,
                capabilities: { tools: { listChanged: false } },
                serverInfo: SERVER,
                instructions:
                    "Read-only access to exoad.net: its photographs and their camera " +
                    "settings, and its projects. Nothing here requires " +
                    "authentication and nothing can be modified.",
            });

        case "ping":
            return ok(id, {});

        case "tools/list":
            return ok(id, {
                tools: TOOLS.map(({ name, description, inputSchema }) => ({
                    name,
                    description,
                    inputSchema,
                })),
            });

        case "tools/call": {
            const name = typeof params?.name === "string" ? params.name : null;
            const tool = TOOLS.find((t) => t.name === name);
            if (!tool) return err(id, -32602, "Unknown tool");
            const args =
                params.arguments && typeof params.arguments === "object" && !Array.isArray(params.arguments)
                    ? params.arguments
                    : {};
            try {
                const result = tool.run(data, args);
                return ok(id, {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                });
            } catch {
                return ok(id, { isError: true, content: [{ type: "text", text: "Tool failed." }] });
            }
        }

        default:
            if (isNotification) return null;
            return err(id, -32601, "Method not found");
    }
}

export async function onRequestPost({ request, env }) {
    // Read as text first so an oversized body is refused before it is parsed,
    // whether or not the client sent a Content-Length.
    const length = Number(request.headers.get("Content-Length") ?? 0);
    if (length > MAX_BODY) return json(err(null, -32600, "Request too large"), 413);

    let body;
    try {
        const text = await request.text();
        if (text.length > MAX_BODY) return json(err(null, -32600, "Request too large"), 413);
        body = JSON.parse(text);
    } catch {
        return json(err(null, -32700, "Parse error"), 400);
    }

    // The protocol revision this server speaks (2025-06-18) has no batching,
    // and a batch is the only way one small request could ask for a lot.
    if (Array.isArray(body)) return json(err(null, -32600, "Batch requests are not supported"), 400);

    let data;
    try {
        const res = await env.ASSETS.fetch(new URL("/mcp-data.json", request.url).toString());
        data = await res.json();
    } catch {
        return json(err(idOf(body), -32603, "Site data unavailable"), 500);
    }

    let reply;
    try {
        reply = handle(body, data);
    } catch {
        reply = err(idOf(body), -32603, "Internal error");
    }

    // A notification earns an empty acknowledgement, not a body.
    if (reply === null) return new Response(null, { status: 202, headers: CORS });
    return json(reply);
}

export async function onRequestOptions() {
    // 204 is a null-body status: a Response with a body here throws.
    return new Response(null, { status: 204, headers: { ...CORS, "Access-Control-Max-Age": "86400" } });
}

/** No server-initiated stream: this server only ever answers what it is asked. */
function notAllowed(request) {
    return new Response(request.method === "HEAD" ? null : "This endpoint speaks MCP over POST.", {
        status: 405,
        headers: { Allow: "POST, OPTIONS", "Content-Type": "text/plain; charset=utf-8", ...CORS },
    });
}

export const onRequestGet = ({ request }) => notAllowed(request);
export const onRequestHead = ({ request }) => notAllowed(request);
