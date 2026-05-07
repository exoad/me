import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const HomePage = lazy(() => import("./pages/HomePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PhotosPage = lazy(() => import("./pages/PhotosPage"));

// Timing in milliseconds
const LOADING_TIME = 1800;
const FADE_OUT_TIME = 800;
const CONTENT_FADE_TIME = 2500;

function LoadingScreen({ onFadeComplete }: { onFadeComplete: () => void }) {
	const [opacity, setOpacity] = useState(1);

	useEffect(() => {
		// Start fade out after loading time
		const fadeTimer = setTimeout(() => {
			setOpacity(0);
		}, LOADING_TIME);

		// Complete after fade out finishes
		const completeTimer = setTimeout(() => {
			onFadeComplete();
		}, LOADING_TIME + FADE_OUT_TIME);

		return () => {
			clearTimeout(fadeTimer);
			clearTimeout(completeTimer);
		};
	}, [onFadeComplete]);

	return (
		<div 
			className="fixed inset-0 z-50 bg-bg0 flex flex-col items-center justify-center gap-8 transition-opacity duration-[800ms] ease-out"
			style={{ opacity }}
		>
			{/* Core Gruvbox colors - always visible, no background gap */}
			<div className="flex items-center h-16">
				<div className="w-3 h-12 bg-red origin-bottom animate-wave-scale" />
				<div className="w-3 h-12 bg-green origin-bottom animate-wave-scale" style={{ animationDelay: '120ms' }} />
				<div className="w-3 h-12 bg-yellow origin-bottom animate-wave-scale" style={{ animationDelay: '240ms' }} />
				<div className="w-3 h-12 bg-blue origin-bottom animate-wave-scale" style={{ animationDelay: '360ms' }} />
			</div>

			<span className="text-fg4/40 text-[10px] font-sans tracking-[0.5em] uppercase">
				Loading
			</span>
		</div>
	);
}

function AppContent() {
	const [showLoading, setShowLoading] = useState(true);
	const [showContent, setShowContent] = useState(false);

	useEffect(() => {
		// Start showing content when loading begins to fade
		const contentTimer = setTimeout(() => {
			setShowContent(true);
		}, LOADING_TIME);

		return () => clearTimeout(contentTimer);
	}, []);

	const handleLoadingFadeComplete = () => {
		setShowLoading(false);
	};

	return (
		<>
			{showLoading && (
				<LoadingScreen onFadeComplete={handleLoadingFadeComplete} />
			)}
			<div
				className="transition-all ease-out"
				style={{
					opacity: showContent ? 1 : 0,
					transform: showContent ? "translateY(0)" : "translateY(40px)",
					transitionDuration: `${CONTENT_FADE_TIME}ms`,
					transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
				}}
			>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/photos" element={<PhotosPage />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>
		</>
	);
}

export default function App() {
	return (
		<Router>
			<AppContent />
		</Router>
	);
}
