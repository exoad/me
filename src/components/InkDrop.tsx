import { useEffect, useState, useCallback } from 'react';

export default function InkDrop() {
  const [showTopDrop, setShowTopDrop] = useState(false);
  const [showBottomDrop, setShowBottomDrop] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const checkScrollPosition = useCallback(() => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    const atTop = scrollTop < 50;
    const atBottom = scrollTop + windowHeight > documentHeight - 50;
    
    setIsAtTop(atTop);
    setIsAtBottom(atBottom);
  }, []);

  useEffect(() => {
    // Check initial position
    checkScrollPosition();
    
    let rafId: number;
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollingUp = currentScrollY < lastScrollY;
        const scrollingDown = currentScrollY > lastScrollY;
        
        checkScrollPosition();
        
        // Show ink drop when reaching top while scrolling up
        if (scrollingUp && currentScrollY < 100) {
          setShowTopDrop(true);
          setTimeout(() => setShowTopDrop(false), 800);
        }
        
        // Show ink drop when reaching bottom while scrolling down
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        if (scrollingDown && currentScrollY + windowHeight > documentHeight - 100) {
          setShowBottomDrop(true);
          setTimeout(() => setShowBottomDrop(false), 800);
        }
        
        lastScrollY = currentScrollY;
        rafId = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [checkScrollPosition]);

  return (
    <>
      {/* Top ink drop */}
      <div
        className={`fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none z-50 transition-all duration-500 ease-out ${
          showTopDrop ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(60, 56, 54, 0.6) 0%, rgba(60, 56, 54, 0.2) 40%, transparent 70%)',
          width: '600px',
          height: '200px',
          filter: 'blur(8px)',
          transform: `translateX(-50%) translateY(${showTopDrop ? '-20px' : '-60px'})`,
        }}
      />

      {/* Bottom ink drop */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-50 transition-all duration-500 ease-out ${
          showBottomDrop ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(60, 56, 54, 0.6) 0%, rgba(60, 56, 54, 0.2) 40%, transparent 70%)',
          width: '600px',
          height: '200px',
          filter: 'blur(8px)',
          transform: `translateX(-50%) translateY(${showBottomDrop ? '20px' : '60px'})`,
        }}
      />
    </>
  );
}
