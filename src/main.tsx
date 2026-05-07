import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import Lenis from "lenis";
import App from "./App";
import "./index.css";

const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: true,
  wheelMultiplier: 1,
  infinite: false,
  syncTouch: true,
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

const rootDiv = document.getElementById("root");

if (rootDiv) {
  const root = createRoot(rootDiv);
  root.render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}
