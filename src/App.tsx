import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const HomePage = lazy(() => import("./pages/HomePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PhotosPage = lazy(() => import("./pages/PhotosPage"));

// Minimum loading time in milliseconds
const MIN_LOADING_TIME = 1800;

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onComplete();
		}, MIN_LOADING_TIME);
		return () => clearTimeout(timer);
	}, [onComplete]);

	return (
		<div className="min-h-screen bg-bg0 flex flex-col items-center justify-center gap-8">
			{/* Static color bar - all colors already visible, just the shimmer moves */}
			<div className="w-64 h-[2px] relative overflow-hidden">
				{/* Background with all Gruvbox colors */}
				<div 
					className="absolute inset-0"
					style={{
						background: 'linear-gradient(90deg, #cc241d 0%, #98971a 14%, #d79921 28%, #458588 42%, #b16286 56%, #689d6a 70%, #d65d0e 84%, #928374 100%)'
					}}
				/>
				{/* Shimmer overlay that moves */}
				<div className="absolute inset-0 animate-shimmer" />
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
		setShowContent(true);
	};

	if (isLoading) {
		return <LoadingScreen onComplete={handleLoadingComplete} />;
	}

	return (
		<div
			className="transition-all duration-[3000ms] ease-out"
			style={{
				opacity: showContent ? 1 : 0,
				transform: showContent ? "translateY(0)" : "translateY(40px)",
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
