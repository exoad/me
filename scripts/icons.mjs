// Writes every favicon size into public/ from the original hand mark in
// scripts/icons-source/, inverted: the pale hand becomes a dark one, the
// transparency stays.
//
//   node scripts/icons.mjs
//
// Each size is inverted from its own original, so the small ones keep the
// hand-tuned look they had rather than being shrunk from the large one.

import { writeFileSync } from "fs";
import { resolve } from "path";
import sharp from "sharp";

const SRC = resolve("scripts/icons-source");
const OUT = resolve("public");

/** The source at this name, colours inverted, alpha untouched. */
const inverted = (name) => sharp(resolve(SRC, name)).ensureAlpha().negate({ alpha: false });

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

const write = (name, data) => {
    writeFileSync(resolve(OUT, name), data);
    console.log(`  public/${name}  ${data.length} B`);
};

for (const name of [
    "favicon-16x16.png",
    "favicon-32x32.png",
    "apple-touch-icon.png",
    "android-chrome-192x192.png",
    "android-chrome-512x512.png",
]) {
    write(name, await inverted(name).png({ compressionLevel: 9 }).toBuffer());
}

const raw = async (name, n) =>
    (await inverted(name).resize(n, n).raw().toBuffer({ resolveWithObject: true })).data;
write(
    "favicon.ico",
    ico([
        { n: 16, raw: await raw("favicon-16x16.png", 16) },
        { n: 32, raw: await raw("favicon-32x32.png", 32) },
    ]),
);
