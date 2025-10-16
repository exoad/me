import React from 'react';


export default function AttentionButton({
    children,
    onClick,
    className = '',
    style = {},
    ariaLabel = 'Attention Button',
    useChildStyle,
    noUnderline
}: Readonly<{
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
    ariaLabel?: string;
    useChildStyle?: boolean;
    noUnderline?: boolean;
}>) {
    return (
        <button
            aria-label={ariaLabel}
            onClick={onClick}
            className={`relative flex flex-col items-center justify-center text-white py-2 px-2 delay-150 duration-700 group ${noUnderline ? '' : 'border-b-1 border-b-white'} ${className}`}
            style={style}
        >
            {!useChildStyle ? <span className="relative z-10 font-montserrat text-base font-semibold tracking-wide transition-transform duration-300 group-hover:scale-105">
                {children}
            </span> : children}
        </button>
    );
}
