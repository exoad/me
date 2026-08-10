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

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import matter from "gray-matter";
import { build as esbuild } from "esbuild";

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
    "photographs cities. It is a small static site with three parts: a home page,",
    "a blog, and a photo gallery.",
    "",
    "It is built in two deliberately unlike halves. The home page and the blog are",
    "a plain document — a single narrow column of dark serif text on a cream",
    "background, blue links, hairline rules, no ornament. The gallery is the",
    "opposite and is meant to be: pure black, white monospaced type, square",
    "corners, and none of the site's navigation, so that nothing competes with the",
    "photographs.",
].join("\n");
const BLOG_DIR = resolve("src/content/blog");
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

function loadBlogPosts() {
    try {
        return readdirSync(BLOG_DIR)
            .filter((f) => f.endsWith(".md"))
            .map((f) => {
                const raw = readFileSync(resolve(BLOG_DIR, f), "utf8");
                const { data, content } = matter(raw);
                return {
                    slug: f.replace(/\.md$/, ""),
                    title: data.title || f,
                    excerpt: data.excerpt || "",
                    date: data.date || "",
                    tags: data.tags || [],
                    coverImage: data.cover_image || null,
                    body: content.trim(),
                };
            })
            .sort((a, b) => String(b.date).localeCompare(String(a.date)));
    } catch {
        return [];
    }
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

function buildPages({ shared, posts, gallery, picks }) {
    const { strings, projects, featuredProjects } = shared;
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
            "The home page. One narrow column of dark serif text on a cream",
            "background, read top to bottom, in this order: a tagline with links to",
            "GitHub, LinkedIn and X; a paragraph of background; a row of the six",
            "newest photographs linking into the gallery; the two most recent posts;",
            "every project as a collapsible row showing its languages, year and",
            "state; and two contact addresses.",
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
            "## Featured projects",
            "",
            ...[...featuredProjects].sort(byYear).map(projectLine),
            "",
            "## All projects",
            "",
            ...projects.filter((p) => !p.featured).sort(byYear).map(projectLine),
            "",
            "## Elsewhere on this site",
            "",
            `- [Photographs](${ORIGIN}/photos) — ${gallery.length} frames`,
            `- [Writing](${ORIGIN}/blog) — ${posts.length} post${posts.length === 1 ? "" : "s"}`,
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
            "A few frames carry a small gold triangle in their top-left corner. That",
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
            "| # | ID | Date | Settings | Note | Image (2000px) |",
            "| --- | --- | --- | --- | --- | --- |",
            ...gallery.map(
                (p, i) =>
                    `| ${String(i + 1).padStart(3, "0")} | ${p.id} | ${p.date ?? "—"} | ${
                        exposureLine(p) || "—"
                    } | ${picks[p.id] ?? "—"} | ${cdn("large", p.id)} |`,
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

    const blogIndex = {
        route: "/blog",
        html: "blog.html",
        md: "blog.md",
        title: "Writing | exoad",
        description: oneLine(strings.pages.blog.description),
        about: [
            "The writing index: every post as a title, date and tags on a cream",
            "background, in the same plain document style as the home page. The full",
            "text of each post is a separate page, and is published as markdown at",
            "the same path with .md appended.",
        ].join("\n"),
        image: posts[0]?.coverImage ? abs(posts[0].coverImage) : null,
        markdown: [
            "# Writing",
            "",
            `> ${oneLine(strings.pages.blog.description)}`,
            "",
            ...posts.flatMap((p) => [
                `## [${p.title}](${ORIGIN}/blog/${p.slug})`,
                "",
                `${p.date}${p.tags?.length ? ` · ${p.tags.join(", ")}` : ""}`,
                "",
                oneLine(p.excerpt),
                "",
                `Full text: ${ORIGIN}/blog/${p.slug}.md`,
                "",
            ]),
        ].join("\n"),
        jsonLd: [
            {
                "@context": "https://schema.org",
                "@type": "Blog",
                name: "exoad — Writing",
                url: `${ORIGIN}/blog`,
                author: { "@type": "Person", name: "Jiaming Meng", url: ORIGIN },
                blogPost: posts.map((p) => ({
                    "@type": "BlogPosting",
                    headline: p.title,
                    url: `${ORIGIN}/blog/${p.slug}`,
                    datePublished: p.date,
                    keywords: p.tags,
                    abstract: oneLine(p.excerpt),
                })),
            },
        ],
    };

    const postPages = posts.map((post) => ({
        route: `/blog/${post.slug}`,
        html: `blog/${post.slug}.html`,
        md: `blog/${post.slug}.md`,
        title: `${post.title} | exoad`,
        description: oneLine(post.excerpt),
        image: post.coverImage ? abs(post.coverImage) : `${ORIGIN}/og-${post.slug}.jpg`,
        ogType: "article",
        about: [
            "One article, set as a single column of serif text on cream, with",
            "headings, code blocks and images inline. The whole of it — not an",
            "excerpt — is published as markdown at this path with .md appended.",
        ].join("\n"),
        markdown: [
            `# ${post.title}`,
            "",
            `> ${oneLine(post.excerpt)}`,
            "",
            `Published ${post.date}${post.tags?.length ? ` · ${post.tags.join(", ")}` : ""}`,
            "",
            post.body,
        ].join("\n"),
        jsonLd: [
            {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: post.title,
                url: `${ORIGIN}/blog/${post.slug}`,
                datePublished: post.date,
                dateModified: post.date,
                keywords: post.tags,
                abstract: oneLine(post.excerpt),
                author: { "@type": "Person", name: "Jiaming Meng", url: ORIGIN },
                publisher: { "@type": "Person", name: "Jiaming Meng", url: ORIGIN },
                ...(post.coverImage ? { image: abs(post.coverImage) } : {}),
            },
        ],
        lastmod: post.date,
    }));

    return [home, photos, blogIndex, ...postPages];
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
        `<link rel="alternate" type="application/rss+xml" href="${esc(`${ORIGIN}/feed.xml`)}" title="exoad — Writing" />`,
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
                    "singled out; the gallery marks them with a gold corner.",
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

function llmsIndex(pages, { posts, gallery, shared }) {
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
        `- [Writing](${ORIGIN}/blog.md): index of ${posts.length} post${posts.length === 1 ? "" : "s"}`,
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
        "## Posts",
        "",
        ...posts.map((p) => `- [${p.title}](${ORIGIN}/blog/${p.slug}.md): ${oneLine(p.excerpt)}`),
        "",
        "## Optional",
        "",
        `- [Everything inlined](${ORIGIN}/llms-full.txt): every page above in one file`,
        `- [Sitemap](${ORIGIN}/sitemap.xml): every page, plus every photograph as an image entry`,
        `- [RSS](${ORIGIN}/feed.xml): the writing, as a feed`,
        "",
    ].join("\n");
}

/**
 * RSS for the writing. Readers and aggregators expect one at a stable path, and
 * a blog without a feed is a blog nobody can subscribe to.
 */
function feedXml(posts) {
    const rfc822 = (date) => {
        const d = new Date(`${date}T12:00:00Z`);
        return Number.isNaN(d.getTime()) ? "" : d.toUTCString();
    };
    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
        "  <channel>",
        "    <title>exoad — Writing</title>",
        `    <link>${ORIGIN}/blog</link>`,
        "    <description>Thoughts, writeups, and technical deep dives by Jiaming Meng.</description>",
        "    <language>en-us</language>",
        `    <atom:link href="${ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />`,
        ...posts.flatMap((post) => [
            "    <item>",
            `      <title>${esc(post.title)}</title>`,
            `      <link>${ORIGIN}/blog/${post.slug}</link>`,
            `      <guid isPermaLink="true">${ORIGIN}/blog/${post.slug}</guid>`,
            `      <pubDate>${rfc822(post.date)}</pubDate>`,
            `      <description>${esc(oneLine(post.excerpt))}</description>`,
            ...post.tags.map((t) => `      <category>${esc(t)}</category>`),
            "    </item>",
        ]),
        "  </channel>",
        "</rss>",
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

function sitemapXml(pages, gallery) {
    const today = new Date().toISOString().slice(0, 10);
    const newestPhoto = gallery[0]?.date ?? today;
    const entry = (page) => {
        const lastmod =
            page.lastmod ?? (page.route === "/photos" ? newestPhoto : today);
        const priority = page.route === "/" ? "1.0" : page.route.startsWith("/blog/") ? "0.6" : "0.8";
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

            const posts = loadBlogPosts();
            const picks = await loadPicks();
            const gallery = loadGallery();
            const baseHtml = readFileSync(INDEX_HTML, "utf8");
            const pages = buildPages({ shared, posts, gallery, picks });

            for (const page of pages) {
                const html = pageHtml(page, baseHtml, gallery.length);
                write(page.html, html);
                write(page.md, `${withPageContext(page)}\n`);
            }

            write("photos.json", photosJson(gallery, picks) + "\n");
            write("feed.xml", feedXml(posts));

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
                            "An address that does not exist on exoad.net. The site has three\n" +
                            "parts — a home page, a blog, and a photo gallery — all listed in\n" +
                            "llms.txt.",
                        jsonLd: [],
                        markdown: "# Not found\n\nNo page at this address.",
                    },
                    gallery.length,
                ),
            );
            write("llms.txt", llmsIndex(pages, { posts, gallery, shared }));
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
                    `photos.json, feed.xml, 404.html, sitemap.xml`,
            );
        },
    };
}
