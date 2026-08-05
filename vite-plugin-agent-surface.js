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
//   dist/sitemap.xml          real lastmod dates, every route and post

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import matter from "gray-matter";
import { build as esbuild } from "esbuild";

const ORIGIN = "https://exoad.net";
const BLOG_DIR = resolve("src/content/blog");
const INDEX_HTML = resolve("dist/index.html");

/* ---------- reading the site's own data ---------- */

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

    const result = await esbuild({
        entryPoints: [resolve("src/data/shared.ts")],
        bundle: true,
        write: false,
        format: "esm",
        platform: "node",
        logLevel: "silent",
        plugins: [stub],
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

function buildPages({ shared, posts, gallery }) {
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
        image: gallery[0] ? cdn("large", gallery[0].id) : null,
        markdown: [
            "# Photographs",
            "",
            `> ${oneLine(strings.pages.photos.description)}`,
            "",
            `${gallery.length} frames${newest ? `, most recent ${newest}` : ""}. ` +
                "Shot by Jiaming Meng. Each entry lists its capture date and camera settings.",
            "",
            "| # | Date | Settings | Image |",
            "| --- | --- | --- | --- |",
            ...gallery.map(
                (p, i) =>
                    `| ${String(i + 1).padStart(3, "0")} | ${p.date ?? "—"} | ${
                        exposureLine(p) || "—"
                    } | ${cdn("large", p.id)} |`,
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
function pageHtml(page, baseHtml) {
    const url = `${ORIGIN}${page.route}`;
    const image = page.image ?? null;

    const head = [
        `<link rel="canonical" href="${esc(url)}" />`,
        `<meta name="description" content="${esc(page.description)}" />`,
        `<meta name="author" content="Jiaming Meng" />`,
        // How a reader asks for this page as markdown instead.
        `<link rel="alternate" type="text/markdown" href="${esc(`${ORIGIN}/${page.md}`)}" title="Markdown" />`,
        `<meta property="og:type" content="${esc(page.ogType ?? "website")}" />`,
        `<meta property="og:title" content="${esc(page.title)}" />`,
        `<meta property="og:description" content="${esc(page.description)}" />`,
        `<meta property="og:url" content="${esc(url)}" />`,
        `<meta property="og:site_name" content="exoad" />`,
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
    const digest = page.markdown.split("\n").slice(0, 40).join("\n");
    const noscript =
        `<noscript>\n<article>\n<h1>${esc(page.title)}</h1>\n` +
        `<p>${esc(page.description)}</p>\n` +
        `<pre>${esc(digest)}</pre>\n` +
        `<p>Full text as markdown: <a href="${esc(`${ORIGIN}/${page.md}`)}">${esc(
            `/${page.md}`,
        )}</a></p>\n</article>\n</noscript>`;

    return baseHtml
        .replace("<title>exoad - Jiaming Meng</title>", `<title>${esc(page.title)}</title>`)
        .replace("</head>", `${head}\n</head>`)
        .replace('<div id="root"></div>', `<div id="root"></div>\n${noscript}`);
}

function llmsIndex(pages, { posts, gallery, shared }) {
    return [
        "# exoad — Jiaming Meng",
        "",
        `> ${oneLine(shared.strings.pages.home.about.content)}`,
        "",
        "Personal site of Jiaming Meng (exoad): software projects, writing, and photography.",
        "Every page below is also available as markdown by appending `.md` to its path.",
        "",
        "## Pages",
        "",
        `- [Home](${ORIGIN}/index.md): projects, links, and background`,
        `- [Photographs](${ORIGIN}/photos.md): ${gallery.length} frames with capture dates and camera settings`,
        `- [Writing](${ORIGIN}/blog.md): index of ${posts.length} post${posts.length === 1 ? "" : "s"}`,
        "",
        "## Posts",
        "",
        ...posts.map((p) => `- [${p.title}](${ORIGIN}/blog/${p.slug}.md): ${oneLine(p.excerpt)}`),
        "",
        "## Optional",
        "",
        `- [Everything inlined](${ORIGIN}/llms-full.txt): every page above in one file`,
        `- [Sitemap](${ORIGIN}/sitemap.xml)`,
        "",
    ].join("\n");
}

function sitemapXml(pages, gallery) {
    const today = new Date().toISOString().slice(0, 10);
    const newestPhoto = gallery[0]?.date ?? today;
    const entry = (page) => {
        const lastmod =
            page.lastmod ?? (page.route === "/photos" ? newestPhoto : today);
        const priority = page.route === "/" ? "1.0" : page.route.startsWith("/blog/") ? "0.6" : "0.8";
        return [
            "  <url>",
            `    <loc>${ORIGIN}${page.route}</loc>`,
            `    <lastmod>${lastmod}</lastmod>`,
            `    <priority>${priority}</priority>`,
            "  </url>",
        ].join("\n");
    };
    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
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
            const gallery = loadGallery();
            const baseHtml = readFileSync(INDEX_HTML, "utf8");
            const pages = buildPages({ shared, posts, gallery });

            for (const page of pages) {
                const html = pageHtml(page, baseHtml);
                write(page.html, html);
                write(page.md, `${page.markdown}\n`);
            }

            write("llms.txt", llmsIndex(pages, { posts, gallery, shared }));
            write(
                "llms-full.txt",
                pages.map((p) => p.markdown).join("\n\n---\n\n") + "\n",
            );
            write("sitemap.xml", sitemapXml(pages, gallery));

            console.log(
                `agent-surface: ${pages.length} routes (html + md), llms.txt, llms-full.txt, sitemap.xml`,
            );
        },
    };
}
