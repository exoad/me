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
			{/* Color blocks with wave scale animation */}
			<div className="flex items-center gap-[3px] h-16">
				<div className="w-2 bg-red animate-wave-scale" style={{ animationDelay: '0ms' }} />
				<div className="w-2 bg-green animate-wave-scale" style={{ animationDelay: '100ms' }} />
				<div className="w-2 bg-yellow animate-wave-scale" style={{ animationDelay: '200ms' }} />
				<div className="w-2 bg-blue animate-wave-scale" style={{ animationDelay: '300ms' }} />
				<div className="w-2 bg-purple animate-wave-scale" style={{ animationDelay: '400ms' }} />
				<div className="w-2 bg-aqua animate-wave-scale" style={{ animationDelay: '500ms' }} />
				<div className="w-2 bg-orange animate-wave-scale" style={{ animationDelay: '600ms' }} />
				<div className="w-2 bg-gray animate-wave-scale" style={{ animationDelay: '700ms' }} />
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
