import { useRef, useState, useEffect } from 'react';
import { TTechnology } from '../../types.ts';

import profilePic from '../../assets/images/profile.webp';

export default function About({
    title,
    content,
    toolkitTitle,
    technologies,
    onIntersect
}: Readonly<{
    title: string;
    content: string;
    toolkitTitle: string;
    technologies: TTechnology[];
    onIntersect: (isVisible: boolean) => void;
}>) {
    const aboutRef = useRef<HTMLDivElement>(null);
    const [kindaVisible, setkindaVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setkindaVisible(true);
                        onIntersect(true);
                    }
                });
            },
            { threshold: 0.2 }
        );
        if (aboutRef.current) {
            observer.observe(aboutRef.current);
        }
        return () => observer.disconnect();
    }, [onIntersect]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-8 md:px-16 py-8" ref={aboutRef}>
            <div className="flex flex-col md:flex-row items-center md:gap-16 gap-8 w-full max-w-6xl">
                <img
                    src={profilePic}
                    alt="Profile"
                    className={`w-48 h-48 md:w-64 md:h-64 object-cover hover:scale-105 transition-all duration-1000 ${kindaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    style={{ transitionDelay: kindaVisible ? '100ms' : '0ms' }}
                    draggable={false}
                    loading="eager"
                />
                <div
                    className={`w-px h-16 md:h-24 bg-white transition-all duration-1000 ${kindaVisible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}
                    style={{ transitionDelay: kindaVisible ? '300ms' : '0ms' }}
                ></div>
                <div className="flex flex-col md:items-start md:text-left text-center items-center max-w-4xl w-full gap-6">
                    <h1
                        className={`text-white text-4xl md:text-7xl lg:text-7xl font-bold font-playfair transition-all duration-1000 ${kindaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ transitionDelay: kindaVisible ? '100ms' : '0ms' }}
                    >
                        {title}
                    </h1>
                    <p
                        className={`text-white text-base md:text-lg leading-relaxed font-montserrat transition-all duration-1000 ${kindaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ transitionDelay: kindaVisible ? '300ms' : '0ms' }}
                    >
                        {content}
                    </p>
                    <div className="mt-8 flex flex-col gap-4">
                        <h2
                            className={`text-white text-2xl font-bold font-playfair transition-all duration-1000 ${kindaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: kindaVisible ? '500ms' : '0ms' }}
                        >
                            {toolkitTitle}
                        </h2>
                        <div className="flex flex-wrap gap-4 justify-start">
                            {technologies.map((item, index) => (
                                <div
                                    key={item.name}
                                    className={`flex items-center gap-2 transition-all duration-1000 ${kindaVisible ? 'opacity-100' : 'opacity-0'}`}
                                    style={{ transitionDelay: `${index * 350}ms`, color: item.color }}
                                >
                                    <item.icon className="text-xs" />
                                    <span className="text-white text-sm font-montserrat">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
