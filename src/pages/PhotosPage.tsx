import { useMemo, useEffect, useRef, useState } from 'react';
import { photos } from "../data/photos";
import Scaffold from '../components/Scaffold';
import { strings } from '../data/shared.ts';
import "../styles/PhotosPage.css";
import "../styles/Animations.css";
import PageDescriptor from '../components/PageDescriptor';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
export default function PhotosPage({ scaffoldProps = {} }) {
  const [visiblePhotos, setVisiblePhotos] = useState<Record<string, boolean>>({});
  const photoRefs = useRef<Record<string, HTMLDivElement | null>>({});
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
    Object.entries(photoRefs.current).forEach(([_, ref]) => {
      if (ref) {
        observer.observe(ref);
      }
    });
    return () => observer.disconnect();
  }, []);

  const processedPhotos = useMemo(() => {
    const processed = photos.map((photo, index) => {
      return {
        ...photo,
        id: `photo-${index}`
      };
    });
    return processed;
  }, []);

  return (
    <Scaffold showSpinner useForcedPadding={true} {...scaffoldProps}>
      <main className="min-h-screen flex flex-col items-center bg-black">
        <PageDescriptor title={strings.pages.photos.title} description={strings.pages.photos.description} />
        <div className="flex flex-col gap-10 mb-16 w-full px-4" style={{ maxWidth: "min(100%, 690px)" }}>
          {processedPhotos.map((photo) => (
            <div
              key={photo.id}
              className="w-full"
              ref={el => { photoRefs.current[photo.id] = el; }}
              data-photo-id={photo.id}
            >
              <div className="photo-image-wrapper">
                <div className="photo-container relative">
                  {visiblePhotos[photo.id] ? (
                    <div className="photo-aspect-ratio-container">
                      <button
                        onClick={() => window.open(photo.src, '_blank')}
                        className="w-full h-full bg-transparent"
                        aria-label={`View larger image of ${photo.alt}`}
                      >
                        <img
                          src={photo.thumbnailSrc}
                          alt={photo.alt}
                          rel="preload"
                          className="photo-image"
                          decoding="async"
                          width="800"
                          height="450"
                          fetchPriority={photo.id === 'photo-0' ? 'high' : 'auto'}
                        />
                      </button>
                    </div>
                  ) : (
                    <div className="photo-aspect-ratio-container bg-gray-00 flex items-center justify-center rounded-xl">
                      <div className="loading-spinner"></div>
                    </div>
                  )}
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent opacity-100 flex flex-col justify-end p-[1rem]"
                  >
                    {photo.caption && (
                      <h3 className="text-lg md:text-2xl font-playfair text-white">{photo.caption}</h3>
                    )}
                    <div className="flex justify-between text-sm text-white font-montserrat">
                      <span>{photo.location}</span>
                      <span>{formatDate(photo.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main >
    </Scaffold >
  );
}