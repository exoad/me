import { useState, useEffect, useRef } from 'react';
import NavLink from './NavLink';
import '../styles/Navigation.css';

interface NavigationProps {
    items: { path: string; label: string; }[];
    onNavigate: (path: string) => void;
}

export default function Navigation({ items, onNavigate }: Readonly<NavigationProps>) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isDropdownOpen) {
                setIsDropdownOpen(false);
            }
        };
        const handleGlobalClick = (e: MouseEvent) => {
            if (isDropdownOpen &&
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('keydown', handleGlobalKeyDown);
        document.addEventListener('click', handleGlobalClick);
        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
            document.removeEventListener('click', handleGlobalClick);
        };
    }, [isDropdownOpen]);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const handleNavClick = (path: string) => {
        onNavigate(path);
        setIsDropdownOpen(false);
    };
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsDropdownOpen(false);
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <nav className="hidden md:flex md:justify-start w-auto">
                {items.map((item) => (
                    <NavLink
                        key={item.path}
                        path={item.path}
                        label={item.label}
                        onClick={onNavigate}
                    />
                ))}
            </nav>
            <div className="md:hidden">
                <button
                    className="flex items-center justify-center py-3 px-4 text-white font-medium bg-transparent hover:bg-black/20 transition-colors rounded-full active:scale-95"
                    onClick={toggleDropdown}
                    onKeyDown={handleKeyDown}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    aria-label="Navigation Menu"
                >
                    <span className="text-lg font-medium">Menu</span>
                    <svg
                        className="w-7 h-7 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                {isDropdownOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-30 bg-black/40 drawer-overlay"
                            onClick={() => setIsDropdownOpen(false)}
                            aria-hidden="true"
                        ></div>
                        <div className="fixed top-0 right-0 bottom-0 z-40 w-4/5 max-w-sm bg-black/70 drawer-menu">
                            <div className="h-16 flex items-center justify-between px-6">
                                <span className="text-xl text-white font-medium">Navigation</span>
                                <button
                                    className="p-2"
                                    onClick={() => setIsDropdownOpen(false)}
                                    aria-label="Close menu"
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="overflow-y-auto h-[calc(100%-4rem)] pt-4">
                                {items.map((item) => (
                                    <button
                                        key={item.path}
                                        className="w-full text-left px-8 py-6 text-white text-lg font-normal hover:bg-white/10 active:bg-white/15 transition-colors duration-150 focus:outline-none focus:bg-white/15"
                                        onClick={() => handleNavClick(item.path)}
                                        onKeyDown={handleKeyDown}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
