import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PhotosPage = lazy(() => import('./pages/PhotosPage'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-bg0 flex flex-col items-center justify-center gap-8">
      {/* Scrolling color bar - colors flow through a thin line */}
      <div className="w-64 h-[2px] bg-bg2 overflow-hidden relative">
        <div className="absolute inset-0 animate-color-scroll" />
      </div>
      
      <span className="text-fg4/40 text-[10px] font-sans tracking-[0.5em] uppercase">
        Loading
      </span>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/photos" element={<PhotosPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
