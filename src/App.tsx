import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import PhotosPage from './pages/PhotosPage';


export default function App() {
  document.title = 'Jiaming Meng';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<HomePage />} />
        <Route path="/photos" element={<PhotosPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

