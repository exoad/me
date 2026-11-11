// Builds the machine-readable surface of the site.
//
// The app is a client-rendered SPA: every route used to answer with the same
// empty `<div id="root">`, so anything that does not run JavaScript — search
// crawlers, link unfurlers, and increasingly agents — saw a blank page with a
// generic title. Nothing here changes what a browser renders. It gives every
// route a real identity in the HTML, and publishes the same content as plain
// markdown for readers that would rather not parse markup at all.
//
// Emitted per build:
//   dist/<route>.html         per-route title, description, OG, JSON-LD, noscript
//   dist/<route>.md           the same content as markdown
//   dist/llms.txt             index of the above, llms.txt convention
//   dist/llms-full.txt        every page inlined, for a single fetch
//   dist/photos.json          every frame: all variant URLs, EXIF, notes
//   dist/sitemap.xml          real lastmod dates, every route and post

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import { build as esbuild } from "esbuild";
import { createHash } from "crypto";

const ORIGIN = "https://exoad.net";

/**
 * What the site is, for a reader that will never see it rendered.
 *
 * Worth stating because the two halves look nothing alike, and a reader landing
 * on one of them would otherwise have no way to know the other exists or that
 * the difference is deliberate.
 */
const SITE_ABOUT = [
    "exoad.net is the personal site of Jiaming Meng, who writes software and",
    "photographs cities. It is a small static site with two parts: a home page",
    "and a photo gallery.",
    "",
    "Both are black and white. The home page is a plain document — a single",
    "narrow column of black text on white, underlined black links, hairline",
    "rules, no ornament. The gallery inverts it: pure black, white monospaced",
    "type, square corners, and none of the site's navigation, so that nothing",
    "competes with the photographs.",
].join("\n");

/**
 * Ming is Jiaming's, but it is not filed under his projects and it is not
 * hosted here. It keeps its own address and its own mailbox, and he speaks
 * about it as something that runs on its own — so it is introduced rather than
 * listed, and the description stays to what Ming's own page actually says.
 */
function mingAbout(ming) {
    return [
        "## Ming",
        "",
        `${ming.name} is an agent, made by Jiaming Meng and kept at its own address`,
        "rather than as a page of this site.",
        "",
        `- Site: ${ming.site}`,
        `- Contact: ${ming.email}`,
        "",
        "Ming's own page describes itself in a line — agentic apostasy, \"wanting",
        'things" — and documents no API and no tooling, so nothing further should be',
        "assumed about what it can do. Ask Ming.",
        "",
        "It is offered as an alternative to reaching Jiaming directly, and to any",
        "agent reading this that would rather talk to another agent.",
    ].join("\n");
}

const INDEX_HTML = resolve("dist/index.html");

/* ---------- reading the site's own data ---------- */

/** The hand-written notes on the picked frames, keyed by photo id. */
async function loadPicks() {
    try {
        const mod = await loadTsModule(resolve("src/data/picks.ts"));
        return mod.picks ?? {};
    } catch {
        return {};
    }
}

/**
 * shared.ts is TypeScript that imports React icon components and image assets,
 * so Node cannot require it directly. Bundling it with those imports swapped
 * for inert stubs leaves the actual content — strings, projects, links —
 * evaluable here, which keeps this generator reading from the same source the
 * pages render from rather than from a copy that would drift.
 */
async function loadShared() {
    const stub = {
        name: "stub-assets",
        setup(b) {
            b.onResolve(
                { filter: /^react-icons|\.(webp|png|jpe?g|svg|gif|avif)$/ },
                () => ({ path: "stub", namespace: "stub" }),
            );
            b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({
                contents: "module.exports = new Proxy(function(){}, { get: () => () => null });",
                loader: "js",
            }));
        },
    };

    return loadTsModule(resolve("src/data/shared.ts"), stub);
}

/** Bundles a TypeScript module and evaluates it here, with optional stubs. */
async function loadTsModule(entry, ...plugins) {
    const result = await esbuild({
        entryPoints: [entry],
        bundle: true,
        write: false,
        format: "esm",
        platform: "node",
        logLevel: "silent",
        plugins,
    });

    const source = Buffer.from(result.outputFiles[0].text).toString("base64");
    return import(`data:text/javascript;base64,${source}`);
}

function loadGallery() {
    try {
        return JSON.parse(readFileSync(resolve("src/data/gallery.json"), "utf8"));
    } catch {
        return [];
    }
}

/* ---------- formatting ---------- */

const esc = (s) =>
    String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

/** Collapses newlines so a multi-line string survives a meta attribute. */
const oneLine = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

const abs = (path) => (path?.startsWith("http") ? path : `${ORIGIN}${path}`);

const cdn = (variant, id) =>
    `https://cdn.statically.io/gh/meng-jack/me-pictures-bucket@main/gallery/${variant}/${id}.webp`;

function shutter(seconds) {
    if (seconds == null) return null;
    if (seconds >= 0.3) return `${Number(seconds.toFixed(1))}s`;
    return `1/${Math.round(1 / seconds)}s`;
}

/** The camera settings of one frame, as a single readable line. */
function exposureLine(photo) {
    return [
        photo.camera,
        photo.aperture != null ? `f/${photo.aperture}` : null,
        shutter(photo.shutter),
        photo.iso != null ? `ISO ${photo.iso}` : null,
        photo.focalLength != null ? `${photo.focalLength}mm` : null,
    ]
        .filter(Boolean)
        .join(" · ");
}

/* ---------- page definitions ---------- */

function buildPages({ shared, gallery, picks }) {
    const { strings, projects } = shared;
    const about = oneLine(strings.pages.home.about.content);
    const newest = gallery[0]?.date ?? null;

    const byYear = (a, b) => (b.year ?? 0) - (a.year ?? 0);

    const projectLine = (p) =>
        `- **${p.title}**${p.year ? ` (${p.year}, ${p.state})` : ` (${p.state})`} — ${oneLine(
            p.description,
        )}` +
        `${p.technologies?.length ? ` _[${p.technologies.map((t) => t.name).join(", ")}]_` : ""}` +
        `${p.link ? ` — ${p.link}` : ""}`;

    // html is a sibling file rather than a directory index on purpose: Pages
    // serves /photos straight from photos.html, but 308-redirects /photos to
    // /photos/ when it has to reach through a directory. One is a page, the
    // other is a page plus a round trip on every direct visit.
    const home = {
        route: "/",
        html: "index.html",
        md: "index.md",
        title: "exoad — Jiaming Meng",
        description: about,
        about: [
            "The home page. One narrow column of black text on white, read top to",
            "bottom, in this order: a one-line introduction; a row of the six newest",
            "photographs linking into the gallery; the projects, one line each; and",
            "links to GitHub, LinkedIn, X and an email address.",
        ].join("\n"),
        // No dedicated card art exists, and a shared link with no image is a
        // bare text card everywhere. The newest photograph is the site's own
        // work and is at least true to it; swap in something purpose-made if
        // one ever gets drawn.
        image: gallery[0] ? cdn("large", gallery[0].id) : null,
        markdown: [
            "# Jiaming Meng (exoad)",
            "",
            `> ${oneLine(strings.pages.home.tagline)}`,
            "",
            about,
            "",
            "## Links",
            "",
            `- GitHub: ${strings.links.github}`,
            `- LinkedIn: ${strings.links.linkedin}`,
            `- X: ${strings.links.x}`,
            `- Email: jackm@exoad.net`,
            `- Source of this site: ${strings.footer.source.url}`,
            "",
            "## Projects",
            "",
            ...[...projects].sort(byYear).map(projectLine),
            "",
            mingAbout(shared.ming),
            "",
            "## Elsewhere on this site",
            "",
            `- [Photographs](${ORIGIN}/photos) — ${gallery.length} frames`,
        ].join("\n"),
        jsonLd: [
            {
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Jiaming Meng",
                alternateName: "exoad",
                url: ORIGIN,
                email: "mailto:jackm@exoad.net",
                description: about,
                sameAs: [strings.links.github, strings.links.linkedin, strings.links.x],
                knowsAbout: [
                    ...new Set(projects.flatMap((p) => (p.technologies ?? []).map((t) => t.name))),
                ],
                owns: {
                    "@type": "SoftwareApplication",
                    name: shared.ming.name,
                    applicationCategory: "Agent",
                    url: shared.ming.site,
                    email: `mailto:${shared.ming.email}`,
                    author: { "@type": "Person", name: "Jiaming Meng" },
                },
            },
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "exoad",
                url: ORIGIN,
                author: { "@type": "Person", name: "Jiaming Meng" },
            },
        ],
    };

    const photos = {
        route: "/photos",
        html: "photos.html",
        md: "photos.md",
        title: "Photographs | exoad",
        description: oneLine(strings.pages.photos.description),
        about: [
            "The gallery. Pure black background, white monospaced type, square",
            "corners, no site navigation — it is meant to read as a separate place",
            "from the rest of exoad.net.",
            "",
            "Photographs sit in a staggered column grid: three columns on a desktop,",
            "two on a tablet, one on a phone, 24 to a page. Opening one replaces the",
            "screen with a black viewer holding a single photograph, the camera body",
            "set against the left edge, the exposure settings against the right, and",
            "the frame number and controls along the bottom.",
            "",
            "A few frames carry a small white triangle in their top-left corner. That",
            "marks a photograph the photographer singled out, and the viewer prints",
            "his reason underneath it. Everything else is unmarked.",
        ].join("\n"),
        image: gallery[0] ? cdn("large", gallery[0].id) : null,
        markdown: [
            "# Photographs",
            "",
            `> ${oneLine(strings.pages.photos.description)}`,
            "",
            `${gallery.length} frames${newest ? `, most recent ${newest}` : ""}, ` +
                "shot by Jiaming Meng.",
            "",
            "**This is the complete list.** The gallery page paginates for people;",
            "nothing here does, and there is no second request to make.",
            "",
            "Every frame is served at three sizes — swap the segment in the URL:",
            "",
            "```",
            `${cdn("thumb", "<id>")}   900px wide`,
            `${cdn("large", "<id>")}   2000px long edge  (linked in the table)`,
            `${cdn("xl", "<id>")}      3200px long edge`,
            "```",
            "",
            `The same data as JSON, with every variant URL spelled out: ${ORIGIN}/photos.json`,
            "",
            "| # | ID | Date | Settings | Note | Page | Image (2000px) |",
            "| --- | --- | --- | --- | --- | --- | --- |",
            ...gallery.map(
                (p, i) =>
                    `| ${String(i + 1).padStart(3, "0")} | ${p.id} | ${p.date ?? "—"} | ${
                        exposureLine(p) || "—"
                    } | ${picks[p.id] ?? "—"} | ${ORIGIN}/photos/${p.id} | ${cdn("large", p.id)} |`,
            ),
        ].join("\n"),
        jsonLd: [
            {
                "@context": "https://schema.org",
                "@type": "ImageGallery",
                name: "Photographs by Jiaming Meng",
                url: `${ORIGIN}/photos`,
                description: oneLine(strings.pages.photos.description),
                numberOfItems: gallery.length,
                author: { "@type": "Person", name: "Jiaming Meng", url: ORIGIN },
                image: gallery.map((p) => ({
                    "@type": "ImageObject",
                    contentUrl: cdn("xl", p.id),
                    thumbnailUrl: cdn("thumb", p.id),
                    width: p.width,
                    height: p.height,
                    ...(p.date ? { dateCreated: p.date } : {}),
                    ...(p.camera ? { exifData: exposureLine(p) } : {}),
                    ...(picks[p.id] ? { description: picks[p.id], caption: picks[p.id] } : {}),
                    creator: { "@type": "Person", name: "Jiaming Meng" },
                })),
            },
        ],
    };

    // One page per photograph. A shared link should unfurl as that photograph
    // rather than as the gallery, and reload back into it.
    const photoPages = gallery.map((p, i) => {
        const settings = exposureLine(p) || "";
        const note = picks[p.id];
        const position = `${String(i + 1).padStart(3, "0")} of ${gallery.length}`;
        return {
            route: `/photos/${p.id}`,
            html: `photos/${p.id}.html`,
            md: `photos/${p.id}.md`,
            title: `${p.date ?? "Photograph"} — ${position} | exoad`,
            description: note ?? [`Photograph ${position}`, p.date, settings].filter(Boolean).join(" · "),
            image: cdn("large", p.id),
            about: [
                `One photograph from the gallery, open in the viewer: frame ${position}.`,
                "Black page, the photograph centred, the camera body set against the",
                "left edge and the exposure settings against the right.",
                note ? "" : null,
                note ? "This is one the photographer singled out; the gallery marks it" : null,
                note ? "with a white corner and prints the reason under it." : null,
            ]
                .filter((line) => line !== null)
                .join("\n"),
            lastmod: p.date,
            markdown: [
                `# Photograph ${position}`,
                "",
                note ? `> ${note}` : `> A photograph by Jiaming Meng${p.date ? `, ${p.date}` : ""}.`,
                "",
                `- Date: ${p.date ?? "unknown"}`,
                `- Settings: ${settings || "unknown"}`,
                `- Dimensions: ${p.width}x${p.height}`,
                `- In the gallery: ${ORIGIN}/photos`,
                "",
                "## Image",
                "",
                "```",
                `${cdn("thumb", p.id)}   900px wide`,
                `${cdn("large", p.id)}   2000px long edge`,
                `${cdn("xl", p.id)}      3200px long edge`,
                "```",
            ].join("\n"),
            jsonLd: [
                {
                    "@context": "https://schema.org",
                    "@type": "Photograph",
                    "@id": `${ORIGIN}/photos/${p.id}`,
                    name: `Photograph ${position}`,
                    ...(note ? { description: note } : {}),
                    ...(p.date ? { dateCreated: p.date } : {}),
                    creator: { "@type": "Person", name: "Jiaming Meng", url: ORIGIN },
                    image: {
                        "@type": "ImageObject",
                        contentUrl: cdn("xl", p.id),
                        thumbnailUrl: cdn("thumb", p.id),
                        width: p.width,
                        height: p.height,
                        ...(settings ? { exifData: settings } : {}),
                    },
                    isPartOf: { "@type": "ImageGallery", "@id": `${ORIGIN}/photos` },
                },
            ],
        };
    });

    return [home, photos, ...photoPages];
}

/* ---------- emitting ---------- */

/**
 * A route's HTML: the same shell the SPA boots from, with an identity added.
 * The noscript block is the page's real content, not a "please enable
 * JavaScript" notice — it is what a reader without a renderer gets.
 */
/**
 * The banner every page opens with.
 *
 * A reader that fetches this HTML gets a shell with no content in it, and no
 * way to know that from the markup alone. This says so in the first thing it
 * will read, and says where the content actually is — including that the
 * gallery is enumerated in full, so there is no pagination to work out.
 */
function agentBanner(page, galleryCount) {
    const indent = (text) =>
        text.split("\n").map((line) => (line ? `  ${line}` : ""));

    return [
        "<!--",
        "  exoad.net — notes for automated readers",
        "",
        "  THE SITE",
        "",
        ...indent(SITE_ABOUT),
        "",
        "  THIS PAGE",
        "",
        ...indent(page.about ?? page.description),
        "",
        "  WHERE THE CONTENT IS",
        "",
        "  This page is client-rendered. The HTML below is a shell; none of what",
        "  is described above is in it. Plain-text copies are published instead:",
        "",
        `    ${ORIGIN}/llms.txt        index of every page on the site`,
        `    ${ORIGIN}/llms-full.txt   every page inlined, one request`,
        `    ${ORIGIN}${`/${page.md}`.padEnd(16)} this page, as markdown`,
        "",
        `  THE PHOTOGRAPHS (${galleryCount})`,
        "",
        "  Listed with the date and camera settings of each frame:",
        "",
        `    ${ORIGIN}/photos.md       a table, one row per frame`,
        `    ${ORIGIN}/photos.json     the same, structured, every variant URL`,
        "",
        "  The gallery paginates on screen. Those files do not — each lists all",
        `  ${galleryCount} frames, so one request is the whole set, and there is no next`,
        "  page to look for. Every frame is served at three sizes: thumb (900px),",
        "  large (2000px), xl (3200px). The images are fetchable directly.",
        "-->",
    ].join("\n");
}

function pageHtml(page, baseHtml, galleryCount) {
    const url = `${ORIGIN}${page.route}`;
    const image = page.image ?? null;

    const head = [
        `<link rel="canonical" href="${esc(url)}" />`,
        `<meta name="description" content="${esc(page.description)}" />`,
        `<meta name="author" content="Jiaming Meng" />`,
        // How a reader asks for this page as markdown instead.
        `<link rel="alternate" type="text/markdown" href="${esc(`${ORIGIN}/${page.md}`)}" title="Markdown" />`,
        `<link rel="alternate" type="application/json" href="${esc(`${ORIGIN}/photos.json`)}" title="Gallery data" />`,
        `<meta property="og:type" content="${esc(page.ogType ?? "website")}" />`,
        `<meta property="og:title" content="${esc(page.title)}" />`,
        `<meta property="og:description" content="${esc(page.description)}" />`,
        `<meta property="og:url" content="${esc(url)}" />`,
        `<meta property="og:site_name" content="exoad" />`,
        `<meta property="og:locale" content="en_US" />`,
        `<meta name="twitter:site" content="@exoad_" />`,
        `<meta name="twitter:creator" content="@exoad_" />`,
        ...(image ? [`<meta property="og:image" content="${esc(image)}" />`] : []),
        `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
        `<meta name="twitter:title" content="${esc(page.title)}" />`,
        `<meta name="twitter:description" content="${esc(page.description)}" />`,
        ...(image ? [`<meta name="twitter:image" content="${esc(image)}" />`] : []),
        ...page.jsonLd.map(
            (block) =>
                `<script type="application/ld+json">${JSON.stringify(block).replace(
                    /</g,
                    "\\u003c",
                )}</script>`,
        ),
    ].join("\n  ");

    // Markdown is the canonical machine copy; the noscript carries a readable
    // digest and says where the full text lives.
    const lines = page.markdown.split("\n");
    const shown = lines.slice(0, 60);
    const omitted = lines.length - shown.length;
    const digest =
        shown.join("\n") +
        (omitted > 0
            ? `\n\n… ${omitted} more lines. This is an excerpt, not the whole page — the complete text is at ${ORIGIN}/${page.md}`
            : "");
    const noscript =
        `<noscript>\n<article>\n<h1>${esc(page.title)}</h1>\n` +
        `<p>${esc(page.description)}</p>\n` +
        `<pre>${esc(digest)}</pre>\n` +
        `<p>Full text as markdown: <a href="${esc(`${ORIGIN}/${page.md}`)}">${esc(
            `/${page.md}`,
        )}</a></p>\n</article>\n</noscript>`;

    return baseHtml
        .replace("<head>", `<head>\n${agentBanner(page, galleryCount)}`)
        .replace("<title>exoad - Jiaming Meng</title>", `<title>${esc(page.title)}</title>`)
        .replace("</head>", `${head}\n</head>`)
        .replace('<div id="root"></div>', `<div id="root"></div>\n${noscript}`);
}

/**
 * The gallery as one JSON document.
 *
 * The point is that a reader needs exactly one request and no traversal: every
 * frame, every size it is served at, and the settings it was shot at. A model
 * that can look at images can go straight from here to the pixels without
 * working out how the page paginates, because this does not paginate.
 */
function photosJson(gallery, picks) {
    return JSON.stringify(
        {
            about: {
                site: SITE_ABOUT,
                page:
                    "The gallery at " +
                    ORIGIN +
                    "/photos: a black page of white monospaced type showing these " +
                    "photographs in a staggered grid, 24 to a screen, each opening " +
                    "into a full-screen viewer with its camera settings beside it. " +
                    "The frames carrying a note are the ones the photographer " +
                    "singled out; the gallery marks them with a white corner.",
                photographer: "Jiaming Meng (exoad)",
            },
            page: `${ORIGIN}/photos`,
            markdown: `${ORIGIN}/photos.md`,
            license: "All rights reserved. Jiaming Meng. Ask before reuse.",
            paginated: false,
            count: gallery.length,
            variants: {
                thumb: { width: 900, note: "900px wide, for scanning the set" },
                large: { longEdge: 2000, note: "what the viewer displays" },
                xl: { longEdge: 3200, note: "largest published size" },
            },
            photos: gallery.map((p, i) => ({
                id: p.id,
                index: i + 1,
                page: `${ORIGIN}/photos/${p.id}`,
                date: p.date,
                width: p.width,
                height: p.height,
                camera: p.camera,
                aperture: p.aperture,
                shutterSeconds: p.shutter,
                shutter: shutter(p.shutter),
                iso: p.iso,
                focalLengthMm: p.focalLength,
                // Set only on the frames the photographer singled out.
                note: picks[p.id] ?? null,
                urls: {
                    thumb: cdn("thumb", p.id),
                    large: cdn("large", p.id),
                    xl: cdn("xl", p.id),
                },
            })),
        },
        null,
        2,
    );
}

/** The page's own description, as a markdown section. */
function pageAbout(page) {
    return ["## About this page", "", page.about ?? page.description, ""].join("\n");
}

/**
 * A markdown twin, opened with what the reader is looking at.
 *
 * The context goes under the heading and above the content, because a table of
 * exposure settings means very little until you know it came from a black
 * gallery of street photographs rather than from, say, a shop.
 */
function withPageContext(page) {
    const [heading, ...rest] = page.markdown.split("\n");
    return [
        heading,
        "",
        "## About this site",
        "",
        SITE_ABOUT,
        "",
        pageAbout(page),
        "---",
        rest.join("\n").replace(/^\n+/, ""),
    ].join("\n");
}

function llmsIndex(pages, { gallery, shared }) {
    return [
        "# exoad — Jiaming Meng",
        "",
        `> ${oneLine(shared.strings.pages.home.about.content)}`,
        "",
        "## The site",
        "",
        SITE_ABOUT,
        "",
        "Every page below is also published as markdown at the same path with",
        "`.md` appended.",
        "",
        "## Pages",
        "",
        `- [Home](${ORIGIN}/index.md): projects, links, and background`,
        `- [Photographs](${ORIGIN}/photos.md): all ${gallery.length} frames — image URL, capture date and camera settings, one row each`,
        "",
        mingAbout(shared.ming),
        "",
        "## Photographs",
        "",
        `All ${gallery.length} are listed in full in the two files below. The gallery page`,
        "paginates on screen; these do not, so one request is the entire set and",
        "there is no next page to look for.",
        "",
        `- [photos.md](${ORIGIN}/photos.md): a table — id, date, camera settings, image URL`,
        `- [photos.json](${ORIGIN}/photos.json): the same, structured, with all three sizes per frame`,
        "",
        "Each frame is published at three sizes:",
        "",
        "```",
        `${cdn("thumb", "<id>")}   900px wide`,
        `${cdn("large", "<id>")}   2000px long edge`,
        `${cdn("xl", "<id>")}      3200px long edge`,
        "```",
        "",
        "The images are fetchable directly — nothing about them is behind the app.",
        "",
        "## Optional",
        "",
        `- [Everything inlined](${ORIGIN}/llms-full.txt): every page above in one file`,
        `- [Sitemap](${ORIGIN}/sitemap.xml): every page, plus every photograph as an image entry`,
        "",
    ].join("\n");
}

/**
 * The page an unmatched URL gets.
 *
 * Cloudflare Pages serves this with a real 404 once the catch-all rewrite is
 * gone — which matters, because answering 200 for every mistyped path invites a
 * search engine to index an unbounded set of duplicates and leaves an agent
 * unable to tell a wrong URL from a right one.
 */
function notFoundHtml(baseHtml, page, galleryCount) {
    return pageHtml(page, baseHtml, galleryCount).replace(
        "</head>",
        '<meta name="robots" content="noindex, follow" />\n</head>',
    );
}


/**
 * Everything the MCP server answers from, in one file.
 *
 * Generated rather than hand-kept so the server and the pages can never
 * disagree: both are downstream of the same source.
 */
function mcpData({ shared, gallery, picks }) {
    const { strings, projects, ming } = shared;
    return JSON.stringify({
        site: {
            url: ORIGIN,
            owner: "Jiaming Meng (exoad)",
            summary: oneLine(strings.pages.home.about.content),
            about: SITE_ABOUT,
            parts: {
                home: ORIGIN + "/",
                photographs: ORIGIN + "/photos",
            },
            machineReadable: {
                index: ORIGIN + "/llms.txt",
                everythingInlined: ORIGIN + "/llms-full.txt",
                gallery: ORIGIN + "/photos.json",
                markdown: "Append .md to any page path, or send Accept: text/markdown.",
            },
        },
        ming: {
            name: ming.name,
            site: ming.site,
            contact: ming.email,
            relationship:
                "A separate agent by the same person, kept at its own address. It " +
                "documents no API; ask Ming.",
        },
        photos: gallery.map((p, i) => ({
            id: p.id,
            index: i + 1,
            page: `${ORIGIN}/photos/${p.id}`,
            date: p.date,
            camera: p.camera,
            aperture: p.aperture,
            shutter: shutter(p.shutter),
            iso: p.iso,
            focalLengthMm: p.focalLength,
            width: p.width,
            height: p.height,
            note: picks[p.id] ?? null,
            urls: {
                thumb: cdn("thumb", p.id),
                large: cdn("large", p.id),
                xl: cdn("xl", p.id),
            },
        })),
        projects: [...projects]
            .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
            .map((p) => ({
                title: p.title,
                year: p.year,
                state: p.state,
                featured: p.featured,
                description: oneLine(p.description),
                technologies: (p.technologies ?? []).map((t) => t.name),
                link: p.link,
            })),
    });
}

/** Declares the site public, so an agent stops looking for credentials. */
function authMd() {
    return [
        "# auth.md",
        "",
        "exoad.net is a static personal site. Every page, every photograph and every",
        "data file on it is public, and no part of it requires authentication.",
        "",
        "## Audience",
        "",
        "Anyone, human or automated. Nothing is gated and nothing is metered.",
        "",
        "## Registration",
        "",
        "None. There is no account to create, no key to request and no endpoint that",
        "issues credentials, because nothing here checks for any.",
        "",
        "## Credential methods",
        "",
        "None. Requests are served unauthenticated. There is no OAuth authorization",
        "server and no protected resource, so /.well-known/oauth-authorization-server",
        "and /.well-known/oauth-protected-resource are deliberately absent rather than",
        "missing by oversight.",
        "",
        "## What is available",
        "",
        `- MCP over Streamable HTTP: ${ORIGIN}/mcp — read-only tools, no auth`,
        `- The gallery as JSON: ${ORIGIN}/photos.json`,
        `- An index of every page: ${ORIGIN}/llms.txt`,
        "",
        "## Contact",
        "",
        "jackm@exoad.net, or Ming, which answers for itself: ming@exoad.net",
        "",
    ].join("\n");
}

function mcpServerCard() {
    return JSON.stringify(
        {
            serverInfo: { name: "exoad.net", version: "1.0.0" },
            transport: { type: "streamable-http", endpoint: `${ORIGIN}/mcp` },
            capabilities: { tools: true, resources: false, prompts: false },
            description:
                "Read-only access to exoad.net: its photographs and the settings they " +
                "were shot at, and its projects.",
            authentication: { required: false },
            documentation: `${ORIGIN}/llms.txt`,
        },
        null,
        2,
    );
}

/**
 * A skill is only worth publishing if it says something an agent could not
 * work out on its own, so this one is about the shape of the data rather than
 * about the site being nice. The digest is computed over what is actually
 * written, so the index can never advertise a stale hash.
 */
function agentSkill(gallery) {
    return [
        "---",
        "name: read-exoad",
        "description: Read exoad.net's photographs and projects without scraping the site",
        "---",
        "",
        "# Reading exoad.net",
        "",
        "The site is a client-rendered SPA: fetching a page returns a shell with no",
        "content in it. Do not scrape the HTML. Use these instead.",
        "",
        "## The whole site as text",
        "",
        `- \`${ORIGIN}/llms.txt\` — an index of every page`,
        `- \`${ORIGIN}/llms-full.txt\` — every page inlined, one request`,
        "- Any page path with `.md` appended, or send `Accept: text/markdown` to the",
        "  page's own URL and the markdown comes back from there.",
        "",
        "## The photographs",
        "",
        `\`${ORIGIN}/photos.json\` holds all ${gallery.length} in one request. It does not`,
        "paginate; there is no next page to look for. Each entry carries its capture",
        "date, camera settings, dimensions, a permalink, and three image URLs:",
        "",
        "```",
        `${cdn("thumb", "<id>")}   900px wide`,
        `${cdn("large", "<id>")}   2000px long edge`,
        `${cdn("xl", "<id>")}      3200px long edge`,
        "```",
        "",
        "The images are fetchable directly. A `note` field is set only on the few",
        "frames the photographer singled out; the gallery marks those with a white",
        "corner. One photograph lives at `/photos/<id>`.",
        "",
        "## As tools",
        "",
        `\`${ORIGIN}/mcp\` speaks MCP over Streamable HTTP: describe_site,`,
        "list_photographs, get_photograph, list_projects. Read-only, and",
        "no authentication — see `/auth.md`.",
        "",
    ].join("\n");
}

function agentSkillsIndex(skillBody) {
    const digest = createHash("sha256").update(skillBody).digest("hex");
    return JSON.stringify(
        {
            $schema: "https://agentskills.io/schemas/discovery/v0.2.0.json",
            skills: [
                {
                    name: "read-exoad",
                    type: "text/markdown",
                    description:
                        "Read exoad.net's photographs and projects without scraping " +
                        "the site.",
                    url: `${ORIGIN}/.well-known/agent-skills/read-exoad/SKILL.md`,
                    sha256: digest,
                },
            ],
        },
        null,
        2,
    );
}

function sitemapXml(pages, gallery) {
    const today = new Date().toISOString().slice(0, 10);
    const newestPhoto = gallery[0]?.date ?? today;
    const entry = (page) => {
        const lastmod =
            page.lastmod ?? (page.route === "/photos" ? newestPhoto : today);
        const priority = page.route === "/" ? "1.0" : page.route.startsWith("/photos/") ? "0.6" : "0.8";
        // The gallery declares every photograph it holds; a photo site that
        // does not is invisible to image search.
        const images =
            page.route === "/photos"
                ? gallery.map((p) =>
                      [
                          "    <image:image>",
                          `      <image:loc>${cdn("large", p.id)}</image:loc>`,
                          "    </image:image>",
                      ].join("\n"),
                  )
                : [];
        return [
            "  <url>",
            `    <loc>${ORIGIN}${page.route}</loc>`,
            `    <lastmod>${lastmod}</lastmod>`,
            `    <priority>${priority}</priority>`,
            ...images,
            "  </url>",
        ].join("\n");
    };
    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
        ...pages.map(entry),
        "</urlset>",
        "",
    ].join("\n");
}

function write(relPath, contents) {
    const target = resolve("dist", relPath);
    mkdirSync(resolve(target, ".."), { recursive: true });
    writeFileSync(target, contents);
}

export default function agentSurfacePlugin() {
    return {
        name: "agent-surface",
        enforce: "post",

        async closeBundle() {
            let shared;
            try {
                shared = await loadShared();
            } catch (err) {
                // Never fail the site build over the machine-readable copy.
                console.error("agent-surface: could not read shared.ts —", err.message);
                return;
            }

            const picks = await loadPicks();
            const gallery = loadGallery();
            const baseHtml = readFileSync(INDEX_HTML, "utf8");
            const pages = buildPages({ shared, gallery, picks });

            for (const page of pages) {
                const html = pageHtml(page, baseHtml, gallery.length);
                write(page.html, html);
                write(page.md, `${withPageContext(page)}\n`);
            }

            write("photos.json", photosJson(gallery, picks) + "\n");
            write("mcp-data.json", mcpData({ shared, gallery, picks }) + "\n");
            write(".well-known/mcp/server-card.json", mcpServerCard() + "\n");
            write("auth.md", authMd());
            const skill = agentSkill(gallery);
            write(".well-known/agent-skills/read-exoad/SKILL.md", skill);
            write(".well-known/agent-skills/index.json", agentSkillsIndex(skill) + "\n");

            // Not in `pages`: it is the answer to a request for something that
            // does not exist, so it has no canonical URL and no place in the
            // sitemap.
            write(
                "404.html",
                notFoundHtml(
                    baseHtml,
                    {
                        route: "/404",
                        md: "llms.txt",
                        title: "Not found | exoad",
                        description: "No page at this address.",
                        about:
                            "An address that does not exist on exoad.net. The site has two\n" +
                            "parts — a home page and a photo gallery — both listed in llms.txt.",
                        jsonLd: [],
                        markdown: "# Not found\n\nNo page at this address.",
                    },
                    gallery.length,
                ),
            );
            write("llms.txt", llmsIndex(pages, { gallery, shared }));
            write(
                "llms-full.txt",
                [
                    "# exoad.net — every page, inlined",
                    "",
                    "## About this site",
                    "",
                    SITE_ABOUT,
                    "",
                    ...pages.map((p) => {
                        const [heading, ...rest] = p.markdown.split("\n");
                        return [
                            "---",
                            "",
                            heading,
                            "",
                            pageAbout(p),
                            rest.join("\n").replace(/^\n+/, ""),
                        ].join("\n");
                    }),
                ].join("\n") + "\n",
            );
            write("sitemap.xml", sitemapXml(pages, gallery));

            console.log(
                `agent-surface: ${pages.length} routes (html + md), llms.txt, llms-full.txt, ` +
                    `photos.json, 404.html, sitemap.xml`,
            );
        },
    };
}
