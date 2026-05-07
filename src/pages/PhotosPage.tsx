import { useEffect, useState, useRef, useCallback } from "react";
import { photos } from "../data/photos";
import SEO from '../components/SEO';
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

// Track visible photos with ability to unload
function usePhotoVisibility() {
  const [visiblePhotos, setVisiblePhotos] = useState<Set<string>>(new Set());
  const observersRef = useRef<Map<string, IntersectionObserver>>(new Map());

  const observePhoto = useCallback((id: string, element: HTMLElement | null) => {
    if (!element) return;

    // Disconnect existing observer for this photo if any
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
            // Only unload if it's been loaded before and is now far off-screen
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
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);
  const { visiblePhotos, observePhoto, cleanup } = usePhotoVisibility();
  const photoRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Reset scroll position
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    return () => cleanup();
  }, [cleanup]);

  const handleImageLoad = useCallback((id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  }, []);

  // Split photos into columns for masonry-like effect
  const leftColumn = photos.filter((_, i) => i % 2 === 0);
  const rightColumn = photos.filter((_, i) => i % 2 === 1);

  const PhotoCard = ({ photo, index }: { photo: typeof photos[0], index: number }) => {
    const photoId = `photo-${index}`;
    const isVisible = visiblePhotos.has(photoId);
    const isLoaded = loadedImages[photoId];
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
        {/* Image container with art frame style */}
        <div className="relative overflow-hidden bg-bg1 border border-bg2 hover:border-fg4 transition-colors duration-500">
          {/* Loading state - only show when visible but not loaded */}
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
          
          {/* Image - only render when visible */}
          {isVisible ? (
            <button
              onClick={() => window.open(photo.src, '_blank')}
              className="w-full block relative"
              aria-label={`View larger image of ${photo.alt}`}
            >
              <img
                src={photo.thumbnailSrc}
                alt={photo.alt}
                className={`w-full h-auto object-cover transition-opacity duration-500 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(photoId)}
                decoding="async"
                loading="eager"
                style={{ 
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  transition: 'transform 0.5s ease-out'
                }}
              />
              
              {/* Hover overlay with info */}
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
            /* Placeholder when not in view */
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
        {/* Minimal header */}
        <header className="border-b border-bg2">
          <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
            <a 
              href="/" 
              className="text-fg4 hover:text-fg0 transition-colors duration-300 text-xs font-sans uppercase tracking-widest"
            >
              ← Back
            </a>
            <h1 className="text-lg font-playfair text-fg0">Photos</h1>
            <div className="w-16"></div>
          </div>
        </header>

        {/* Art grid layout */}
        <main className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Intro */}
            <div className="mb-12 max-w-xl">
              <p className="text-fg3 text-sm font-sans leading-relaxed">
                {strings.pages.photos.description}
              </p>
            </div>

            {/* Two-column masonry grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left column */}
              <div className="flex flex-col gap-4">
                {leftColumn.map((photo, i) => (
                  <PhotoCard key={`left-${i}`} photo={photo} index={i * 2} />
                ))}
              </div>
              
              {/* Right column - offset for masonry effect */}
              <div className="flex flex-col gap-4 md:mt-12">
                {rightColumn.map((photo, i) => (
                  <PhotoCard key={`right-${i}`} photo={photo} index={i * 2 + 1} />
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Minimal footer */}
        <footer className="border-t border-bg2 py-8 px-6">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <span className="text-fg4 text-[10px] font-sans">
              {strings.footer.legals}
            </span>
            <a
              href="/"
              className="text-fg4 hover:text-fg3 text-[10px] font-sans transition duration-300 uppercase tracking-wider"
            >
              Home
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
