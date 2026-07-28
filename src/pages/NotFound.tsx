import { strings } from '../data/shared.ts';
import SEO from '../components/SEO.tsx';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <main id="main" className="page">
            <SEO
                title="Page Not Found"
                description={strings.pages.not_found.description}
                type='website'
            />
            <Header />
            <h1>{strings.pages.not_found.super}</h1>
            <p>{strings.pages.not_found.title}</p>
            <p className="muted">{strings.pages.not_found.description}</p>
            <p>
                <button type="button" className="btn-link" onClick={() => globalThis.history.back()}>
                    {strings.pages.not_found.go_back}
                </button>
                {" · "}
                <Link to="/">Home</Link>
            </p>
            <Footer />
        </main>
    );
}
