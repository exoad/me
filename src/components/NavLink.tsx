import { useLocation } from 'react-router-dom';
import HoverShowLine from './HoverShowLine';

interface NavLinkProps {
    path: string;
    label: string;
    onClick: (path: string) => void;
}

export default function NavLink({ path, label, onClick }: Readonly<NavLinkProps>) {
    const location = useLocation();
    const isActive = () => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <button
            onClick={() => onClick(path)}
            className={`bg-transparent border-none text-white text-sm md:text-base font-light font-montserrat py-2 px-3 md:px-4 cursor-pointer transition-colors duration-300 group ${isActive() ? 'text-white' : 'text-white/80'}`}
        >
            {label}
            <HoverShowLine />
        </button>
    );
}
