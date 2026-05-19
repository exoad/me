import { useEffect, useState, useRef, useCallback } from "react";
import { photos } from "../data/photos";
import SEO from '../components/SEO';
import SubpageNav from '../components/SubpageNav';
import { strings } from '../data/shared.ts';
import { MdOutlineArrowOutward } from "react-icons/md";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function usePhotoVisibility() {
  const [visiblePhotos, setVisiblePhotos] = useState<Set<string>>(new Set());
  const observersRef = useRef<Map<string, IntersectionObserver>>(new Map());

  const observePhoto = useCallback((id: string, element: HTMLElement | null) => {
    if (!element) return;

    const existingObserver = observersRef.current.get(id);
    if (existingObserver) {
      existingObserver.disconnect();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisiblePhotos(prev => {
          const next = new Set(prev);
          if (entry.isIntersecting) {
            next.add(id);
          } else {
            if (entry.boundingClientRect.top > window.innerHeight * 2 || 
                entry.boundingClientRect.bottom < -window.innerHeight * 2) {
              next.delete(id);
            }
          }
          return next;
        });
      },
      { threshold: 0, rootMargin: '200px' }
    );

    observer.observe(element);
    observersRef.current.set(id, observer);
  }, []);

  const cleanup = useCallback(() => {
    observersRef.current.forEach(observer => observer.disconnect());
    observersRef.current.clear();
  }, []);

  return { visiblePhotos, observePhoto, cleanup };
}

export default function PhotosPage() {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);
  const { visiblePhotos, observePhoto, cleanup } = usePhotoVisibility();
  const photoRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    return () => cleanup();
  }, [cleanup]);

  const handleImageLoad = useCallback((id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  }, []);

  const leftColumn = photos.filter((_, i) => i % 2 === 0);
  const rightColumn = photos.filter((_, i) => i % 2 === 1);

  const PhotoCard = ({ photo, index }: { photo: typeof photos[0], index: number }) => {
    const photoId = `photo-${index}`;
    const isVisible = visiblePhotos.has(photoId);
    const isLoaded = loadedImages[photoId];
    const hasFailed = failedImages[photoId];
    const isHovered = hoveredPhoto === photoId;

    useEffect(() => {
      observePhoto(photoId, photoRefs.current[photoId]);
    }, [photoId]);

    return (
      <div 
        ref={el => { photoRefs.current[photoId] = el; }}
        className="group relative mb-4"
        onMouseEnter={() => setHoveredPhoto(photoId)}
        onMouseLeave={() => setHoveredPhoto(null)}
      >
        <div className="motion-lift relative overflow-hidden bg-bg1 border border-bg2 hover:border-fg4 transition-colors duration-500">
          {isVisible && !isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-bg0">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-6 bg-red/60" />
                <div className="w-1.5 h-6 bg-green/60" />
                <div className="w-1.5 h-6 bg-yellow/60" />
                <div className="w-1.5 h-6 bg-blue/60" />
              </div>
            </div>
          )}

          {isVisible ? (
            <button
              onClick={() => window.open(photo.src, '_blank')}
              onFocus={() => setHoveredPhoto(photoId)}
              onBlur={() => setHoveredPhoto(null)}
              className="w-full block relative"
              aria-label={`View larger image of ${photo.alt}. ${photo.location}, ${formatDate(photo.date)}`}
            >
              {hasFailed ? (
                <div className="flex min-h-48 items-center justify-center bg-bg1 p-6 text-center text-sm text-fg4 font-sans">
                  {strings.pages.photos.error}
                </div>
              ) : (
                <img
                  src={photo.thumbnailSrc}
                  alt={photo.alt}
                  className={`w-full h-auto object-cover transition-[opacity,transform] duration-300 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  } ${
                    isHovered ? 'scale-[1.012]' : 'scale-100'
                  }`}
                  onLoad={() => handleImageLoad(photoId)}
                  onError={() => setFailedImages(prev => ({ ...prev, [photoId]: true }))}
                  decoding="async"
                  loading={index < 2 ? 'eager' : 'lazy'}
                />
              )}

              <div 
                className={`absolute inset-0 bg-bg0/80 flex flex-col justify-end p-4 transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex items-end justify-between">
                  <div>
                    {photo.caption && (
                      <h3 className="text-sm font-sans font-medium text-fg0 mb-1">{photo.caption}</h3>
                    )}
                    <div className="text-xs text-fg3 font-sans">
                      {photo.location} · {formatDate(photo.date)}
                    </div>
                  </div>
                  <MdOutlineArrowOutward size={18} className="text-fg0 flex-shrink-0 ml-2" />
                </div>
              </div>
            </button>
          ) : (
            <div className="w-full aspect-video bg-bg1 flex items-center justify-center">
              <div className="w-1.5 h-6 bg-fg4/20" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <SEO
        title="Photos"
        description={strings.pages.photos.description}
        url="https://exoad.net/photos"
      />

      <div className="min-h-screen bg-bg0">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-bg2">
          <div className="w-full">
            <SubpageNav />
          </div>
        </div>

        <main id="main" className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 max-w-xl">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-fg4 mb-4 font-sans">Gallery</h2>
              <p className="text-fg3 text-sm font-sans leading-relaxed">
                {strings.pages.photos.description}
              </p>
            </div>
            <div className="border-b border-bg2 mb-12" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                {leftColumn.map((photo, i) => (
                  <PhotoCard key={`left-${i}`} photo={photo} index={i * 2} />
                ))}
              </div>

              <div className="flex flex-col gap-4 md:mt-12">
                {rightColumn.map((photo, i) => (
                  <PhotoCard key={`right-${i}`} photo={photo} index={i * 2 + 1} />
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-bg2 py-8 px-6">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <span className="text-fg4 text-[10px] font-sans">
              {strings.footer.legals}
            </span>
            <a
              href="#main"
              className="text-fg4 hover:text-fg3 text-[10px] font-sans transition duration-300 uppercase tracking-wider"
            >
              Top
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
