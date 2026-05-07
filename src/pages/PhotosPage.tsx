import { useEffect, useState } from 'react';
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

export default function PhotosPage() {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  // Split photos into columns for masonry-like effect
  const leftColumn = photos.filter((_, i) => i % 2 === 0);
  const rightColumn = photos.filter((_, i) => i % 2 === 1);

  const PhotoCard = ({ photo, index }: { photo: typeof photos[0], index: number }) => {
    const photoId = `photo-${index}`;
    const isLoaded = loadedImages[photoId];
    const isHovered = hoveredPhoto === photoId;

    return (
      <div 
        className="group relative mb-4"
        onMouseEnter={() => setHoveredPhoto(photoId)}
        onMouseLeave={() => setHoveredPhoto(null)}
      >
        {/* Image container with art frame style */}
        <div className="relative overflow-hidden bg-bg1 border border-bg2 hover:border-fg4 transition-colors duration-500">
          {/* Loading state with smooth wave animation */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-bg0">
              <div className="flex items-center gap-[2px] h-8">
                <div className="w-1.5 h-full bg-red animate-wave-scale" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-full bg-green animate-wave-scale" style={{ animationDelay: '80ms' }} />
                <div className="w-1.5 h-full bg-yellow animate-wave-scale" style={{ animationDelay: '160ms' }} />
                <div className="w-1.5 h-full bg-blue animate-wave-scale" style={{ animationDelay: '240ms' }} />
              </div>
            </div>
          )}
          
          {/* Image */}
          <button
            onClick={() => window.open(photo.src, '_blank')}
            className="w-full block relative"
            aria-label={`View larger image of ${photo.alt}`}
          >
            <img
              src={photo.thumbnailSrc}
              alt={photo.alt}
              className={`w-full h-auto object-cover transition-all duration-700 ease-out ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              } ${isHovered ? 'scale-[1.03]' : 'scale-100'}`}
              onLoad={() => handleImageLoad(photoId)}
              decoding="async"
              loading="lazy"
            />
            
            {/* Hover overlay with info */}
            <div className={`absolute inset-0 bg-bg0/80 flex flex-col justify-end p-4 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
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
