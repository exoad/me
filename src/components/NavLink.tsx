import { useLocation } from 'react-router-dom';
import HoverShowLine from './HoverShowLine';

interface NavLinkProps {
    path: string;
    label: string;
    onClick: (path: string) => void;
}

export default function NavLink({ path, label, onClick }: Readonly<NavLinkProps>) {
    const location = useLocation();
    const active = (path === '/' && location.pathname === '/') || (path !== '/' && location.pathname.startsWith(path));
    return (
        <button
            onClick={() => onClick(path)}
            aria-current={active ? 'page' : undefined}
            className={`bg-transparent border-none text-gb-fg1 text-sm md:text-base font-montserrat py-2 px-3 md:px-4 cursor-pointer transition-colors duration-300 group ${active ? 'text-gb-fg0 font-medium' : 'text-gb-fg3 font-light'}`}
        >
            {label}
            <HoverShowLine />
        </button>
    );
}
