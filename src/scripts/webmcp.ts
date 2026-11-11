/**
 * Offers the site's own data to an agent running in this browser, via WebMCP.
 *
 * Every tool answers out of /mcp-data.json — the same file the /mcp endpoint
 * serves from, generated from the data the pages render — so a tool can never
 * describe something the site does not have. Nothing is fetched until a tool
 * is actually called, so an ordinary visit pays only for this file.
 *
 * The API is new and unevenly shipped, so all of it is feature-detected and
 * silent where it is missing.
 */

interface Tool {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    execute: (args: Record<string, unknown>) => Promise<{ content: { type: "text"; text: string }[] }>;
}

interface SiteData {
    site: Record<string, unknown>;
    ming: Record<string, unknown>;
    photos: { id: string; note: string | null }[];
    projects: { featured: boolean }[];
}

const modelContext = (navigator as Navigator & {
    modelContext?: { provideContext?: (context: { tools: Tool[] }) => void };
}).modelContext;

if (modelContext?.provideContext) {
    let data: Promise<SiteData> | null = null;
    const load = () => (data ??= fetch("/mcp-data.json").then((r) => r.json()));
    const text = (payload: unknown) => ({
        content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
    });

    const tools: Tool[] = [
        {
            name: "describe_site",
            description:
                "Describe exoad.net: who it belongs to, how it is organised, and where each part of it is published in machine-readable form.",
            inputSchema: { type: "object", properties: {} },
            execute: async () => {
                const d = await load();
                return text({ ...d.site, relatedAgent: d.ming });
            },
        },
        {
            name: "list_photographs",
            description:
                "List the photographs with capture date, camera settings and direct image URLs at three sizes. The complete set is returned unless a limit is given; nothing is paginated.",
            inputSchema: {
                type: "object",
                properties: {
                    limit: { type: "number", description: "Return at most this many, newest first." },
                    pickedOnly: {
                        type: "boolean",
                        description: "Only the frames the photographer singled out, which carry a note.",
                    },
                },
            },
            execute: async ({ limit, pickedOnly }) => {
                const d = await load();
                let list = d.photos;
                if (pickedOnly === true) list = list.filter((p) => p.note);
                if (typeof limit === "number" && limit > 0) list = list.slice(0, limit);
                return text({ total: d.photos.length, returned: list.length, photographs: list });
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
            execute: async ({ id }) => {
                const d = await load();
                return text(d.photos.find((p) => p.id === id) ?? { error: `No photograph with id "${String(id)}".` });
            },
        },
        {
            name: "list_projects",
            description: "The projects listed on exoad.net, each with a one-line description and a link.",
            inputSchema: {
                type: "object",
                properties: { featuredOnly: { type: "boolean", description: "Only the featured ones." } },
            },
            execute: async ({ featuredOnly }) => {
                const d = await load();
                const list = featuredOnly === true ? d.projects.filter((p) => p.featured) : d.projects;
                return text({ count: list.length, projects: list });
            },
        },
        {
            name: "open_page",
            description:
                "Move the browser to a page of exoad.net. The only tool here that acts; the site is otherwise read-only.",
            inputSchema: {
                type: "object",
                properties: { page: { type: "string", enum: ["home", "photos"] } },
            },
            execute: async ({ page }) => {
                const path = page === "photos" ? "/photos" : "/";
                window.location.assign(path);
                return text({ navigatedTo: new URL(path, location.origin).href });
            },
        },
    ];

    try {
        modelContext.provideContext({ tools });
    } catch {
        /* An agent that cannot be told about the site still gets llms.txt. */
    }
}
