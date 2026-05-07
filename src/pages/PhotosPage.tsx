import { useEffect, useState } from 'react';
import { photos } from "../data/photos";
import SEO from '../components/SEO';
import PageLoadAnimation from '../components/PageLoadAnimation';
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

  useEffect(() => {
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <PageLoadAnimation>
      <SEO
        title="Photos"
        description={strings.pages.photos.description}
        url="https://exoad.net/photos"
      />
      
      <div className="min-h-screen bg-bg0">
        {/* Simple header */}
        <header className="border-b border-bg2">
          <div className="max-w-2xl mx-auto px-6 py-6">
            <a 
              href="/" 
              className="text-fg4 hover:text-fg0 transition-colors duration-300 text-xs font-sans uppercase tracking-widest"
            >
              ← Back Home
            </a>
          </div>
        </header>

        {/* Main content */}
        <main className="py-12 px-6">
          <div className="max-w-2xl mx-auto">
            {/* Title */}
            <div className="mb-10">
              <h1 className="text-2xl sm:text-3xl font-bold font-playfair text-fg0 mb-2">
                {strings.pages.photos.title}
              </h1>
              <p className="text-fg3 text-sm font-sans">
                {strings.pages.photos.description}
              </p>
            </div>

            {/* Photos */}
            <div className="flex flex-col gap-10">
              {photos.map((photo, index) => {
                const photoId = `photo-${index}`;
                const isLoaded = loadedImages[photoId];
                
                return (
                  <div key={photoId} className="group">
                    {/* Image container */}
                    <div className="relative border border-bg2 overflow-hidden bg-bg1">
                      {/* Loading state */}
                      {!isLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="w-32 h-[2px] bg-bg2 overflow-hidden">
                            <div 
                              className="h-full bg-fg3"
                              style={{
                                animation: "loadingBar 1s ease-in-out infinite",
                              }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Actual image */}
                      <button
                        onClick={() => window.open(photo.src, '_blank')}
                        className="w-full block relative"
                        aria-label={`View larger image of ${photo.alt}`}
                      >
                        <img
                          src={photo.thumbnailSrc}
                          alt={photo.alt}
                          className={`w-full h-auto object-cover transition-all duration-700 ${
                            isLoaded ? 'opacity-100' : 'opacity-0'
                          }`}
                          onLoad={() => handleImageLoad(photoId)}
                          decoding="async"
                          loading={index < 2 ? "eager" : "lazy"}
                        />
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-bg0/0 group-hover:bg-bg0/20 transition-colors duration-500 flex items-center justify-center">
                          <MdOutlineArrowOutward 
                            size={24} 
                            className="text-fg0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100" 
                          />
                        </div>
                      </button>
                    </div>
                    
                    {/* Metadata */}
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      {photo.caption && (
                        <h3 className="text-sm font-sans font-medium text-fg0">{photo.caption}</h3>
                      )}
                      <div className="flex items-center gap-2 text-xs text-fg4 font-sans">
                        <span>{photo.location}</span>
                        <span>·</span>
                        <span>{formatDate(photo.date)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-bg2 py-8 px-6 mt-12">
          <div className="max-w-2xl mx-auto flex justify-between items-center">
            <span className="text-fg4 text-[10px] font-sans">
              {strings.footer.legals}
            </span>
            <a
              href="/"
              className="text-fg4 hover:text-fg3 text-[10px] font-sans transition duration-300"
            >
              Back to home
            </a>
          </div>
        </footer>
      </div>
    </PageLoadAnimation>
  );
}
