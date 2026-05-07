import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PhotosPage = lazy(() => import('./pages/PhotosPage'));

function LoadingFallback() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const duration = 5000; // 5 seconds - premium, unhurried loading
    const interval = 16; // 60fps
    const steps = duration / interval;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const t = currentStep / steps;
      // Very smooth ease-out
      const eased = 1 - Math.pow(1 - t, 4);
      setProgress(Math.min(eased * 100, 100));
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg0 flex flex-col items-center justify-center gap-10">
      {/* Premium loading bars - subtle, calm breathing */}
      <div className="flex items-end gap-2 h-16">
        <div 
          className="w-2 bg-red/80 transition-all duration-700 ease-in-out"
          style={{ 
            height: `${20 + (progress * 0.6) + Math.sin(progress * 0.08) * 8}%`,
            opacity: 0.5 + (progress / 200)
          }}
        />
        <div 
          className="w-2 bg-green/80 transition-all duration-700 ease-in-out"
          style={{ 
            height: `${20 + (progress * 0.6) + Math.sin((progress + 25) * 0.08) * 8}%`,
            opacity: 0.5 + (progress / 200)
          }}
        />
        <div 
          className="w-2 bg-blue/80 transition-all duration-700 ease-in-out"
          style={{ 
            height: `${20 + (progress * 0.6) + Math.sin((progress + 50) * 0.08) * 8}%`,
            opacity: 0.5 + (progress / 200)
          }}
        />
        <div 
          className="w-2 bg-yellow/80 transition-all duration-700 ease-in-out"
          style={{ 
            height: `${20 + (progress * 0.6) + Math.sin((progress + 75) * 0.08) * 8}%`,
            opacity: 0.5 + (progress / 200)
          }}
        />
      </div>
      
      <span className="text-fg4/60 text-[10px] font-sans tracking-[0.4em] uppercase">
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
