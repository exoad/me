/**
 * Markdown content negotiation.
 *
 * The site already publishes a markdown twin of every page, but a reader had to
 * know to ask for `/photos.md`. This serves the same file from the page's own
 * URL when the request says it would rather have markdown — Cloudflare's
 * "Markdown for Agents" behaviour — while a browser, which asks for HTML, is
 * untouched.
 *
 * Middleware runs in front of every request on the site, so the whole thing is
 * wrapped: any failure falls through to the normal response rather than taking
 * a page down with it.
 */

/** Requests for a real file, or anything that is not a plain read, pass straight through. */
function isNegotiable(request, url) {
    if (request.method !== "GET" && request.method !== "HEAD") return false;
    // A path with an extension is already an exact asset (/photos.md, /app.js).
    if (/\.[a-z0-9]+$/i.test(url.pathname)) return false;
    if (url.pathname.startsWith("/assets/")) return false;
    return (request.headers.get("Accept") ?? "").includes("text/markdown");
}

/** "/" -> "/index.md", "/photos/x/" -> "/photos/x.md" */
function markdownPath(pathname) {
    const trimmed = pathname.replace(/\/+$/, "");
    return trimmed === "" ? "/index.md" : `${trimmed}.md`;
}

export async function onRequest(context) {
    const { request, next, env } = context;

    try {
        const url = new URL(request.url);
        if (!isNegotiable(request, url)) return next();

        const asset = await env.ASSETS.fetch(
            new Request(new URL(markdownPath(url.pathname), url).toString(), {
                method: "GET",
                headers: { Accept: "text/markdown" },
            }),
        );

        // No twin for this path — let the normal response answer.
        if (!asset.ok) return next();

        return new Response(request.method === "HEAD" ? null : asset.body, {
            status: 200,
            headers: {
                "Content-Type": "text/markdown; charset=utf-8",
                // The HTML and the markdown are the same page at one address;
                // caches must not serve one to a client that asked for the other.
                Vary: "Accept",
                Link: `<${url.origin}${url.pathname}>; rel="canonical"`,
                "X-Robots-Tag": "noindex",
            },
        });
    } catch {
        return next();
    }
}
