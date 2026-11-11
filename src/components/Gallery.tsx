import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
    type CSSProperties,
    type TouchEvent as ReactTouchEvent,
} from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "../lib/url";
import {
    galleryPhotos,
    formatAperture,
    formatShutter,
    formatIso,
    formatFocalLength,
    type GalleryPhoto,
} from "../data/gallery";
import { strings } from "../data/shared.ts";
import { usePhotosReveal } from "../hooks/usePhotosReveal";
import { motionSafeScrollBehavior } from "../utils/motion";
import "../styles/PhotosPage.css";

const PAGE_SIZE = 24;
const PAGE_COUNT = Math.max(1, Math.ceil(galleryPhotos.length / PAGE_SIZE));
// Photos at the top of a page fetch immediately; the rest stream in on scroll.
const PRIORITY_COUNT = 6;
// Keep in step with the .ph-lightbox-close animation.
const CLOSE_MS = 260;
// Keep in step with the .ph-lightbox-slide animations.
const SLIDE_MS = 420;
// Swipe thresholds. Sideways is short — the frames sit close to the screen
// edges, so the gesture is over quickly. Dismissing asks for more travel, since
// it costs you the frame you were looking at.
const SWIPE_MIN_PX = 48;
const SWIPE_CLOSE_PX = 90;
// Past this it stops reading as a flick and starts reading as a stray drag.
const SWIPE_MAX_MS = 800;
// How long the swipe hint stays up before retiring on its own.
const HINT_MS = 4500;

// Once you have swiped, you know you can swipe. Module scope so the hint is a
// property of the visit rather than of one viewer — opening a tenth photo
// should not re-explain the gesture you have been using all along.
let swipeHintRetired = false;

/**
 * The height actually on screen, in CSS pixels.
 *
 * 100dvh is meant to be exactly this, but mobile browsers disagree about it
 * often enough that the viewer's controls kept ending up behind the URL bar.
 * visualViewport reports what is really visible, so the viewer is sized from a
 * measurement rather than from a unit we have to trust.
 *
 * Returns null while pinch-zoomed: the visual viewport is then a window onto a
 * magnified page rather than the page's own height, and following it would
 * collapse the viewer as you zoom into a photo.
 */
function visibleHeight(): number | null {
    const vv = window.visualViewport;
    if (!vv) return window.innerHeight;
    if (vv.scale > 1.01) return null;
    return vv.height;
}

const pad = (n: number) => String(n).padStart(2, "0");
const frameNo = (i: number) => String(i + 1).padStart(3, "0");
const formatDate = (date: string | null) => (date ? date.replaceAll("-", ".") : "—");

function useColumnCount() {
    const query = useCallback(() => {
        if (window.matchMedia("(max-width: 640px)").matches) return 1;
        if (window.matchMedia("(max-width: 1024px)").matches) return 2;
        return 3;
    }, []);

    // Three, as rendered at build time, until the first client effect measures
    // the screen. The landing veil covers the reflow on a narrower one.
    const [columns, setColumns] = useState(3);

    useEffect(() => {
        const onResize = () => setColumns(query());
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [query]);

    return columns;
}

/** Distribute photos into columns, always appending to the shortest one so the
 *  staggered grid stays balanced regardless of aspect ratios. */
function balanceColumns(photos: GalleryPhoto[], columnCount: number) {
    const columns: GalleryPhoto[][] = Array.from({ length: columnCount }, () => []);
    const heights = new Array(columnCount).fill(0);
    for (const photo of photos) {
        const target = heights.indexOf(Math.min(...heights));
        columns[target].push(photo);
        heights[target] += photo.height / photo.width;
    }
    return columns;
}

function Frame({ photo, onOpen }: { photo: GalleryPhoto; onOpen: (photo: GalleryPhoto) => void }) {
    const globalIndex = galleryPhotos.indexOf(photo);
    const isPriority = globalIndex % PAGE_SIZE < PRIORITY_COUNT;

    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // A cached image can finish loading before React attaches onLoad, which
    // would strand it at opacity 0.
    useEffect(() => {
        const img = imgRef.current;
        if (img?.complete && img.naturalWidth > 0) setLoaded(true);
    }, []);

    if (failed) {
        return (
            <div
                className="ph-frame ph-frame-error"
                style={{ aspectRatio: `${photo.thumbWidth} / ${photo.thumbHeight}` }}
            >
                Unavailable
            </div>
        );
    }

    return (
        <button
            type="button"
            className={`ph-frame${photo.note ? " ph-frame-pick" : ""}`}
            onClick={() => onOpen(photo)}
            aria-label={
                `Open photo ${frameNo(globalIndex)}, taken ${formatDate(photo.date)}` +
                (photo.note ? ` — picked: ${photo.note}` : "")
            }
        >
            <span
                className="ph-media"
                style={{ aspectRatio: `${photo.thumbWidth} / ${photo.thumbHeight}` }}
            >
                <img
                    src={photo.blur}
                    alt=""
                    aria-hidden="true"
                    className={`ph-blur${loaded ? " ph-hidden" : ""}`}
                />
                <img
                    ref={imgRef}
                    src={photo.thumbSrc}
                    width={photo.thumbWidth}
                    height={photo.thumbHeight}
                    alt={`Photograph ${frameNo(globalIndex)}, ${formatDate(photo.date)}`}
                    className={`ph-photo${loaded ? " ph-loaded" : ""}`}
                    loading={isPriority ? "eager" : "lazy"}
                    fetchPriority={isPriority ? "high" : "auto"}
                    decoding="async"
                    onLoad={() => setLoaded(true)}
                    onError={() => setFailed(true)}
                />
            </span>
            <span className="ph-frame-meta" aria-hidden="true">
                <span>{frameNo(globalIndex)}</span>
                <span>{formatDate(photo.date)}</span>
            </span>
        </button>
    );
}

function Lightbox({ index, onNavigate, onClose }: {
    index: number;
    onNavigate: (index: number) => void;
    onClose: () => void;
}) {
    const photo = galleryPhotos[index];

    // Readiness is remembered per frame rather than held as one flag that has to
    // be reset on every step. A frame you have already seen is ready by
    // definition, so stepping back to it can never flash its placeholder — the
    // old flag depended on a fresh <img> reporting .complete in time, which it
    // usually does not, even straight from cache.
    const readyRef = useRef<Set<string>>(new Set());
    const failedRef = useRef<Set<string>>(new Set());
    const [, bump] = useReducer((n: number) => n + 1, 0);

    const ready = readyRef.current.has(photo.id);
    const failed = failedRef.current.has(photo.id);

    const markReady = useCallback((id: string) => {
        // A frame that arrives on a later attempt supersedes an earlier failure.
        // The neighbour preload re-fetches anything not yet ready, so this is how
        // a frame that blipped recovers — without it the retry would succeed and
        // the error card would still be what you see.
        const wasFailed = failedRef.current.delete(id);
        if (readyRef.current.has(id)) {
            if (wasFailed) bump();
            return;
        }
        readyRef.current.add(id);
        bump();
    }, []);

    const [closing, setClosing] = useState(false);

    // Measured on mount so the very first paint is already the right height —
    // a viewer that resizes after it opens would be its own kind of wrong.
    const [viewportHeight, setViewportHeight] = useState(
        () => visibleHeight() ?? window.innerHeight,
    );

    useEffect(() => {
        const update = () => {
            const height = visibleHeight();
            if (height !== null) setViewportHeight(height);
        };
        update();
        const vv = window.visualViewport;
        // The URL bar sliding in or out fires this, which is the whole point.
        vv?.addEventListener("resize", update);
        window.addEventListener("resize", update);
        window.addEventListener("orientationchange", update);
        return () => {
            vv?.removeEventListener("resize", update);
            window.removeEventListener("resize", update);
            window.removeEventListener("orientationchange", update);
        };
    }, []);

    const dialogRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const closeTimer = useRef(0);

    // Let the exit animation finish before the dialog leaves the tree.
    const requestClose = useCallback(() => {
        setClosing(true);
        clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(onClose, CLOSE_MS);
    }, [onClose]);

    useEffect(() => () => clearTimeout(closeTimer.current), []);

    // Holds the frame being left behind so it can travel out while the next one
    // travels in. Null on first open, so opening is a plain fade.
    const [slide, setSlide] = useState<{ dir: "next" | "prev"; from: GalleryPhoto } | null>(null);

    const go = useCallback(
        (target: number) => {
            setSlide({ dir: target > index ? "next" : "prev", from: galleryPhotos[index] });
            onNavigate(target);
        },
        [index, onNavigate],
    );

    useEffect(() => {
        if (!slide) return;
        const timer = window.setTimeout(() => setSlide(null), SLIDE_MS);
        return () => clearTimeout(timer);
    }, [slide]);

    const prev = index > 0 ? index - 1 : null;
    const next = index < galleryPhotos.length - 1 ? index + 1 : null;

    // Touch navigation. On a phone the natural gesture for a full-screen photo
    // is a swipe — sideways to step, which is also the axis the small-screen
    // breakpoint animates along, and down to dismiss back to the grid.
    const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);
    const swiped = useRef(false);

    const [hint, setHint] = useState(!swipeHintRetired);

    // Gone after a few seconds even if it goes unread — it has said its piece,
    // and a line that animates forever under every photo is the clutter this is
    // meant to avoid.
    useEffect(() => {
        if (!hint) return;
        const timer = window.setTimeout(() => setHint(false), HINT_MS);
        return () => clearTimeout(timer);
    }, [hint]);

    const onTouchStart = useCallback((event: ReactTouchEvent) => {
        swiped.current = false;
        // A second finger is a pinch, not a swipe.
        if (event.touches.length !== 1) {
            touchStart.current = null;
            return;
        }
        const touch = event.touches[0];
        touchStart.current = { x: touch.clientX, y: touch.clientY, t: event.timeStamp };
    }, []);

    const onTouchEnd = useCallback(
        (event: ReactTouchEvent) => {
            const start = touchStart.current;
            touchStart.current = null;
            if (!start || event.timeStamp - start.t > SWIPE_MAX_MS) return;

            const touch = event.changedTouches[0];
            const dx = touch.clientX - start.x;
            const dy = touch.clientY - start.y;

            // Whichever axis the finger actually travelled along decides which
            // gesture this was, so a slightly diagonal flick still lands.
            if (Math.abs(dx) > Math.abs(dy)) {
                if (Math.abs(dx) < SWIPE_MIN_PX) return;
                const target = dx < 0 ? next : prev;
                if (target === null) return;
                swiped.current = true;
                swipeHintRetired = true;
                setHint(false);
                go(target);
            } else if (dy > SWIPE_CLOSE_PX) {
                swiped.current = true;
                requestClose();
            }
        },
        [next, prev, go, requestClose],
    );

    // A swipe that ends over the backdrop must not also register as the tap that
    // dismisses it — most browsers suppress the click after that much travel,
    // but not all of them, and closing twice over is not a recoverable mistake.
    const onStageClick = useCallback(() => {
        if (swiped.current) return;
        requestClose();
    }, [requestClose]);

    // Two rails: the body on the left, the settings it was shot at on the right.
    const identity = [photo.camera].filter(Boolean) as string[];
    const exposure = [
        formatAperture(photo.aperture),
        formatShutter(photo.shutter),
        formatIso(photo.iso),
        formatFocalLength(photo.focalLength),
    ].filter(Boolean) as string[];

    // Safety net for the first sight of a frame: a cached image can finish
    // before React attaches onLoad.
    useEffect(() => {
        const img = imgRef.current;
        if (img?.complete && img.naturalWidth > 0) markReady(photo.id);
    }, [photo.id, markReady]);

    // Decode the neighbours ahead of time so a step usually lands on a sharp
    // frame and the placeholder is only ever seen when you outrun the network.
    useEffect(() => {
        let cancelled = false;
        for (const neighbour of [prev, next]) {
            if (neighbour === null) continue;
            const target = galleryPhotos[neighbour];
            if (readyRef.current.has(target.id)) continue;
            const preload = new Image();
            preload.src = target.largeSrc;
            preload
                .decode?.()
                .then(() => {
                    if (!cancelled) markReady(target.id);
                })
                .catch(() => {
                    /* a failed preload just means the real one shows its blur */
                });
        }
        return () => {
            cancelled = true;
        };
    }, [prev, next, markReady]);

    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null;
        dialogRef.current?.focus();

        // overflow: hidden does not stop iOS Safari scrolling the page behind a
        // fixed overlay, and a document that drifts underneath takes the
        // overlay's frame of reference with it. Pinning the body at the offset
        // it already had is the lock that holds there too.
        const { body } = document;
        const offsetY = window.scrollY;
        const restore = {
            position: body.style.position,
            top: body.style.top,
            left: body.style.left,
            right: body.style.right,
            overflow: body.style.overflow,
        };
        Object.assign(body.style, {
            position: "fixed",
            top: `-${offsetY}px`,
            left: "0",
            right: "0",
            overflow: "hidden",
        });

        return () => {
            Object.assign(body.style, restore);
            // Pinning the body sent the document to the top; put it back before
            // the grid is visible again, or closing loses your place in it.
            window.scrollTo(0, offsetY);
            previouslyFocused?.focus();
        };
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") requestClose();
            if (event.key === "ArrowLeft" && prev !== null) go(prev);
            if (event.key === "ArrowRight" && next !== null) go(next);
            if (event.key === "Tab") {
                // Keep Tab cycling inside the modal — the page behind stays in the DOM.
                const focusables = Array.from(
                    dialogRef.current?.querySelectorAll<HTMLElement>(
                        "a[href], button:not(:disabled)",
                    ) ?? [],
                    // The breakpoint hides one set of controls or the other, and
                    // a display:none button still answers the selector while
                    // refusing focus — which would strand Tab on it.
                ).filter((el) => el.getClientRects().length > 0);
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                const active = document.activeElement as HTMLElement | null;
                if (event.shiftKey && (active === first || !focusables.includes(active as HTMLElement))) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && (active === last || !focusables.includes(active as HTMLElement))) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [prev, next, go, requestClose]);

    return (
        <div
            className={`ph ph-lightbox${closing ? " is-closing" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${frameNo(index)} of ${pad(galleryPhotos.length)}`}
            ref={dialogRef}
            tabIndex={-1}
            style={{ "--ph-vh": `${viewportHeight}px` } as CSSProperties}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <div className="ph-lightbox-stage" onClick={onStageClick}>
                <div
                    className="ph-rail ph-rail-left"
                    onClick={(event) => event.stopPropagation()}
                >
                    {identity.map((line) => (
                        <span key={line}>{line}</span>
                    ))}
                </div>

                <div className="ph-lightbox-figure">
                    {slide && (
                        <div
                            // Without a key React reuses this node when you step
                            // twice the same way, and an unchanged class means the
                            // exit animation never restarts. Prefixed so it can't
                            // collide with the entering layer's key on a reversal.
                            key={`exit-${slide.from.id}`}
                            className={`ph-lightbox-slide ph-exit-${slide.dir}`}
                            aria-hidden="true"
                        >
                            <img
                                className="ph-lightbox-photo ph-loaded"
                                src={slide.from.largeSrc}
                                alt=""
                            />
                        </div>
                    )}

                    <div
                        key={photo.id}
                        className={`ph-lightbox-slide${slide ? ` ph-enter-${slide.dir}` : ""}`}
                    >
                        {failed ? (
                            <span className="ph-label">
                                Couldn't load this photo — close and try again.
                            </span>
                        ) : (
                            <>
                                {/* Stands in until the frame arrives, then hands over. */}
                                <img
                                    className={`ph-lightbox-blur${ready ? " ph-hidden" : ""}`}
                                    src={photo.blur}
                                    // object-fit will happily upscale, while the
                                    // photo's max-* only ever shrinks. Capping at
                                    // the photo's own pixels keeps both layers on
                                    // the exact same rectangle on large displays.
                                    style={{ maxWidth: photo.width, maxHeight: photo.height }}
                                    // While loading this covers the whole figure,
                                    // so without this a tap on the photo you are
                                    // waiting for would dismiss the viewer.
                                    onClick={(event) => {
                                        if (!ready) event.stopPropagation();
                                    }}
                                    alt=""
                                    aria-hidden="true"
                                />
                                <img
                                    ref={imgRef}
                                    src={photo.largeSrc}
                                    alt={`Photograph ${frameNo(index)}, ${formatDate(photo.date)}`}
                                    className={`ph-lightbox-photo${ready ? " ph-loaded" : ""}`}
                                    onLoad={() => markReady(photo.id)}
                                    onError={() => {
                                        // Keep the two sets disjoint, so the
                                        // render never has to arbitrate between
                                        // "ready" and "failed" for one frame.
                                        readyRef.current.delete(photo.id);
                                        failedRef.current.add(photo.id);
                                        bump();
                                    }}
                                    onClick={(event) => event.stopPropagation()}
                                />
                            </>
                        )}
                    </div>
                </div>

                {photo.note && (
                    <p className="ph-note" onClick={(event) => event.stopPropagation()}>
                        {photo.note}
                    </p>
                )}

                {/* Small screens only — CSS keeps it out of the desktop layout,
                    where the keyboard and the bar already cover this. */}
                <div className="ph-touchbar" onClick={(event) => event.stopPropagation()}>
                    <button
                        type="button"
                        className="ph-chev ph-chev-prev"
                        onClick={() => prev !== null && go(prev)}
                        disabled={prev === null}
                        aria-label="Previous photo"
                    />
                    <span className={`ph-hint${hint ? "" : " ph-hint-out"}`} aria-hidden="true">
                        <span className="ph-hint-track">
                            <span className="ph-hint-dot" />
                        </span>
                        Swipe to navigate
                    </span>
                    <button
                        type="button"
                        className="ph-chev ph-chev-next"
                        onClick={() => next !== null && go(next)}
                        disabled={next === null}
                        aria-label="Next photo"
                    />
                </div>

                <div
                    className="ph-rail ph-rail-right"
                    onClick={(event) => event.stopPropagation()}
                >
                    {exposure.map((line) => (
                        <span key={line}>{line}</span>
                    ))}
                </div>
            </div>
            <div className="ph-lightbox-bar">
                <div className="ph-lightbox-bar-group">
                    <span className="ph-page-indicator">
                        {frameNo(index)} / {frameNo(galleryPhotos.length - 1)}
                    </span>
                </div>
                <div className="ph-lightbox-bar-group">
                    <a
                        className="ph-label"
                        href={photo.xlSrc}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                    >
                        View full
                    </a>
                    <button
                        type="button"
                        className="ph-label ph-step ph-step-prev"
                        onClick={() => prev !== null && go(prev)}
                        disabled={prev === null}
                    >
                        Prev
                    </button>
                    <button
                        type="button"
                        className="ph-label ph-step ph-step-next"
                        onClick={() => next !== null && go(next)}
                        disabled={next === null}
                    >
                        Next
                    </button>
                    <button type="button" className="ph-label ph-close" onClick={requestClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

const PHOTO_PATH = /^\/photos\/([^/]+)\/?$/;

/**
 * The gallery. Rendered to HTML at build time for the route it is built into
 * (`initialPath`), then hydrated; the open photograph and the grid's page live
 * in the address bar, so either can be linked to and reloaded back into.
 */
export default function Gallery({ initialPath = "/photos" }: { initialPath?: string }) {
    const location = useLocation({ pathname: initialPath, search: "" });
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const photoId = PHOTO_PATH.exec(location.pathname)?.[1];
    const navigate = useNavigate();
    const columns = useColumnCount();

    // The viewer measures the window and portals into the body, so it only ever
    // exists in the browser; the built HTML is always the grid.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Fades the page up out of black and holds the canvas black while we're here.
    usePhotosReveal();

    // Which frame is open is the URL's business, not this component's. That is
    // what makes a single photograph something you can send to someone, link to,
    // and reload back into.
    const lightboxIndex = useMemo(() => {
        if (!photoId) return null;
        const found = galleryPhotos.findIndex((p) => p.id === photoId);
        return found === -1 ? null : found;
    }, [photoId]);

    const rawPage = Number.parseInt(searchParams.get("p") ?? "1", 10);
    const requestedPage = Number.isNaN(rawPage) ? 1 : Math.min(Math.max(rawPage, 1), PAGE_COUNT);
    // Arriving straight at a photograph should leave the grid behind it on the
    // page that frame actually belongs to, so closing lands somewhere sensible.
    const page =
        lightboxIndex !== null && !searchParams.has("p")
            ? Math.floor(lightboxIndex / PAGE_SIZE) + 1
            : requestedPage;

    // Replay the entrance animation on page changes only — a breakpoint change
    // rebalances columns and remounts frames, which shouldn't re-animate.
    const lastPageRef = useRef(page);
    const lastColumnsRef = useRef(columns);
    const animateRef = useRef(true);
    if (lastColumnsRef.current !== columns) {
        lastColumnsRef.current = columns;
        animateRef.current = false;
    }
    if (lastPageRef.current !== page) {
        lastPageRef.current = page;
        animateRef.current = true;
    }
    const animate = animateRef.current;

    const pagePhotos = useMemo(
        () => galleryPhotos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        [page],
    );
    const balanced = useMemo(() => balanceColumns(pagePhotos, columns), [pagePhotos, columns]);

    const scrollToTop = (behavior: ScrollBehavior) => {
        window.scrollTo({ top: 0, behavior });
    };

    const goToPage = (target: number) => {
        navigate(target === 1 ? "/photos" : `/photos?p=${target}`);
        scrollToTop("auto");
    };

    // The grid's page rides along, so closing the viewer returns to the page you
    // opened it from rather than to the top of the gallery.
    const gridPath = page === 1 ? "/photos" : `/photos?p=${page}`;

    // The open frame is the page now, so it should name the tab and supply the
    // card — otherwise the title stays on "Photos" through every step.
    const activePhoto = lightboxIndex === null ? null : galleryPhotos[lightboxIndex];

    // The open frame is the page now, so it names the tab; the built HTML for
    // each route already carries its own title and card.
    useEffect(() => {
        document.title = activePhoto
            ? `${formatDate(activePhoto.date)} — ${frameNo(lightboxIndex!)} of ${galleryPhotos.length} | exoad`
            : "Photographs | exoad";
    }, [activePhoto, lightboxIndex]);

    const openPhoto = useCallback(
        (photo: GalleryPhoto) => navigate(`/photos/${photo.id}`),
        [navigate],
    );

    // Stepping replaces rather than pushes: Back should return to the grid, not
    // walk you backwards through every frame you looked at.
    const stepToPhoto = useCallback(
        (target: number) =>
            navigate(`/photos/${galleryPhotos[target].id}`, { replace: true }),
        [navigate],
    );

    const closePhoto = useCallback(() => navigate(gridPath), [navigate, gridPath]);

    return (
        <div className="ph">
            <div className="ph-meta">
                <h1 className="ph-title">Photos</h1>
                <span className="ph-count">
                    {galleryPhotos.length} frames — page {pad(page)} / {pad(PAGE_COUNT)}
                </span>
            </div>

            <main id="main" className={`ph-grid${animate ? "" : " ph-static"}`}>
                {galleryPhotos.length === 0 && (
                    <p className="ph-label ph-empty">Nothing here yet — check back soon.</p>
                )}
                {balanced.map((column, columnIndex) => (
                    <div className="ph-col" key={`${page}-${columnIndex}`}>
                        {column.map((photo) => {
                            const orderIndex = pagePhotos.indexOf(photo);
                            return (
                                <div
                                    className={animate ? "ph-enter" : undefined}
                                    style={{ "--ph-i": orderIndex } as CSSProperties}
                                    key={photo.id}
                                >
                                    <Frame photo={photo} onOpen={openPhoto} />
                                </div>
                            );
                        })}
                    </div>
                ))}
            </main>

            {galleryPhotos.length > 0 && (
                <nav className="ph-pagination" aria-label="Gallery pages">
                    <button
                        type="button"
                        className="ph-label ph-step ph-step-prev"
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1}
                    >
                        ← Prev
                    </button>
                    <span className="ph-page-indicator">
                        {pad(page)} / {pad(PAGE_COUNT)}
                    </span>
                    <button
                        type="button"
                        className="ph-label ph-step ph-step-next"
                        onClick={() => goToPage(page + 1)}
                        disabled={page === PAGE_COUNT}
                    >
                        Next →
                    </button>
                </nav>
            )}

            <footer className="ph-footer">
                <span className="ph-label">{strings.footer.legals}</span>
                <div className="ph-footer-links">
                    <a href="/" className="ph-label ph-step ph-step-prev">
                        ← exoad.net
                    </a>
                    <button
                        type="button"
                        className="ph-label"
                        onClick={() => scrollToTop(motionSafeScrollBehavior())}
                    >
                        Top
                    </button>
                </div>
            </footer>

            {mounted &&
                lightboxIndex !== null &&
                // Portaled to the body so no transformed ancestor becomes the
                // containing block for its position:fixed.
                createPortal(
                    <Lightbox
                        index={lightboxIndex}
                        onNavigate={stepToPhoto}
                        onClose={closePhoto}
                    />,
                    document.body,
                )}
        </div>
    );
}
