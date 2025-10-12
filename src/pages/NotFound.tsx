import { useState, useEffect } from 'react';
import SpinningSquareDivider from '../components/SpinningSquareDivider';
import MenuBar from '../components/MenuBar';
import strings from '../config/strings.ts';

export default function NotFound() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);
    return (
        <div className="relative select-none min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 sm:px-8 md:px-16">
            <MenuBar />
            <div className={`flex flex-col items-center justify-center gap-16 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
                <h1
                    className="text-white text-8xl md:text-9xl font-bold font-playfair"
                    style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}
                >
                    {strings.pages.not_found.super}
                </h1>
                <p className="text-white text-xl md:text-5xl font-medium text-center font-montserrat "
                >
                    {strings.pages.not_found.title}
                </p>
                <p className="text-white/50 text-base md:text-lg text-center max-w-md font-montserrat"
                >
                    {strings.pages.not_found.description}
                </p>
                <SpinningSquareDivider />
                <button
                    className="bg-transparent border-none text-white text-sm md:text-base font-light py-3 px-6 cursor-pointer hover:text-gray-300 transition-colors duration-300 group font0-montserrat"
                    onClick={() => window.history.back()}
                >
                    {strings.pages.not_found.go_back}
                    <div className="relative">
                        <span className="block w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                    </div>
                </button>
            </div>
        </div>
    );
}
