import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { galleryPhotos, type GalleryPhoto } from "../data/gallery";

// Enough to read as a strip of frames rather than a row of buttons. The last
// two are dropped on narrow screens, where six would each be a sliver.
const STRIP_COUNT = 6;

/**
 * One frame: the manifest's blur placeholder, with the real thumbnail fading in
 * over it once it arrives. The placeholder is a data URI baked into the bundle,
 * so it paints on the first frame and the row never opens as six empty boxes.
 */
function StripFrame({ photo }: { photo: GalleryPhoto }) {
    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // A cached thumbnail can finish before React attaches onLoad, which would
    // strand it at opacity 0 behind its own placeholder.
    useEffect(() => {
        const img = imgRef.current;
        if (img?.complete && img.naturalWidth > 0) setLoaded(true);
    }, []);

    return (
        <span className="photo-strip-frame">
            <img className="photo-strip-blur" src={photo.blur} alt="" aria-hidden="true" />
            <img
                ref={imgRef}
                className={`photo-strip-photo${loaded ? " is-loaded" : ""}`}
                src={photo.thumbSrc}
                width={photo.thumbWidth}
                height={photo.thumbHeight}
                // The link already names the destination; captioning each frame
                // here would just be noise to a screen reader.
                alt=""
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
            />
        </span>
    );
}

/**
 * The newest frames, as a contact strip on the home page.
 *
 * Deliberately not styled like the gallery: no black field, no mono chrome,
 * nothing borrowed from that page. It sits in the document the way a figure
 * does, and the photographs supply all of the colour.
 */
export default function PhotoStrip() {
    const recent = galleryPhotos.slice(0, STRIP_COUNT);
    if (recent.length === 0) return null;

    return (
        <section>
            <h2>Photos</h2>
            <Link
                to="/photos"
                className="photo-strip"
                aria-label={`View all ${galleryPhotos.length} photographs`}
            >
                {recent.map((photo) => (
                    <StripFrame key={photo.id} photo={photo} />
                ))}
            </Link>
            <p>
                <Link to="/photos">all {galleryPhotos.length} photographs</Link>
            </p>
        </section>
    );
}
