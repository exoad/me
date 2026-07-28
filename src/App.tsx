import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

function AppContent() {
	return (
		<>
		<a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-black focus:outline focus:outline-2 focus:outline-black">
			Skip to main content
		</a>
		<Suspense fallback={<PageLoading />}>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/photos" element={<PhotosPage />} />
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
