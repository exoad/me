import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PhotosPage = lazy(() => import('./pages/PhotosPage'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-bg0 flex flex-col items-center justify-center gap-10">
      {/* Premium loading bars - pure CSS animation, no JS */}
      <div className="flex items-end gap-3 h-20">
        <div className="w-2 bg-red animate-loading-bar" style={{ animationDelay: '0ms' }} />
        <div className="w-2 bg-green animate-loading-bar" style={{ animationDelay: '200ms' }} />
        <div className="w-2 bg-blue animate-loading-bar" style={{ animationDelay: '400ms' }} />
        <div className="w-2 bg-yellow animate-loading-bar" style={{ animationDelay: '600ms' }} />
      </div>
      
      <span className="text-fg4/50 text-[10px] font-sans tracking-[0.5em] uppercase animate-pulse-slow">
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
