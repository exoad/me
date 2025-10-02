import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { NotFound } from './pages/NotFound';

export function App() {
  document.title = 'Jiaming Meng';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

