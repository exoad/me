import { useMemo, useEffect, useRef, useState } from 'react';
import { photos } from "../data/photos";
import Scaffold from '../components/Scaffold';
import { strings } from '../data/shared.ts';
import "../styles/PhotosPage.css";

export default function PhotosPage() {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const [visiblePhotos, setVisiblePhotos] = useState<Record<string, boolean>>({});
  const photoRefs = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    if (photos.length > 0) {
      const preloadImage = new Image();
      preloadImage.src = photos[0].src;
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
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const processedPhotos = useMemo(() => {
    return photos.map((photo, index) => {
      return {
        ...photo,
        optimizedPath: photo.thumbnailSrc || photo.src,
        fullPath: photo.src,
        id: `photo-${index}`
      };
    });
  }, []);

  return (
    <Scaffold showSpinner>
      <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
        <div className="max-w-4xl w-full px-4 sm:px-6 md:px-8">
          <div className="flex flex-col items-center gap-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-playfair text-center mb-6">
              {strings.pages.photos.title}
            </h1>
            <div className="py-8 my-7" >
              <div className="w-24 h-px bg-white" />
            </div>
            <p className="text-white/70 text-lg text-center max-w-2xl mx-auto font-montserrat leading-relaxed mb-16">
              {strings.pages.photos.description}
            </p>
          </div>
          <div className="flex flex-col gap-8 mb-16">
            {processedPhotos.map((photo) => (
              <div
                key={photo.id}
                className="w-full"
                style={{
                  contain: 'layout'
                }}
                ref={el => { photoRefs.current[photo.id] = el; }}
                data-photo-id={photo.id}
              >
                <div
                  className="photo-container"
                >
                  {visiblePhotos[photo.id] ? (
                    <img
                      src={photo.fullPath}
                      alt={photo.alt}
                      className="photo-image"
                      decoding="async"
                      width="800"
                      height="450"
                      fetchPriority={photo.id === 'photo-0' ? 'high' : 'auto'}
                      onLoad={() => {
                        setVisiblePhotos(prev => ({ ...prev, [photo.id]: true }));
                      }}
                    />
                  ) : (
                    <div className="photo-image bg-gray-900 flex items-center justify-center">
                      <div className="loading-spinner"></div>
                    </div>
                  )}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-100 flex flex-col justify-end"
                    style={{
                      padding: '1rem',
                      height: '100%'
                    }}
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
            ))}
          </div>
        </div>
      </div>
    </Scaffold>
  );
}
