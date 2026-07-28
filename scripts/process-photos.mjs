// Generates web variants + manifest for the photos gallery.
//
// Usage: node scripts/process-photos.mjs [source-dir] [staging-dir]
//   source-dir  defaults to ~/Pictures/Gallery Picks (manually curated photos)
//   staging-dir defaults to .photo-staging/ in the repo (gitignored)
//
// Reads every JPEG in <source-dir>, writes into <staging-dir>:
//   gallery/thumb/<id>.webp     (grid, 900px wide)
//   gallery/large/<id>.webp     (lightbox, 2000px long edge)
//   gallery/xl/<id>.webp        (on-demand "view full", 3200px long edge)
//
// The lightbox deliberately stays on the 2000px copy. Handing the browser a
// 16MP image to shrink into a window aliases worse than resampling it here.
// and writes src/data/gallery.json with dimensions, EXIF dates, and inline
// blur placeholders so the grid can render with zero layout shift.
//
// Full-res originals stay in the source dir only. The bucket repo is public,
// so anything staged here becomes world-readable — never stage originals.

import { readdir, mkdir, copyFile, writeFile } from "node:fs/promises";
import { join, basename, dirname } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import exifReader from "exif-reader";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const [
  srcDir = join(homedir(), "Pictures", "Gallery Picks"),
  stagingDir = join(repoRoot, ".photo-staging"),
] = process.argv.slice(2);

const manifestPath = join(repoRoot, "src", "data", "gallery.json");

const THUMB_WIDTH = 900;
const LARGE_EDGE = 2000;
const XL_EDGE = 3200;
const CONCURRENCY = 4;

const files = (await readdir(srcDir))
  .filter((f) => /\.jpe?g$/i.test(f))
  .sort();

for (const sub of ["thumb", "large", "xl"]) {
  await mkdir(join(stagingDir, "gallery", sub), { recursive: true });
}

const usedIds = new Set();

function slugify(name) {
  return basename(name)
    .replace(/\.jpe?g$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readExif(metadata) {
  if (!metadata.exif) return {};
  try {
    return exifReader(metadata.exif) ?? {};
  } catch {
    return {};
  }
}

function exifDate(tags) {
  const d = tags?.Photo?.DateTimeOriginal ?? tags?.Image?.DateTime;
  return d instanceof Date && !Number.isNaN(d.getTime())
    ? d.toISOString().slice(0, 10)
    : null;
}

/** "OLYMPUS CORPORATION" + "E-M10MarkII" -> "Olympus E-M10MarkII" */
function cameraName(image) {
  const rawMake = (image?.Make ?? "").trim().split(/\s+/)[0] ?? "";
  const model = (image?.Model ?? "").trim();
  if (!model) return null;
  const make = rawMake
    ? rawMake[0].toUpperCase() + rawMake.slice(1).toLowerCase()
    : "";
  if (!make || model.toLowerCase().startsWith(make.toLowerCase())) return model;
  return `${make} ${model}`;
}

const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);

/** Raw values only — formatting for display happens in the UI. */
function cameraSettings(tags) {
  const photo = tags?.Photo ?? {};
  return {
    camera: cameraName(tags?.Image),
    lens: (photo.LensModel ?? "").trim() || null,
    aperture: num(photo.FNumber),
    shutter: num(photo.ExposureTime),
    iso: num(photo.ISOSpeedRatings) ?? num(photo.PhotographicSensitivity),
    focalLength: num(photo.FocalLength),
  };
}

async function processOne(file) {
  const id = slugify(file);
  if (!id) throw new Error(`empty slug for "${file}"`);
  if (usedIds.has(id)) throw new Error(`slug collision: "${file}" also maps to "${id}"`);
  usedIds.add(id);
  const srcPath = join(srcDir, file);

  const image = sharp(srcPath).rotate();
  const metadata = await sharp(srcPath).metadata();

  const thumbPath = join(stagingDir, "gallery", "thumb", `${id}.webp`);
  const largePath = join(stagingDir, "gallery", "large", `${id}.webp`);
  const xlPath = join(stagingDir, "gallery", "xl", `${id}.webp`);

  const thumbInfo = await image
    .clone()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(thumbPath);

  const largeInfo = await image
    .clone()
    .resize({ width: LARGE_EDGE, height: LARGE_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(largePath);

  await image
    .clone()
    .resize({ width: XL_EDGE, height: XL_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(xlPath);

  const blurBuffer = await image
    .clone()
    .resize({ width: 24 })
    .webp({ quality: 30 })
    .toBuffer();

  const tags = readExif(metadata);

  return {
    id,
    width: largeInfo.width,
    height: largeInfo.height,
    thumbWidth: thumbInfo.width,
    thumbHeight: thumbInfo.height,
    date: exifDate(tags),
    ...cameraSettings(tags),
    blur: `data:image/webp;base64,${blurBuffer.toString("base64")}`,
  };
}

const entries = [];
let cursor = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < files.length) {
      const file = files[cursor++];
      try {
        entries.push(await processOne(file));
        console.log(`ok   ${file}`);
      } catch (err) {
        console.error(`FAIL ${file}: ${err.message}`);
        process.exitCode = 1;
      }
    }
  })
);

entries.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "") || a.id.localeCompare(b.id));

await writeFile(manifestPath, JSON.stringify(entries, null, "\t") + "\n");
console.log(`\nwrote ${entries.length} entries to ${manifestPath}`);
