import { useState, useEffect } from 'react';
import { SpinningSquareDivider } from '../components/SpinningSquareDivider';

export function NotFound() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative select-none min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 sm:px-8 md:px-16">
            <div className={`flex flex-col items-center justify-center gap-16 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
                <h1
                    className="text-white text-8xl md:text-9xl font-bold"
                    style={{ fontFamily: 'Playfair Display', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}
                >
                    404
                </h1>
                <div className="w-[12rem] h-px bg-white"></div>
                <p
                    className="text-white text-xl md:text-5xl font-light text-center"
                    style={{ fontFamily: 'Montserrat' }}
                >
                    Page Not Found
                </p>
                <p
                    className="text-gray-400 text-base md:text-lg text-center max-w-md"
                    style={{ fontFamily: 'Montserrat' }}
                >
                    The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>
                <button
                    className="bg-transparent border-none text-white text-sm md:text-base font-light py-3 px-6 cursor-pointer hover:text-gray-300 transition-colors duration-300 group"
                    style={{ fontFamily: 'Montserrat' }}
                    onClick={() => window.history.back()}
                >
                    Go Back
                    <span className="block w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </button>
            </div>
            <SpinningSquareDivider />
        </div>
    );
}
