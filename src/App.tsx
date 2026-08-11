import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useWebMcp } from "./hooks/useWebMcp";

const HomePage = lazy(() => import("./pages/HomePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PhotosPage = lazy(() => import("./pages/PhotosPage"));
const BlogListPage = lazy(() => import("./pages/BlogListPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));

function PageLoading() {
	return (
		<div className="page" role="status" aria-live="polite">
			<p>Loading page...</p>
		</div>
	);
}

function ThemedScrollbar() {
	const location = useLocation();

	useEffect(() => {
		const isPhotos = location.pathname.startsWith("/photos");
		document.documentElement.classList.toggle("themed-scrollbar", !isPhotos);
	}, [location.pathname]);

	return null;
}

function AppContent() {
	// Offers the site's own data to an agent running in this browser. No-ops
	// where WebMCP is not implemented, which is currently most places.
	useWebMcp();

	return (
		<>
		<ThemedScrollbar />
		<a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-black focus:outline focus:outline-2 focus:outline-black">
			Skip to main content
		</a>
		<Suspense fallback={<PageLoading />}>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/photos" element={<PhotosPage />} />
				{/* A single frame is its own address, so it can be linked and reloaded. */}
				<Route path="/photos/:photoId" element={<PhotosPage />} />
				<Route path="/blog" element={<BlogListPage />} />
				<Route path="/blog/:slug" element={<BlogPostPage />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
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
