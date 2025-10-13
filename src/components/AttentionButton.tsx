import React from 'react';


export default function AttentionButton({
    children,
    onClick,
    className = '',
    style = {},
    ariaLabel = 'Attention Button',
}: Readonly<{
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
    ariaLabel?: string;
}>) {
    return (
        <button
            aria-label={ariaLabel}
            onClick={onClick}
            className={`relative flex flex-col items-center justify-center text-white font-montserrat py-3 px-6 rounded-md delay-150 duration-700 group ${className}`}
            style={style}
        >
            <span className="relative z-10 font-playfair text-lg font-semibold tracking-wide transition-transform duration-300 group-hover:scale-105">
                {children}
            </span>
            <span className="absolute left-0 bottom-0 w-full h-px bg-gradient-to-r from-white via-white/60 to-white opacity-70 transition-all duration-500 group-hover:opacity-100" />
        </button>
    );
}
