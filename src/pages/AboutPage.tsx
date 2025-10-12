import { useState, useRef, useEffect } from 'react';
import { strings, timeline } from "../data/shared.ts";
import Scaffold from '../components/Scaffold.tsx';

export default function AboutPage() {
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    const itemRefs = useRef<(HTMLDivElement | null)[]>(Array(timeline.length).fill(null));
    useEffect(() => {
        const observers = itemRefs.current.map((ref, index) => {
            if (!ref) return null;
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setVisibleItems(prev => new Set([...prev, index]));
                        }
                    });
                },
                { threshold: 0.3 }
            );
            observer.observe(ref);
            return observer;
        });
        return () => {
            observers.forEach(observer => observer?.disconnect());
        };
    }, []);

    return (
        <Scaffold>
            <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 py-16">
                <div className="max-w-5xl w-full">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-playfair text-center mb-20">
                        {strings.pages.about.title}
                    </h1>
                    <p className="text-white/70 text-lg text-center max-w-2xl mx-auto mb-16 font-montserrat leading-relaxed">
                        {strings.pages.about.description}
                    </p>
                    <div className="relative">
                        <div className="absolute left-6 top-0 w-px bg-gradient-to-b from-white/20 via-white/50 to-white/20 h-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
                        <div className="space-y-20 ml-4">
                            {timeline.map((item, index) => (
                                <div
                                    key={`${item.displayDate}-${item.title}`}
                                    ref={el => { itemRefs.current[index] = el; }}
                                    className={`relative flex items-center transition-all duration-1000 ${visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                    style={{ transitionDelay: visibleItems.has(index) ? `${index * 200}ms` : '0ms' }}
                                >
                                    <div
                                        className={`absolute left-6 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full border-2 border-black z-10 transition-all duration-500 shadow-[0_0_12px_rgba(255,255,255,0.7)] ${visibleItems.has(index) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                                        style={{ transitionDelay: visibleItems.has(index) ? `${(index * 200) + 400}ms` : '0ms' }}
                                    ></div>

                                    <div
                                        className={`absolute left-6 top-1/2 h-[2px] bg-gradient-to-r from-white/80 to-white/20 transition-all duration-700 ${visibleItems.has(index) ? 'w-16 opacity-100' : 'w-0 opacity-0'}`}
                                        style={{ transitionDelay: visibleItems.has(index) ? `${(index * 200) + 500}ms` : '0ms' }}
                                    ></div>
                                    <div className="w-full max-w-md ml-24">
                                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                            <div className="text-white/60 text-sm font-montserrat mb-2">{item.displayDate}</div>
                                            <h3 className="text-white text-xl font-bold font-playfair mb-3">{item.title}</h3>
                                            <p className="text-white/80 text-sm font-montserrat leading-relaxed">{item.description}</p>
                                            {item.technologies && item.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {item.technologies.map(tech => (
                                                        <div
                                                            key={tech.name}
                                                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/30 border border-white/10"
                                                            style={{ color: tech.color }}
                                                        >
                                                            <tech.icon className="text-xs" />
                                                            <span className="text-white text-xs font-montserrat">{tech.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Scaffold>
    );
}