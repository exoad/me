/**
 * Frames worth stopping on, and the reason.
 *
 * Kept apart from gallery.json on purpose: that file is rewritten from scratch
 * every time scripts/process-photos.mjs runs, so anything hand-written in it
 * would be lost on the next deploy. Keys are photo ids; adding or removing one
 * is the whole edit.
 *
 * The note shows under the frame in the focused viewer, and the grid marks the
 * photo with a gold corner.
 */
export const picks: Record<string, string> = {
    // Sutro Tower with the fog taking everything below the crossarms.
    p7292248: "The fog took the bottom half of the tower and left the rest hanging.",

    // The pagoda, exposed for the roofline until the sky behind it went out.
    p7282065: "Exposed for the roofline until the night behind it went completely black.",

    // Foley's Irish House.
    p7272008: "Green neon doing all the lighting work on a block that had none.",

    // The corner, the flat sky, and the bird.
    p8032450: "A hard corner against a flat sky, and one bird in the only empty part of it.",

    // Fluted concrete on one side, the plaza recess on the other.
    p7312345: "The wall's rhythm on one side, a single figure on the other, nothing in between.",
};
