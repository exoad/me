import { useMemo, useEffect, useRef, useState } from 'react';
import { photos } from "../data/photos";
import Scaffold from '../components/Scaffold';
import { MdClose } from "react-icons/md";
import { strings } from '../data/shared.ts';
import "../styles/PhotosPage.css";
import "../styles/Animations.css";
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
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isLoadingBigImage, setisLoadingBigImage] = useState(false);
  const [hasErrorForBigImage, sethasErrorForBigImage] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const photoRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const loadingTimerRef = useRef<number | null>(null);
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

  function handlePhotoSelection(src: string) {
    setisLoadingBigImage(true);
    setSelectedPhoto(src);
    sethasErrorForBigImage(false);
    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current);
    }
    loadingTimerRef.current = window.setTimeout(() => {
      setisLoadingBigImage(false);
    }, 10000);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setisLoadingBigImage(false);
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    };
    img.onerror = () => {
      sethasErrorForBigImage(true);
      setisLoadingBigImage(false);
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    };
  }

  function closeModal() {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedPhoto(null);
      setisLoadingBigImage(false);
      sethasErrorForBigImage(false);
      setIsClosing(false);
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    }, 200);
  }

  return (
    <Scaffold showSpinner useForcedPadding={true} {...scaffoldProps}>
      <main className="min-h-screen flex flex-col items-center bg-black">
        <div
          className="flex flex-col items-center gap-8 max-w-3xl px-4 sm:px-6"
        >
          <h1 className="animate-fade-in text-6xl lg:text-7xl font-bold font-playfair text-center mb-8">
            {strings.pages.photos.title}
          </h1>
          <div className="animate-fade-in" >
            <div className="w-24 h-px bg-white" />
          </div>
          <p className="text-white/70 text-lg text-center max-w-2xl mx-auto font-montserrat leading-relaxed mb-12">
            {strings.pages.photos.description}
          </p>
        </div>
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
                        onClick={() => handlePhotoSelection(photo.src)}
                        className="w-full h-full border-0 p-0 bg-transparent"
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
                    <div className="photo-aspect-ratio-container bg-gray-900 flex items-center justify-center rounded-xl">
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
        {selectedPhoto && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
          >
            <button
              className="absolute inset-0 w-full h-full bg-transparent border-0"
              onClick={closeModal}
              aria-label="Close full screen image"
            />
            <div className={`relative z-10 flex flex-col items-center justify-center w-full max-w-[95%] max-h-[95vh] ${isClosing ? 'animate-scale-out' : ''}`}>
              {isLoadingBigImage ? (
                <div className="flex items-center justify-center bg-black/30 p-8 rounded-lg">
                  <div className="loading-spinner" />
                </div>
              ) : hasErrorForBigImage ? (
                <div className="flex flex-col items-center justify-center text-white bg-black/40 p-8 rounded-xl backdrop-blur-sm">
                  <p className="text-lg font-montserrat">{strings.pages.photos.error}</p>
                </div>
              ) : (
                <div className={`modal-image-container w-full flex justify-center p-1 bg-black/30 shadow-xl ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}>
                  <img
                    src={selectedPhoto}
                    alt=""
                    className="max-w-full max-h-[98vh] object-contain"
                  />
                </div>
              )}
              <button
                type="button"
                className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:bg-white/70  transition-all transform hover:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                }}
                aria-label="Return to gallery"
                tabIndex={0}
              >
                <MdClose size={28} />
              </button>
            </div>
          </div>
        )
        }
      </main >
    </Scaffold >
  );
}
