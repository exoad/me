import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import Lenis from "lenis";
import App from "./App";
import "./index.css";

// Initialize Lenis with optimized settings for performance
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

// Expose lenis globally so pages can control it
(window as any).lenis = lenis;

// RAF loop with proper error handling
let rafId: number;
let isActive = true;

function raf(time: number) {
  if (!isActive) return;
  lenis.raf(time);
  rafId = requestAnimationFrame(raf);
}

// Start the loop
rafId = requestAnimationFrame(raf);

// Handle visibility change - pause when tab is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    isActive = false;
    cancelAnimationFrame(rafId);
  } else {
    isActive = true;
    rafId = requestAnimationFrame(raf);
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  isActive = false;
  cancelAnimationFrame(rafId);
  lenis.destroy();
});

const rootDiv = document.getElementById("root");

if (rootDiv) {
  const root = createRoot(rootDiv);
  root.render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}
