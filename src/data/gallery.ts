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
    blur: string;
    thumbSrc: string;
    largeSrc: string;
}

export const galleryPhotos: GalleryPhoto[] = manifest.map((entry) => ({
    ...entry,
    thumbSrc: `${CDN_BASE}/thumb/${entry.id}.webp`,
    largeSrc: `${CDN_BASE}/large/${entry.id}.webp`,
}));
