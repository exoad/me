// Draws the link-preview card and writes it to public/og.jpg.
//
//   node scripts/og.mjs
//
// 1200x630, the size every unfurler asks for: the six newest photographs as a
// grey band across the top, the way the home page opens, and the name set
// large underneath. Re-run it after adding photographs so the card keeps
// showing the newest ones.
//
// The name is set in the site's own face from scripts/fonts; the small
// "exoad.net" goes through SVG in whatever system font this machine has. The
// card is generated here and committed as a static file rather than drawn
// during the Cloudflare build.

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import sharp from "sharp";
import opentype from "opentype.js";

const W = 1200;
const H = 630;
const BAND = 6;
const BAND_H = 300;
const GAP = 2;
const GUTTER = 64;
// OG_CDN overrides where the thumbnails come from (e.g. a mirror while testing).
const CDN = process.env.OG_CDN ?? "https://photos.exoad.net/gallery/thumb";
const FONT = "'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif";

const gallery = JSON.parse(readFileSync(resolve("src/data/gallery.json"), "utf8"));
// gallery.json is kept newest first; the home page band takes the same slice.
const recent = gallery.slice(0, BAND);
if (recent.length === 0) throw new Error("src/data/gallery.json has no photographs");

// Each frame's share of the band is its aspect ratio, as on the home page, and
// the band is cropped to a common height the same way.
const ratio = (p) => p.thumbWidth / p.thumbHeight;
const total = recent.reduce((sum, p) => sum + ratio(p), 0);
const room = W - GAP * (recent.length - 1);
let x = 0;
const frames = recent.map((p, i) => {
    const left = x;
    const right = i === recent.length - 1 ? W : Math.round(x + (room * ratio(p)) / total);
    x = right + GAP;
    return { ...p, left, width: right - left };
});

const tiles = await Promise.all(
    frames.map(async (f) => {
        const url = `${CDN}/${f.id}.webp`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${url}: ${res.status}`);
        const input = await sharp(Buffer.from(await res.arrayBuffer()))
            .resize(f.width, BAND_H, { fit: "cover", position: "attention" })
            .grayscale()
            .toBuffer();
        return { input, left: f.left, top: 0 };
    }),
);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const NAME_SIZE = 128;
const BASELINE = 512;

// The name in the site's own face, Bricolage Grotesque 800, from the same
// letters-only subset the home page uses. It is turned into outlines here, so
// the card comes out the same on any machine whatever fonts it has installed.
// Tracking -30/1000 em matches the page's -0.03em.
const nameFont = opentype.loadSync(resolve("scripts/fonts/bricolage-name-800.ttf"));
const namePath = nameFont
    .getPath("Jiaming Meng", GUTTER - 4, BASELINE, NAME_SIZE, { kerning: true, tracking: -30 })
    .toPathData(2);

const type = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
        `<path d="${namePath}" fill="#fff"/>` +
        `<text x="${W - GUTTER}" y="${BASELINE}" text-anchor="end" font-family="${FONT}" ` +
        `font-size="30" letter-spacing="0.6" fill="#8f8f8f">${esc("exoad.net")}</text>` +
        `</svg>`,
);

const jpg = await sharp({ create: { width: W, height: H, channels: 3, background: "#000" } })
    .composite([...tiles, { input: type, left: 0, top: 0 }])
    .jpeg({ quality: 82, progressive: true, mozjpeg: true, chromaSubsampling: "4:2:0" })
    .toBuffer();

writeFileSync(resolve("public/og.jpg"), jpg);
console.log(`  public/og.jpg  ${W}x${H}  ${(jpg.length / 1024).toFixed(1)} KB  (${recent.map((p) => p.id).join(", ")})`);
