import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/blog', label: 'Blog' },
  { path: '/photos', label: 'Photos' },
  { path: '/guestbook', label: 'Guestbook' },
];

export default function SubpageNav({ backTo = '/', backLabel = 'Home' }: { backTo?: string; backLabel?: string }) {
  const location = useLocation();

  return (
    <nav className="mb-12 flex flex-col gap-4 border-b border-bg2 pb-5 font-sans sm:flex-row sm:items-center sm:justify-between" aria-label="Site navigation">
      <Link to={backTo} className="text-sm text-fg4 transition-colors duration-300 hover:text-yellow">
        ← {backLabel}
      </Link>
      <div className="flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.16em] text-fg4">
        {navItems.map((item) => {
          const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={active ? 'page' : undefined}
              className={active ? 'text-yellow' : 'transition-colors duration-300 hover:text-fg0'}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
