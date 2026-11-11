/**
 * Markdown content negotiation.
 *
 * The site publishes a markdown twin of every page, but a reader had to know to
 * ask for `/photos.md`. This serves the same file from the page's own URL when
 * the request prefers markdown — Cloudflare's "Markdown for Agents" behaviour —
 * while a browser, which asks for HTML, gets the page untouched.
 *
 * Middleware runs in front of every request it is routed, so the whole thing is
 * wrapped: any failure falls through to the normal response rather than taking
 * a page down with it.
 */

const ORIGIN = "https://exoad.net";

/**
 * The only pages that have a twin: the home page, the gallery, and one
 * photograph. Matched against the normalised path, so encoded dot segments
 * (`/photos/%2e%2e/auth`) cannot reach any other markdown file in the build.
 */
const PAGE = /^\/(?:photos(?:\/[a-z0-9]+)?)?\/?$/i;

/** The q-value an Accept header gives a media type, or 0 when it is absent. */
function quality(accept, type) {
    let best = 0;
    for (const part of accept.split(",")) {
        const [range, ...params] = part.trim().toLowerCase().split(";");
        if (range !== type) continue;
        const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
        const value = q ? Number.parseFloat(q.slice(2)) : 1;
        if (Number.isFinite(value)) best = Math.max(best, value);
    }
    return best;
}

/** Markdown only when it is asked for and not ranked below HTML. */
function prefersMarkdown(accept) {
    const md = quality(accept, "text/markdown");
    return md > 0 && md >= quality(accept, "text/html");
}

/** "/" -> "/index", "/photos/x/" -> "/photos/x" */
const trim = (pathname) => pathname.replace(/\/+$/, "") || "/index";

/** The HTML and the markdown are one page at one address; caches must not cross them. */
function withVary(response) {
    const res = new Response(response.body, response);
    res.headers.append("Vary", "Accept");
    return res;
}

export async function onRequest(context) {
    const { request, next, env } = context;

    try {
        const url = new URL(request.url);
        const isRead = request.method === "GET" || request.method === "HEAD";
        if (!isRead || !PAGE.test(url.pathname)) return next();

        if (!prefersMarkdown(request.headers.get("Accept") ?? "")) return withVary(await next());

        const path = trim(url.pathname);
        const asset = await env.ASSETS.fetch(
            new Request(`${url.origin}${path}.md`, { method: "GET", headers: { Accept: "text/markdown" } }),
        );

        // No twin for this path — let the normal response answer.
        if (!asset.ok) return withVary(await next());

        // Keep what the asset carries (ETag, caching, the headers from _headers)
        // and say what this response is.
        const headers = new Headers(asset.headers);
        headers.set("Content-Type", "text/markdown; charset=utf-8");
        headers.append("Vary", "Accept");
        headers.append("Link", `<${ORIGIN}${path === "/index" ? "/" : path}>; rel="canonical"`);
        headers.set("X-Robots-Tag", "noindex");

        return new Response(request.method === "HEAD" ? null : asset.body, { status: 200, headers });
    } catch {
        return next();
    }
}
