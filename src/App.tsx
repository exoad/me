import { Suspense, lazy, useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useLenis } from "./hooks/useLenis";

const HomePage = lazy(() => import("./pages/HomePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PhotosPage = lazy(() => import("./pages/PhotosPage"));
const BlogListPage = lazy(() => import("./pages/BlogListPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

// Timing in milliseconds
const LOADING_TIME = 1800;
const FADE_OUT_TIME = 600;
const CONTENT_FADE_TIME = 1500;

function LoadingScreen({ onFadeComplete }: { onFadeComplete: () => void }) {
	const [opacity, setOpacity] = useState(1);

	useEffect(() => {
		const fadeTimer = setTimeout(() => {
			setOpacity(0);
		}, LOADING_TIME);

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
			className="fixed inset-0 z-50 bg-bg0 flex flex-col items-center justify-center gap-8"
			style={{
				opacity,
				transition: `opacity ${FADE_OUT_TIME}ms ease-out`,
			}}
		>
			<div className="flex items-center gap-1 h-16">
				<div
					className="w-2 h-10 bg-red animate-pulse"
					style={{ animationDelay: "0ms", animationDuration: "1.2s" }}
				/>
				<div
					className="w-2 h-10 bg-green animate-pulse"
					style={{ animationDelay: "0.3s", animationDuration: "1.2s" }}
				/>
				<div
					className="w-2 h-10 bg-yellow animate-pulse"
					style={{ animationDelay: "0.6s", animationDuration: "1.2s" }}
				/>
				<div
					className="w-2 h-10 bg-blue animate-pulse"
					style={{ animationDelay: "0.9s", animationDuration: "1.2s" }}
				/>
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
	const location = useLocation();

	// Enable Lenis only on home page, disable on photos page
	const enableLenis = location.pathname === "/";
	useLenis(enableLenis);

	useEffect(() => {
		const contentTimer = setTimeout(() => {
			setShowContent(true);
		}, LOADING_TIME);

		return () => clearTimeout(contentTimer);
	}, []);

	const handleLoadingFadeComplete = useCallback(() => {
		setShowLoading(false);
	}, []);

	return (
		<>
			{showLoading && (
				<LoadingScreen onFadeComplete={handleLoadingFadeComplete} />
			)}
			<div
				className="transition-all ease-out"
				style={{
					opacity: showContent ? 1 : 0,
					transform: showContent ? "translateY(0)" : "translateY(20px)",
					transitionDuration: `${CONTENT_FADE_TIME}ms`,
					transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
					willChange: showContent ? "auto" : "opacity, transform",
				}}
			>
				<Suspense fallback={null}>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/projects" element={<ProjectsPage />} />
						<Route path="/about" element={<AboutPage />} />
						<Route path="/contacts" element={<ContactPage />} />
						<Route path="/photos" element={<PhotosPage />} />
						<Route path="/blog" element={<BlogListPage />} />
						<Route path="/blog/:slug" element={<BlogPostPage />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Suspense>
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
