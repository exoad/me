import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function useLenis(enabled: boolean) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      // Cleanup existing Lenis instance
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
      return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    let isActive = true;

    function raf(time: number) {
      if (!isActive || !lenisRef.current) return;
      lenisRef.current.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActive = false;
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }
      } else if (lenisRef.current) {
        isActive = true;
        rafIdRef.current = requestAnimationFrame(raf);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isActive = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [enabled]);

  return lenisRef;
}
