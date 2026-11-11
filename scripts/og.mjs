// Draws the link-preview card and writes it to public/og.jpg.
//
//   node scripts/og.mjs
//
// 1200x630, the size every unfurler asks for: the six newest photographs as a
// grey band across the top, the way the home page opens, and the name set
// large underneath. Re-run it after adding photographs so the card keeps
// showing the newest ones.
//
// The type is rendered through SVG, so it comes out in whatever system font
// the machine running this has (Segoe UI on Windows, Helvetica Neue on a Mac).
// That is why the card is generated here and committed as a static file rather
// than drawn during the Cloudflare build, whose fonts are unknown.

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import sharp from "sharp";

const W = 1200;
const H = 630;
const BAND = 6;
const BAND_H = 300;
const GAP = 2;
const GUTTER = 64;
const CDN = "https://cdn.jsdelivr.net/gh/meng-jack/me-pictures-bucket@main/gallery/thumb";
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
const type = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
        `<text x="${GUTTER - 6}" y="${BASELINE}" font-family="${FONT}" font-weight="700" ` +
        `font-size="${NAME_SIZE}" letter-spacing="${-0.05 * NAME_SIZE}" fill="#fff">${esc("Jiaming Meng")}</text>` +
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
