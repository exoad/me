import { useEffect } from "react";

const LANDING_CLASS = "is-photos-landing";
const LIFTED_CLASS = "is-lifted";
// Long enough that the mark completes one deliberate 45deg turn before the veil
// starts to go — the slow turn is what makes the quick fade read as quick.
const MIN_DWELL_MS = 700;

/**
 * Drives the fade-from-black landing on the photos page.
 *
 * The veil element and its opaque styles live in index.html so a direct load of
 * /photos paints black on the first frame, before any chunk resolves. Arriving
 * by client-side navigation re-uses the same element — the landing class is what
 * makes it visible, so both paths share one reveal.
 *
 * The class also paints the document canvas black, which keeps overscroll from
 * showing the site's gruvbox background behind the page.
 */
export function usePhotosReveal() {
    useEffect(() => {
        const root = document.documentElement;
        const veil = document.getElementById("veil");

        root.classList.add(LANDING_CLASS);

        let cancelled = false;
        let frame = 0;
        let safety = 0;

        const lift = () => {
            if (cancelled) return;
            veil?.classList.add(LIFTED_CLASS);
        };

        // Let the fonts settle and the grid paint underneath before lifting, so
        // the reveal never uncovers reflowing text or an empty column.
        const fonts = document.fonts?.ready ?? Promise.resolve();
        const dwell = new Promise((resolve) => setTimeout(resolve, MIN_DWELL_MS));

        // The reveal is an opacity fade, so it runs under reduced motion too —
        // the stylesheet keeps that fade and drops only the moving pieces.
        Promise.all([fonts, dwell]).then(() => {
            if (cancelled) return;
            // Waiting two frames lets the grid paint under the veil first, but a
            // backgrounded tab never runs them — so never let the frames be the
            // only way out. Lifting twice is harmless.
            safety = window.setTimeout(lift, 1500);
            frame = requestAnimationFrame(() => {
                frame = requestAnimationFrame(lift);
            });
        });

        return () => {
            cancelled = true;
            cancelAnimationFrame(frame);
            clearTimeout(safety);
            root.classList.remove(LANDING_CLASS);
            // Never cleared on mount: if the page's failsafe already revealed a
            // slow-booting gallery, re-hiding it would slam it back to black.
            veil?.classList.remove(LIFTED_CLASS);
        };
    }, []);
}
