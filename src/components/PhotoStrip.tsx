import { Link } from "react-router-dom";
import { galleryPhotos } from "../data/gallery";

// Enough to read as a strip of frames rather than a row of buttons. The last
// two are dropped on narrow screens, where six would each be a sliver.
const STRIP_COUNT = 6;

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
                    <img
                        key={photo.id}
                        src={photo.thumbSrc}
                        width={photo.thumbWidth}
                        height={photo.thumbHeight}
                        // The link already names the destination; captioning each
                        // frame here would just be noise to a screen reader.
                        alt=""
                        loading="lazy"
                        decoding="async"
                    />
                ))}
            </Link>
            <p>
                <Link to="/photos">all {galleryPhotos.length} photographs</Link>
            </p>
        </section>
    );
}
