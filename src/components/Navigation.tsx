import { useState, useEffect } from 'react';
import { MdMenu, MdOutlineClose } from 'react-icons/md';
import NavLink from './NavLink';
import '../styles/Navigation.css';
import { createPortal } from 'react-dom';
import { strings } from '../data/shared.ts';
import HoverShowLine from './HoverShowLine';
import { Column } from './FlexLayouter.tsx';

export default function Navigation({ items, onNavigate }: Readonly<{
    items: { path: string; label: string; }[];
    onNavigate: (path: string) => void;
}>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsSidebarOpen(false);
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, []);
    const handleNavClick = (path: string) => {
        onNavigate(path);
        setIsSidebarOpen(false);
    };

    return (
        <div className="relative">
            <nav className="hidden sm:flex sm:justify-start w-auto">
                {items.map((item) => (
                    <NavLink
                        key={item.path}
                        path={item.path}
                        label={item.label}
                        onClick={onNavigate}
                    />
                ))}
            </nav>
            <div className="sm:hidden">
                <button
                    className="flex items-center justify-center py-3 text-white font-medium bg-transparent transition-colors active:scale-95"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Open sidebar"
                >
                    <MdMenu size="2rem" />
                </button>
            </div>
            {isSidebarOpen ? (
                <div
                    className="fixed inset-0 z-30 bg-black/40"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                />
            ) : null}
            <div className="sm:hidden sm:pt-20">
                {createPortal(
                    <div className={`fixed inset-0 select-none w-screen h-screen bg-black/70 backdrop-blur-md border-t border-white/20 z-[99999] transform transition-transform ease-in-out duration-400 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    >
                        <div className="h-16 flex items-center justify-between px-6 border-b border-white/20">
                            <span className="text-2xl text-white font-medium">{strings.navigation.mobile_menu.title}</span>
                            <button
                                className="p-2"
                                onClick={() => setIsSidebarOpen(false)}
                                aria-label="Close sidebar"
                            >
                                <MdOutlineClose size="2rem" />
                            </button>
                        </div>
                        <Column gap={4} className="h-[calc(100%-4rem)] overflow-y-auto pt-6">
                            {items.map((item) => (
                                <button
                                    key={item.path}
                                    className="group relative w-full text-left px-8 py-4 text-white text-4xl font-normal font-montserrat transition-colors duration-150"
                                    onClick={() => handleNavClick(item.path)}
                                >
                                    <Column crossAxisAlignment="start" className="transform transition-all duration-200 ease-out
                   group-hover:scale-110 group-hover:opacity-100">
                                        <span
                                            className="inline-block"
                                        >
                                            {item.label}
                                        </span>
                                        <HoverShowLine />
                                    </Column>
                                </button>
                            ))}
                        </Column>

                    </div >,
                    document.body
                )}
            </div>
        </div >
    );
}
