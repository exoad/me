import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';
import PhotosPage from './pages/PhotosPage';
import MenuBar from './components/MenuBar';
import Footer from './components/Footer';
import './styles/Animations.css';
import './styles/AppLayout.css';
import UnderConstruction from './pages/UnderConstructionPage';

interface WithPageTransitionProps {
  [key: string]: unknown;
}
type PageTransitionSpeed = 'default' | 'slow' | 'fast';

const withPageTransition = (
  Component: React.ComponentType<WithPageTransitionProps>,
  speed: PageTransitionSpeed = 'default'
) => {
  return (props: WithPageTransitionProps) => {
    return (
      <div className={`page-transition page-transition-enter ${speed}`}>
        <Component
          {...props}
          scaffoldProps={{
            skipMenuBar: true,
            skipFooter: true,
          }}
        />
      </div>
    );
  };
};

function AnimatedRoutes() {
  const TransitionedHomePage = withPageTransition(HomePage, 'default');
  const TransitionedAboutPage = withPageTransition(AboutPage, 'slow');
  const TransitionedContactPage = withPageTransition(ContactPage, 'default');
  const TransitionedPhotosPage = withPageTransition(PhotosPage, 'slow');
  const TransitionedNotFound = withPageTransition(NotFound, 'fast');
  const TransitionedUnderConstruction = withPageTransition(UnderConstruction, 'fast');
  return (
    <Routes>
      <Route path="/" element={<TransitionedHomePage />} />
      <Route path="/about" element={<TransitionedAboutPage />} />
      <Route path="/projects" element={<TransitionedHomePage />} />
      <Route path="/photos" element={<TransitionedPhotosPage />} />
      <Route path="/contacts" element={<TransitionedContactPage />} />
      <Route path="/under-construction" element={<TransitionedUnderConstruction />} />
      <Route path="*" element={<TransitionedNotFound />} />
    </Routes>
  );
}

export default function App() {
  document.title = 'Jiaming';
  return (
    <Router>
      <div className="app-container relative select-none">
        <MenuBar />
        <main className="content-container">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

