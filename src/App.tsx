import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PhotosPage = lazy(() => import('./pages/PhotosPage'));

// Minimum loading time in milliseconds
const MIN_LOADING_TIME = 6000;

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const duration = MIN_LOADING_TIME;
    const interval = 50;
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      setProgress(eased * 100);
      
      if (elapsed >= duration) {
        clearInterval(timer);
        onComplete();
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div 
      className="min-h-screen bg-bg0 flex flex-col items-center justify-center gap-8 transition-opacity duration-1000"
      style={{ opacity: progress < 90 ? 1 : 1 - (progress - 90) / 10 }}
    >
      {/* Scrolling color bar with all Gruvbox colors */}
      <div className="w-64 h-[2px] bg-bg2 overflow-hidden relative">
        <div className="absolute inset-0 animate-color-scroll" />
      </div>
      
      <span className="text-fg4/40 text-[10px] font-sans tracking-[0.5em] uppercase">
        Loading
      </span>
    </div>
  );
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  
  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Small delay before showing content for smooth transition
    setTimeout(() => setShowContent(true), 100);
  };
  
  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }
  
  return (
    <div 
      className="transition-all duration-[2000ms] ease-out"
      style={{ 
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(30px)'
      }}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/photos" element={<PhotosPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
