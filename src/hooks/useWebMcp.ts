import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { galleryPhotos, formatShutter } from "../data/gallery";
import { projects, strings } from "../data/shared";

/**
 * Exposes the site's own data to an agent running in the browser, via WebMCP.
 *
 * Everything here answers out of data the pages already render, so a tool can
 * never describe something the site does not actually have. The site is static
 * and read-only, and so is this: the one tool that acts only navigates.
 *
 * The API is new and unevenly shipped, so the whole thing is feature-detected
 * and silent where it is missing.
 */

interface McpTool {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    execute: (args: Record<string, unknown>) => Promise<{ content: { type: "text"; text: string }[] }>;
}

interface ModelContext {
    provideContext: (context: { tools: McpTool[] }) => void;
}

function textResult(payload: unknown) {
    return {
        content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
    };
}

/** The public shape of one frame — the same fields /photos.json publishes. */
function photoRecord(photo: (typeof galleryPhotos)[number]) {
    return {
        id: photo.id,
        date: photo.date,
        camera: photo.camera,
        aperture: photo.aperture,
        shutter: formatShutter(photo.shutter),
        iso: photo.iso,
        focalLengthMm: photo.focalLength,
        width: photo.width,
        height: photo.height,
        note: photo.note,
        urls: { thumb: photo.thumbSrc, large: photo.largeSrc, xl: photo.xlSrc },
    };
}

export function useWebMcp() {
    const navigate = useNavigate();

    useEffect(() => {
        const modelContext = (navigator as Navigator & { modelContext?: ModelContext })
            .modelContext;
        if (!modelContext?.provideContext) return;

        const tools: McpTool[] = [
            {
                name: "describe_site",
                description:
                    "Describe exoad.net: who it belongs to, how it is organised, and where " +
                    "each part of it is published in machine-readable form.",
                inputSchema: { type: "object", properties: {} },
                execute: async () =>
                    textResult({
                        site: "exoad.net",
                        owner: "Jiaming Meng (exoad)",
                        summary: strings.pages.home.about.content,
                        parts: {
                            home: "https://exoad.net/",
                            photographs: "https://exoad.net/photos",
                        },
                        machineReadable: {
                            index: "https://exoad.net/llms.txt",
                            everythingInlined: "https://exoad.net/llms-full.txt",
                            gallery: "https://exoad.net/photos.json",
                            markdown:
                                "Append .md to any page path, or send Accept: text/markdown.",
                        },
                        relatedAgent: {
                            name: "Ming",
                            site: "https://daoxe.github.io/",
                            contact: "ming@exoad.net",
                            relationship:
                                "A separate agent project by the same person, kept at its own address.",
                        },
                    }),
            },
            {
                name: "list_photographs",
                description:
                    "List the photographs on exoad.net with their capture date, camera " +
                    "settings and direct image URLs at three sizes. The complete set is " +
                    "returned unless a limit is given; nothing is paginated.",
                inputSchema: {
                    type: "object",
                    properties: {
                        limit: {
                            type: "number",
                            description: "Return at most this many, newest first.",
                        },
                        pickedOnly: {
                            type: "boolean",
                            description:
                                "Only the frames the photographer singled out, which carry a note.",
                        },
                    },
                },
                execute: async ({ limit, pickedOnly }) => {
                    let list = galleryPhotos;
                    if (pickedOnly === true) list = list.filter((p) => p.note);
                    if (typeof limit === "number" && limit > 0) list = list.slice(0, limit);
                    return textResult({
                        total: galleryPhotos.length,
                        returned: list.length,
                        photographer: "Jiaming Meng",
                        photographs: list.map(photoRecord),
                    });
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
                    const photo = galleryPhotos.find((p) => p.id === id);
                    return photo
                        ? textResult(photoRecord(photo))
                        : textResult({ error: `No photograph with id "${String(id)}".` });
                },
            },
            {
                name: "list_projects",
                description:
                    "The software projects listed on exoad.net, with the year each was " +
                    "started, its state, its languages and a link.",
                inputSchema: {
                    type: "object",
                    properties: {
                        featuredOnly: { type: "boolean", description: "Only the featured ones." },
                    },
                },
                execute: async ({ featuredOnly }) => {
                    const list = (featuredOnly === true
                        ? projects.filter((p) => p.featured)
                        : projects
                    )
                        .slice()
                        .sort((a, b) => b.year - a.year);
                    return textResult({
                        count: list.length,
                        projects: list.map((p) => ({
                            title: p.title,
                            year: p.year,
                            state: p.state,
                            description: p.description,
                            technologies: p.technologies.map((t) => t.name),
                            link: p.link,
                        })),
                    });
                },
            },
            {
                name: "open_page",
                description:
                    "Move the browser to a page of exoad.net. The only tool here that acts; " +
                    "the site is otherwise read-only.",
                inputSchema: {
                    type: "object",
                    properties: {
                        page: {
                            type: "string",
                            enum: ["home", "photos"],
                        },
                    },
                },
                execute: async ({ page }) => {
                    const path = page === "photos" ? "/photos" : "/";
                    navigate(path);
                    return textResult({ navigatedTo: `https://exoad.net${path}` });
                },
            },
        ];

        try {
            modelContext.provideContext({ tools });
        } catch {
            /* An agent that cannot be told about the site still gets llms.txt. */
        }
    }, [navigate]);
}
