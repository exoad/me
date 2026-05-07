import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import Lenis from "lenis";
import App from "./App";
import "./index.css";

// Initialize Lenis with performance-optimized settings
const lenis = new Lenis({
  lerp: 0.08,
  smoothWheel: true,
  wheelMultiplier: 0.8,
  touchMultiplier: 1.5,
  infinite: false,
});

// Use requestAnimationFrame with proper cleanup
let rafId: number;
function raf(time: number) {
  lenis.raf(time);
  rafId = requestAnimationFrame(raf);
}
rafId = requestAnimationFrame(raf);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
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
