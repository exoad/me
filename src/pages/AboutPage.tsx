import { useState, useRef, useEffect } from 'react';
import { strings, timeline } from "../data/shared.ts";
import SEO from '../components/SEO.tsx';
import { Column } from '../components/FlexLayouter.tsx';
import { motionSafeScrollBehavior } from '../utils/motion.ts';

export default function AboutPage() {
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    const itemRefs = useRef<(HTMLDivElement | null)[]>(new Array(timeline.length).fill(null));
    useEffect(() => {
        const observers = itemRefs.current.map((ref, index) => {
            if (!ref) return null;
            const observer = new IntersectionObserver(
                (entries) => {
                    for (const entry of entries) {
                        if (entry.isIntersecting) {
                            setVisibleItems(prev => new Set([...prev, index]));
                        }
                    }
                },
                { threshold: 0.3 }
            );
            observer.observe(ref);
            return observer;
        });
        return () => {
            for (const observer of observers) {
                observer?.disconnect();
            }
        };
    }, []);
    useEffect(() => {
        if (window.scrollY > 0) {
            window.scrollTo({ top: 0, behavior: motionSafeScrollBehavior() });
        }
    }, []);
    return (
        <>
            <SEO
                title="About"
                description={strings.pages.about.description.replace('\n', ' ')}
                url="https://exoad.net/about"
            />
            <div className="min-h-screen bg-bg0">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="mb-12">
                        <h2 className="text-[10px] uppercase tracking-[0.2em] text-fg4 mb-4 font-sans">About Me</h2>
                        <h1 className="text-4xl md:text-6xl font-bold text-fg0 mb-4">
                            {strings.pages.about.title}
                        </h1>
                        <p className="text-fg3 text-base md:text-lg font-sans leading-relaxed">
                            {strings.pages.about.description}
                        </p>
                    </div>
                    <div className="border-b border-bg2 mb-12" />
                    <div className="mb-16 mt-8 text-center max-w-lg">
                        <h2 className="text-fg0 text-2xl font-semibold mb-4 font-sans">{strings.pages.about.currently.title}</h2>
                        <p className="text-fg3 text-base md:text-lg font-light leading-relaxed font-sans">{strings.pages.about.currently.content}</p>
                    </div>
                    <div className="relative">
                        <div className="absolute left-6 top-0 w-px bg-bg2 h-full" />
                        <div>
                            {timeline.map((item, index) => {
                                const year = new Date(item.isoDate).getFullYear();
                                return (
                                    <div
                                        key={`${item.displayDate}-${item.title}`}
                                        ref={el => { itemRefs.current[index] = el; }}
                                        className={`relative flex flex-row items-center transition-all duration-200 ${visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${year - (index < timeline.length - 1 ? new Date(timeline[index + 1].isoDate).getFullYear() : year) > 1 ? 'mb-32 md:mb-40' : 'mb-16 md:mb-20'}`}
                                        style={{ transitionDelay: visibleItems.has(index) ? `${index * 80}ms` : '0ms' }}
                                    >
                                        <div
                                            className={`absolute left-6 transform -translate-x-1/2 w-3 h-3 bg-gb-orange transition-all duration-150 ${visibleItems.has(index) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                                            style={{ transitionDelay: visibleItems.has(index) ? `${(index * 80) + 120}ms` : '0ms' }}
                                        ></div>
                                        <div
                                            className={`absolute left-9 top-1/2 h-px bg-bg2 transition-all duration-200 ${visibleItems.has(index) ? 'sm:w-12 w-[8dvw] opacity-100' : 'w-0 opacity-0'}`}
                                            style={{ transitionDelay: visibleItems.has(index) ? `${(index * 80) + 180}ms` : '0ms' }}
                                        ></div>
                                        <div className="w-full max-w-lg ml-[22dvw] sm:ml-26 pr-2">
                                            <div className="text-fg4 text-xs font-sans uppercase tracking-wide mb-2">{item.displayDate}</div>
                                            <h3 className="text-fg0 text-xl font-bold font-sans mb-2">{item.title}</h3>
                                            <p className="text-fg2 text-sm font-sans leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
