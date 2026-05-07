import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PhotosPage = lazy(() => import('./pages/PhotosPage'));

function LoadingFallback() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const duration = 3500; // 3.5 seconds - slower loading
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const t = currentStep / steps;
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.min(eased * 100, 100));
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg0 flex flex-col items-center justify-center gap-8">
      {/* Animated loading segments with scale effect */}
      <div className="flex items-center gap-1">
        <div 
          className="w-3 h-12 bg-red transition-transform duration-500 ease-out"
          style={{ 
            transform: `scaleY(${0.3 + (progress / 100) * 0.7 + Math.sin(progress * 0.15) * 0.25})`,
            opacity: 0.4 + (progress / 100) * 0.6
          }}
        />
        <div 
          className="w-3 h-12 bg-green transition-transform duration-500 ease-out"
          style={{ 
            transform: `scaleY(${0.3 + (progress / 100) * 0.7 + Math.sin((progress + 20) * 0.15) * 0.25})`,
            opacity: 0.4 + (progress / 100) * 0.6
          }}
        />
        <div 
          className="w-3 h-12 bg-blue transition-transform duration-500 ease-out"
          style={{ 
            transform: `scaleY(${0.3 + (progress / 100) * 0.7 + Math.sin((progress + 40) * 0.15) * 0.25})`,
            opacity: 0.4 + (progress / 100) * 0.6
          }}
        />
        <div 
          className="w-3 h-12 bg-yellow transition-transform duration-500 ease-out"
          style={{ 
            transform: `scaleY(${0.3 + (progress / 100) * 0.7 + Math.sin((progress + 60) * 0.15) * 0.25})`,
            opacity: 0.4 + (progress / 100) * 0.6
          }}
        />
      </div>
      
      <span className="text-fg4 text-xs font-sans tracking-[0.3em] uppercase">
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
