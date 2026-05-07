import { useMemo, useEffect, useRef, useState } from 'react';
import { photos } from "../data/photos";
import SEO from '../components/SEO';
import PageLoadAnimation from '../components/PageLoadAnimation';
import { strings } from '../data/shared.ts';
import { MdOutlineArrowOutward, MdArrowBack } from "react-icons/md";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function PhotosPage() {
  const [visiblePhotos, setVisiblePhotos] = useState<Record<string, boolean>>({});
  const photoRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (photos.length > 0) {
      const initialVisible = photos.slice(0, 2).reduce((acc, _, index) => {
        acc[`photo-${index}`] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setVisiblePhotos(initialVisible);
    }
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '200px',
      threshold: 0.01
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-photo-id');
          if (id) {
            setVisiblePhotos(prev => ({ ...prev, [id]: true }));
            observer.unobserve(entry.target);
          }
        }
      });
    }, options);

    for (const [_, ref] of Object.entries(photoRefs.current)) {
      if (ref) {
        observer.observe(ref);
      }
    }
    return () => observer.disconnect();
  }, []);

  const processedPhotos = useMemo(() => {
    return photos.map((photo, index) => ({
      ...photo,
      id: `photo-${index}`
    }));
  }, []);

  return (
    <PageLoadAnimation>
      <SEO
        title="Photos"
        description={strings.pages.photos.description}
        url="https://exoad.net/photos"
      />
      
      <div className="min-h-screen bg-bg0">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-bg0/90 backdrop-blur-sm border-b border-bg2">
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
            <a 
              href="/" 
              className="flex items-center gap-2 text-fg3 hover:text-fg0 transition-colors duration-300 text-sm font-sans"
            >
              <MdArrowBack size={18} />
              <span>Back</span>
            </a>
            <span className="text-fg0 font-playfair text-lg">Photos</span>
            <div className="w-16"></div>
          </div>
        </header>

        {/* Main content */}
        <main className="pt-24 pb-20 px-6">
          <div className="max-w-2xl mx-auto">
            {/* Title section */}
            <div className="mb-12" style={{ opacity: 0, animation: "fadeIn 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards" }}>
              <h1 className="text-3xl sm:text-4xl font-bold font-playfair text-fg0 mb-3">
                {strings.pages.photos.title}
              </h1>
              <p className="text-fg3 text-sm font-sans leading-relaxed">
                {strings.pages.photos.description}
              </p>
            </div>

            {/* Photos grid */}
            <div className="flex flex-col gap-8">
              {processedPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  ref={el => { photoRefs.current[photo.id] = el; }}
                  data-photo-id={photo.id}
                  className="group"
                  style={{ 
                    opacity: 0, 
                    animation: `fadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${0.4 + index * 0.1}s forwards` 
                  }}
                >
                  <div className="relative overflow-hidden border border-bg2 hover:border-fg3 transition-colors duration-500">
                    {visiblePhotos[photo.id] ? (
                      <button
                        onClick={() => window.open(photo.src, '_blank')}
                        className="w-full block relative"
                        aria-label={`View larger image of ${photo.alt}`}
                      >
                        <img
                          src={photo.thumbnailSrc}
                          alt={photo.alt}
                          className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                          decoding="async"
                          loading={index < 2 ? "eager" : "lazy"}
                        />
                        <div className="absolute inset-0 bg-bg0/0 group-hover:bg-bg0/10 transition-colors duration-500"></div>
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <MdOutlineArrowOutward size={20} className="text-fg0" />
                        </div>
                      </button>
                    ) : (
                      <div className="aspect-video bg-bg1 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-fg4 border-t-fg0 rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Photo metadata */}
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    {photo.caption && (
                      <h3 className="text-sm font-sans font-medium text-fg0">{photo.caption}</h3>
                    )}
                    <div className="flex items-center gap-3 text-xs text-fg4 font-sans">
                      <span>{photo.location}</span>
                      <span className="text-bg2">·</span>
                      <span>{formatDate(photo.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-bg2 py-8 px-6">
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
