import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { prefersReducedMotion } from "../utils/motion";

const LANDING_CLASS = "is-photos-landing";
const LIFTED_CLASS = "is-lifted";
const MIN_DWELL_MS = 260;

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
    const { pathname } = useLocation();
    const isActive = pathname.replace(/\/+$/, "") === "/photos";

    useEffect(() => {
        // On navigation away, ContentFade keeps the outgoing page mounted for its
        // exit animation under a new React key, which remounts this component.
        // That copy must not re-raise the veil over the page we just left for.
        if (!isActive) return;

        const root = document.documentElement;
        const veil = document.getElementById("veil");

        root.classList.add(LANDING_CLASS);

        let cancelled = false;
        let frame = 0;

        const lift = () => {
            if (cancelled) return;
            veil?.classList.add(LIFTED_CLASS);
        };

        // Let the fonts settle and the grid paint underneath before lifting, so
        // the reveal never uncovers reflowing text or an empty column.
        const fonts = document.fonts?.ready ?? Promise.resolve();
        const dwell = new Promise((resolve) => setTimeout(resolve, MIN_DWELL_MS));

        Promise.all([fonts, dwell]).then(() => {
            if (cancelled) return;
            if (prefersReducedMotion()) {
                lift();
                return;
            }
            frame = requestAnimationFrame(() => {
                frame = requestAnimationFrame(lift);
            });
        });

        return () => {
            cancelled = true;
            cancelAnimationFrame(frame);
            root.classList.remove(LANDING_CLASS);
            // Reset for the next visit. Never cleared on mount: if index.html's
            // failsafe already revealed a slow-booting page, re-hiding it would
            // slam the page back to black with no transition.
            veil?.classList.remove(LIFTED_CLASS);
        };
    }, [isActive]);
}
