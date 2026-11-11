import { Link, useLocation } from 'react-router-dom';
import { strings } from '../data/shared.ts';

// The name already links home, so the nav only needs the one other place.
const navItems = [
    { path: '/photos', label: 'photos' },
];

export default function Header() {
    const location = useLocation();

    return (
        <header className="site-header">
            <Link to="/" className="site-name">{strings.name}</Link>
            <nav className="site-nav" aria-label="Site navigation">
                {navItems.map((item) => {
                    const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
                    return (
                        <Link key={item.path} to={item.path} aria-current={active ? 'page' : undefined}>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
}
