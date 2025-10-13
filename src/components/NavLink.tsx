import { useLocation } from 'react-router-dom';
import HoverShowLine from './HoverShowLine';

interface NavLinkProps {
    path: string;
    label: string;
    onClick: (path: string) => void;
}

export default function NavLink({ path, label, onClick }: Readonly<NavLinkProps>) {
    const location = useLocation();
    return (
        <button
            onClick={() => onClick(path)}
            className={`bg-transparent border-none text-white text-sm md:text-base font-montserrat py-2 px-3 md:px-4 cursor-pointer transition-colors duration-300 group ${(path === '/' && location.pathname === '/') || (path !== '/' && location.pathname.startsWith(path)) ? 'text-white font-medium' : 'text-white/70 font-light'}`}
        >
            {label}
            <HoverShowLine />
        </button>
    );
}
