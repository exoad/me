import manifest from "./gallery.json";

// Web variants only — the bucket repo is public, so full-res originals are
// never uploaded to it; they stay on the local machine.
const CDN_BASE = "https://cdn.statically.io/gh/meng-jack/me-pictures-bucket@main/gallery";

export interface GalleryPhoto {
    id: string;
    width: number;
    height: number;
    thumbWidth: number;
    thumbHeight: number;
    date: string | null;
    camera: string | null;
    /** f-number, e.g. 5.6 */
    aperture: number | null;
    /** exposure time in seconds, e.g. 0.0025 */
    shutter: number | null;
    iso: number | null;
    /** actual focal length in mm, not 35mm-equivalent */
    focalLength: number | null;
    blur: string;
    thumbSrc: string;
    largeSrc: string;
    /** Only fetched when the reader explicitly asks to view the full frame. */
    xlSrc: string;
}

export const galleryPhotos: GalleryPhoto[] = manifest.map((entry) => ({
    ...entry,
    thumbSrc: `${CDN_BASE}/thumb/${entry.id}.webp`,
    largeSrc: `${CDN_BASE}/large/${entry.id}.webp`,
    xlSrc: `${CDN_BASE}/xl/${entry.id}.webp`,
}));

export function formatAperture(value: number | null) {
    return value == null ? null : `ƒ/${value % 1 === 0 ? value : value.toFixed(1)}`;
}

export function formatShutter(seconds: number | null) {
    if (seconds == null) return null;
    // Cameras stop using fractions around a third of a second — past that the
    // reciprocal rounds to nonsense ("1/1s" for 0.8s).
    if (seconds >= 0.3) return `${Number(seconds.toFixed(1))}s`;
    return `1/${Math.round(1 / seconds)}s`;
}

export function formatIso(value: number | null) {
    return value == null ? null : `ISO ${value}`;
}

export function formatFocalLength(value: number | null) {
    return value == null ? null : `${Math.round(value)}mm`;
}
