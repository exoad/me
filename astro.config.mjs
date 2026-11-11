import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import agentSurface from "./agent-surface.mjs";

export default defineConfig({
    site: "https://exoad.net",
    output: "static",
    outDir: "dist",
    // Built as /photos.html rather than /photos/index.html: Pages serves the
    // first straight from /photos, but answers the second with a redirect.
    build: { format: "file", assets: "assets" },
    trailingSlash: "never",
    // The gallery is written against the React API; compat runs it on Preact
    // at a fraction of React's size.
    integrations: [preact({ compat: true }), agentSurface()],
    image: {
        // The home page's photo band is resized from these at build time.
        domains: ["cdn.jsdelivr.net"],
    },
    devToolbar: { enabled: false },
    // The gallery's interactions are its own; the home page is plain links.
    prefetch: false,
});
