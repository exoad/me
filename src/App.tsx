import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ContentFade from "./components/ContentFade";

const HomePage = lazy(() => import("./pages/HomePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PhotosPage = lazy(() => import("./pages/PhotosPage"));
const BlogListPage = lazy(() => import("./pages/BlogListPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const GuestbookPage = lazy(() => import("./pages/GuestbookPage"));
const GuestbookAdminPage = lazy(() => import("./pages/GuestbookAdminPage"));

function AppContent() {
	const location = useLocation();
	return (
		<Suspense fallback={null}>
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
	);
}

export default function App() {
	return (
		<Router>
			<AppContent />
		</Router>
	);
}
