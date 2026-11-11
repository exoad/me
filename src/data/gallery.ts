import manifest from "./gallery.json";
import { picks } from "./picks";

// Web variants only; full-res originals stay on the local machine. Served from
// the exoad-photos R2 bucket on photos.exoad.net, cached at the edge and in the
// browser for a year (a photo's id never changes what it points at).
export const CDN_BASE = "https://photos.exoad.net/gallery";

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
    /** Set on the handful worth stopping on; the reason, in one line. */
    note: string | null;
}

export const galleryPhotos: GalleryPhoto[] = manifest.map((entry) => ({
    ...entry,
    thumbSrc: `${CDN_BASE}/thumb/${entry.id}.webp`,
    largeSrc: `${CDN_BASE}/large/${entry.id}.webp`,
    xlSrc: `${CDN_BASE}/xl/${entry.id}.webp`,
    note: picks[entry.id] ?? null,
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
