import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ContentFade from "./components/ContentFade";
import ScrollToTop from "./components/ScrollToTop";

const HomePage = lazy(() => import("./pages/HomePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PhotosPage = lazy(() => import("./pages/PhotosPage"));
const BlogListPage = lazy(() => import("./pages/BlogListPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const GuestbookPage = lazy(() => import("./pages/GuestbookPage"));
const GuestbookAdminPage = lazy(() => import("./pages/GuestbookAdminPage"));

function PageLoading() {
	return (
		<div className="min-h-screen bg-bg0 flex items-center justify-center" role="status" aria-live="polite">
			<div className="flex items-center gap-2 text-sm font-sans text-fg4">
				<span className="h-2 w-2 rounded-full bg-yellow animate-pulse" />
				<span>Loading page...</span>
			</div>
		</div>
	);
}

function AppContent() {
	const location = useLocation();
	return (
		<>
		<a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-bg1 focus:px-3 focus:py-2 focus:text-sm focus:text-fg0 focus:outline-none focus:ring-2 focus:ring-yellow">
			Skip to main content
		</a>
		<Suspense fallback={<PageLoading />}>
			<ContentFade >
				<Routes location={location}>
					<Route path="/" element={<HomePage />} />
					<Route path="/photos" element={<PhotosPage />} />
					<Route path="/blog" element={<BlogListPage />} />
					<Route path="/blog/:slug" element={<BlogPostPage />} />
					<Route path="/guestbook" element={<GuestbookPage />} />
					<Route path="/guestbook/admin" element={<GuestbookAdminPage />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</ContentFade>
		<ScrollToTop />
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
