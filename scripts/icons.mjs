// Draws the site's mark and writes every favicon size into public/.
//
//   node scripts/icons.mjs
//
// The mark is the gallery veil's: a small square outline turned 45 degrees,
// white on black. Two drawings of it, because one cannot serve both ends:
//
//   - At 16 and 32 pixels it is placed on the pixel grid by hand, so every
//     edge is a whole pixel. A smooth vector diamond at those sizes is
//     antialiased into a grey ring that reads as a circle.
//   - At 180 and up it is a plain vector, thinner and with room around it, so
//     it survives the rounded masks iOS and Android cut it into.
//
// favicon.svg is the 16-pixel drawing as rects with crispEdges, so a browser
// that picks it for a tab gets the same hard pixels at 16, 32 and 48.

import { writeFileSync } from "fs";
import { resolve } from "path";
import sharp from "sharp";

const OUT = resolve("public");
const FG = [255, 255, 255];
const BG = [0, 0, 0];

/**
 * The diamond as whole pixels on an n-by-n grid.
 *
 * A pixel is lit when its centre lies within `weight` steps inside the
 * diamond's edge, measured in the diamond's own (taxicab) distance. That
 * draws each side as a staircase `weight` pixels wide per row, which is what
 * gives a 45-degree line its visual weight on a grid, and keeps the shape
 * symmetric across both axes and both diagonals.
 */
function pixelDiamond(n, radius, weight) {
    const half = n / 2;
    const on = [];
    for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
            const d = Math.abs(x + 0.5 - half) + Math.abs(y + 0.5 - half);
            if (d <= radius && d > radius - weight) on.push([x, y]);
        }
    }
    return on;
}

function rawRgba(n, pixels) {
    const buf = Buffer.alloc(n * n * 4);
    for (let i = 0; i < n * n; i++) buf.set([...BG, 255], i * 4);
    for (const [x, y] of pixels) buf.set([...FG, 255], (y * n + x) * 4);
    return buf;
}

const pngFromRaw = (n, raw) =>
    sharp(raw, { raw: { width: n, height: n, channels: 4 } }).png({ compressionLevel: 9 }).toBuffer();

/** The 16-pixel drawing as an SVG: each row's runs of lit pixels as one path. */
function pixelSvg(n, pixels) {
    const lit = new Set(pixels.map(([x, y]) => y * n + x));
    let d = "";
    for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
            if (!lit.has(y * n + x)) continue;
            let w = 1;
            while (x + w < n && lit.has(y * n + x + w)) w++;
            d += `M${x} ${y}h${w}v1h-${w}z`;
            x += w;
        }
    }
    return [
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges">`,
        `<rect width="${n}" height="${n}" fill="#000"/>`,
        `<path fill="#fff" d="${d}"/>`,
        `</svg>`,
    ].join("");
}

/** The large drawing: a vector diamond spanning 60% of the tile. */
function smoothSvg(size) {
    const c = size / 2;
    const r = size * 0.3;
    const stroke = size * 0.045;
    return Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
            `<rect width="${size}" height="${size}" fill="#000"/>` +
            `<path d="M${c} ${c - r}L${c + r} ${c}L${c} ${c + r}L${c - r} ${c}Z" fill="none" stroke="#fff" stroke-width="${stroke}" stroke-linejoin="miter"/>` +
            `</svg>`,
    );
}

/**
 * An .ico holding uncompressed 32-bit BMP images.
 *
 * BMP rather than embedded PNG because every reader of .ico understands it,
 * down to the oldest; the files are small at these sizes either way.
 */
function ico(images) {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(images.length, 4);

    const bodies = images.map(({ n, raw }) => {
        const info = Buffer.alloc(40);
        const maskRow = Math.ceil(n / 32) * 4;
        info.writeUInt32LE(40, 0);
        info.writeInt32LE(n, 4);
        info.writeInt32LE(n * 2, 8); // colour rows plus the AND mask rows
        info.writeUInt16LE(1, 12);
        info.writeUInt16LE(32, 14);
        info.writeUInt32LE(0, 16);
        info.writeUInt32LE(n * n * 4 + maskRow * n, 20);
        const pixels = Buffer.alloc(n * n * 4);
        for (let y = 0; y < n; y++) {
            for (let x = 0; x < n; x++) {
                const src = (y * n + x) * 4;
                const dst = ((n - 1 - y) * n + x) * 4; // bottom-up
                pixels[dst] = raw[src + 2];
                pixels[dst + 1] = raw[src + 1];
                pixels[dst + 2] = raw[src];
                pixels[dst + 3] = raw[src + 3];
            }
        }
        const mask = Buffer.alloc(maskRow * n); // all zero: alpha decides
        return Buffer.concat([info, pixels, mask]);
    });

    const entries = [];
    let offset = 6 + 16 * images.length;
    images.forEach(({ n }, i) => {
        const e = Buffer.alloc(16);
        e.writeUInt8(n >= 256 ? 0 : n, 0);
        e.writeUInt8(n >= 256 ? 0 : n, 1);
        e.writeUInt8(0, 2);
        e.writeUInt8(0, 3);
        e.writeUInt16LE(1, 4);
        e.writeUInt16LE(32, 6);
        e.writeUInt32LE(bodies[i].length, 8);
        e.writeUInt32LE(offset, 12);
        offset += bodies[i].length;
        entries.push(e);
    });

    return Buffer.concat([header, ...entries, ...bodies]);
}

const px16 = pixelDiamond(16, 6, 2);
const px32 = pixelDiamond(32, 12, 3);
const raw16 = rawRgba(16, px16);
const raw32 = rawRgba(32, px32);

const write = (name, data) => {
    writeFileSync(resolve(OUT, name), data);
    console.log(`  public/${name}  ${data.length} B`);
};

write("favicon.svg", pixelSvg(16, px16) + "\n");
write("favicon-16x16.png", await pngFromRaw(16, raw16));
write("favicon-32x32.png", await pngFromRaw(32, raw32));
write("favicon.ico", ico([{ n: 16, raw: raw16 }, { n: 32, raw: raw32 }]));
for (const [name, size] of [
    ["apple-touch-icon.png", 180],
    ["android-chrome-192x192.png", 192],
    ["android-chrome-512x512.png", 512],
]) {
    write(name, await sharp(smoothSvg(size)).flatten({ background: "#000" }).png({ compressionLevel: 9 }).toBuffer());
}
