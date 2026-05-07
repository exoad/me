import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PhotosPage = lazy(() => import('./pages/PhotosPage'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-bg0 flex flex-col items-center justify-center gap-6">
      {/* Multi-color loading bar using Gruvbox primary colors */}
      <div className="w-56 h-[3px] flex overflow-hidden">
        <div className="flex-1 bg-red animate-loading-segment" style={{ animationDelay: '0ms' }} />
        <div className="flex-1 bg-green animate-loading-segment" style={{ animationDelay: '150ms' }} />
        <div className="flex-1 bg-blue animate-loading-segment" style={{ animationDelay: '300ms' }} />
        <div className="flex-1 bg-yellow animate-loading-segment" style={{ animationDelay: '450ms' }} />
      </div>
      <span className="text-fg4 text-xs font-sans tracking-[0.3em] uppercase">Loading</span>
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
