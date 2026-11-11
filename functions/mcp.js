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
            if (typeof limit === "number" && limit > 0) list = list.slice(0, limit);
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
        run: (d, { id } = {}) =>
            d.photos.find((p) => p.id === id) ?? { error: `No photograph with id "${id}".` },
    },
    {
        name: "list_projects",
        description:
            "The software projects, with the year each was started, its state, its " +
            "languages and a link.",
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

const json = (payload, status = 200) =>
    new Response(JSON.stringify(payload), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "content-type, mcp-protocol-version",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
    });

const ok = (id, result) => ({ jsonrpc: "2.0", id, result });
const err = (id, code, message) => ({ jsonrpc: "2.0", id, error: { code, message } });

async function handle(message, data) {
    const { id, method, params } = message ?? {};
    // Notifications carry no id and get no reply.
    const isNotification = id === undefined || id === null;

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
            const tool = TOOLS.find((t) => t.name === params?.name);
            if (!tool) return err(id, -32602, `Unknown tool: ${params?.name}`);
            try {
                const result = tool.run(data, params?.arguments ?? {});
                return ok(id, {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                });
            } catch (cause) {
                return ok(id, {
                    isError: true,
                    content: [{ type: "text", text: `Tool failed: ${cause.message}` }],
                });
            }
        }

        default:
            if (isNotification) return null;
            return err(id, -32601, `Method not found: ${method}`);
    }
}

export async function onRequestPost({ request, env }) {
    let body;
    try {
        body = await request.json();
    } catch {
        return json(err(null, -32700, "Parse error"), 400);
    }

    let data;
    try {
        const res = await env.ASSETS.fetch(new URL("/mcp-data.json", request.url).toString());
        data = await res.json();
    } catch {
        return json(err(body?.id ?? null, -32603, "Site data unavailable"), 500);
    }

    const batch = Array.isArray(body) ? body : [body];
    const replies = (await Promise.all(batch.map((m) => handle(m, data)))).filter(Boolean);

    // A batch of notifications earns an empty acknowledgement, not a body.
    if (replies.length === 0) return new Response(null, { status: 202 });
    return json(Array.isArray(body) ? replies : replies[0]);
}

export async function onRequestOptions() {
    return json({}, 204);
}

/** No server-initiated stream: this server only ever answers what it is asked. */
export async function onRequestGet() {
    return new Response("This endpoint speaks MCP over POST.", {
        status: 405,
        headers: { Allow: "POST, OPTIONS", "Content-Type": "text/plain; charset=utf-8" },
    });
}
