import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PhotosPage = lazy(() => import('./pages/PhotosPage'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-bg0 flex flex-col items-center justify-center gap-4">
      {/* Minimal loading bar using Gruvbox colors */}
      <div className="w-48 h-[2px] bg-bg2 overflow-hidden">
        <div 
          className="h-full bg-fg0 animate-loading-bar"
          style={{
            animation: "loadingBar 1.5s ease-in-out infinite",
          }}
        />
      </div>
      <span className="text-fg4 text-xs font-sans tracking-widest uppercase">Loading</span>
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
