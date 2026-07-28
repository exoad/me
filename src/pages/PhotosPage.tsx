import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Link, useSearchParams } from "react-router-dom";
import SEO from "../components/SEO";
import {
    galleryPhotos,
    formatAperture,
    formatShutter,
    formatIso,
    formatFocalLength,
    type GalleryPhoto,
} from "../data/gallery";
import { strings } from "../data/shared.ts";
import { useLenis } from "../hooks/useLenis";
import { usePhotosReveal } from "../hooks/usePhotosReveal";
import { motionSafeScrollBehavior, prefersReducedMotion } from "../utils/motion";
import "../styles/PhotosPage.css";

const PAGE_SIZE = 24;
const PAGE_COUNT = Math.max(1, Math.ceil(galleryPhotos.length / PAGE_SIZE));
// Photos at the top of a page fetch immediately; the rest stream in on scroll.
const PRIORITY_COUNT = 6;

const pad = (n: number) => String(n).padStart(2, "0");
const frameNo = (i: number) => String(i + 1).padStart(3, "0");
const formatDate = (date: string | null) => (date ? date.replaceAll("-", ".") : "—");

function useColumnCount() {
    const query = useCallback(() => {
        if (typeof window === "undefined") return 3;
        if (window.matchMedia("(max-width: 640px)").matches) return 1;
        if (window.matchMedia("(max-width: 1024px)").matches) return 2;
        return 3;
    }, []);

    const [columns, setColumns] = useState(query);

    useEffect(() => {
        const onResize = () => setColumns(query());
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
            className="ph-frame"
            onClick={() => onOpen(photo)}
            aria-label={`Open photo ${frameNo(globalIndex)}, taken ${formatDate(photo.date)}`}
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
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const prev = index > 0 ? index - 1 : null;
    const next = index < galleryPhotos.length - 1 ? index + 1 : null;

    // Two rails: the body on the left, the settings it was shot at on the right.
    const identity = [photo.camera].filter(Boolean) as string[];
    const exposure = [
        formatAperture(photo.aperture),
        formatShutter(photo.shutter),
        formatIso(photo.iso),
        formatFocalLength(photo.focalLength),
    ].filter(Boolean) as string[];

    useEffect(() => {
        const img = imgRef.current;
        // Already cached (e.g. stepping back to a photo): skip straight to shown.
        if (img?.complete && img.naturalWidth > 0) {
            setLoaded(true);
            setFailed(false);
            return;
        }
        setLoaded(false);
        setFailed(false);
    }, [index]);

    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null;
        dialogRef.current?.focus();
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
            previouslyFocused?.focus();
        };
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
            if (event.key === "ArrowLeft" && prev !== null) onNavigate(prev);
            if (event.key === "ArrowRight" && next !== null) onNavigate(next);
            if (event.key === "Tab") {
                // Keep Tab cycling inside the modal — the page behind stays in the DOM.
                const focusables = Array.from(
                    dialogRef.current?.querySelectorAll<HTMLElement>(
                        "a[href], button:not(:disabled)",
                    ) ?? [],
                );
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
    }, [prev, next, onNavigate, onClose]);

    return (
        <div
            className="ph ph-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${frameNo(index)} of ${pad(galleryPhotos.length)}`}
            ref={dialogRef}
            tabIndex={-1}
            data-lenis-prevent
        >
            <div className="ph-lightbox-stage" onClick={onClose}>
                <div
                    className="ph-rail ph-rail-left"
                    onClick={(event) => event.stopPropagation()}
                >
                    {identity.map((line) => (
                        <span key={line}>{line}</span>
                    ))}
                </div>

                <div className="ph-lightbox-figure">
                    {!loaded && !failed && (
                        <div className="ph-lightbox-loading">
                            <div className="ph-line" />
                        </div>
                    )}
                    {failed ? (
                        <span className="ph-label">
                            Couldn't load this photo — close and try again.
                        </span>
                    ) : (
                        <img
                            key={photo.id}
                            ref={imgRef}
                            src={photo.largeSrc}
                            alt={`Photograph ${frameNo(index)}, ${formatDate(photo.date)}`}
                            className={loaded ? "ph-loaded" : undefined}
                            onLoad={() => setLoaded(true)}
                            onError={() => setFailed(true)}
                            onClick={(event) => event.stopPropagation()}
                        />
                    )}
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
                        onClick={() => prev !== null && onNavigate(prev)}
                        disabled={prev === null}
                    >
                        Prev
                    </button>
                    <button
                        type="button"
                        className="ph-label ph-step ph-step-next"
                        onClick={() => next !== null && onNavigate(next)}
                        disabled={next === null}
                    >
                        Next
                    </button>
                    <button type="button" className="ph-label" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PhotosPage() {
    const lenisRef = useLenis(!prefersReducedMotion());
    const [searchParams, setSearchParams] = useSearchParams();
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const columns = useColumnCount();

    // Fades the page up out of black and holds the canvas black while we're here.
    usePhotosReveal();

    const rawPage = Number.parseInt(searchParams.get("p") ?? "1", 10);
    const page = Number.isNaN(rawPage) ? 1 : Math.min(Math.max(rawPage, 1), PAGE_COUNT);

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
        // While a Lenis smooth scroll is animating it ignores window.scrollTo,
        // so go through the instance when there is one.
        const lenis = lenisRef.current;
        if (lenis) {
            lenis.scrollTo(0, behavior === "auto" ? { immediate: true } : undefined);
        } else {
            window.scrollTo({ top: 0, behavior });
        }
    };

    const goToPage = (target: number) => {
        setSearchParams(target === 1 ? {} : { p: String(target) }, { preventScrollReset: true });
        scrollToTop("auto");
    };

    const openPhoto = useCallback(
        (photo: GalleryPhoto) => setLightboxIndex(galleryPhotos.indexOf(photo)),
        [],
    );

    return (
        <div className="ph">
            <SEO
                title="Photos"
                description={strings.pages.photos.description}
                url="https://exoad.net/photos"
            />

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
                    <Link to="/" className="ph-label ph-step ph-step-prev">
                        ← exoad.net
                    </Link>
                    <button
                        type="button"
                        className="ph-label"
                        onClick={() => scrollToTop(motionSafeScrollBehavior())}
                    >
                        Top
                    </button>
                </div>
            </footer>

            {lightboxIndex !== null &&
                // Portaled out of ContentFade's transformed route wrapper, which
                // would otherwise become the containing block for position:fixed.
                createPortal(
                    <Lightbox
                        index={lightboxIndex}
                        onNavigate={setLightboxIndex}
                        onClose={() => setLightboxIndex(null)}
                    />,
                    document.body,
                )}
        </div>
    );
}
