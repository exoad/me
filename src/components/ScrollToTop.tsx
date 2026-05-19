import { useState, useEffect } from 'react';
import { MdKeyboardArrowUp } from 'react-icons/md';
import { motionSafeScrollBehavior } from '../utils/motion';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: motionSafeScrollBehavior() })}
      aria-label="Scroll to top"
      className="motion-lift motion-press animate-scale-in fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-sm bg-bg2/60 hover:bg-bg3 text-fg4 hover:text-fg0 border border-bg3 hover:border-fg4"
    >
      <MdKeyboardArrowUp size={20} />
    </button>
  );
}
