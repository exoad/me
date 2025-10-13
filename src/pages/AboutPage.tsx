import { useState, useRef, useEffect } from 'react';
import { strings, timeline } from "../data/shared.ts";
import Scaffold from '../components/Scaffold.tsx';
import PageDescriptor from '../components/PageDescriptor.tsx';

export default function AboutPage({ scaffoldProps = {} }) {
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
        <Scaffold {...scaffoldProps}>
            <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 py-16">
                <div className="max-w-5xl flex flex-col items-center">
                    <PageDescriptor noBottomPadding title={strings.pages.about.title} description={strings.pages.about.description} />
                </div>
                <div className="mb-16 mt-8 text-center max-w-lg">
                    <h2 className="text-white text-lg font-semibold mb-4 font-montserrat">{strings.pages.about.currently.title}
                    </h2>
                    <p className="text-white/70 text-base md:text-lg font-light leading-relaxed font-montserrat">{strings.pages.about.currently.content}
                    </p>
                </div>

                <div className="max-w-8xl">
                    <div className="relative">
                        <div className="absolute left-6 top-0 w-px bg-gradient-to-b from-white to-transparent h-full shadow-[0_0_16px_rgba(255,255,255,0.8)]"></div>
                        <div>
                            {timeline.map((item, index) => {
                                const year = new Date(item.isoDate).getFullYear();
                                return (
                                    <div
                                        key={`${item.displayDate}-${item.title}`}
                                        ref={el => { itemRefs.current[index] = el; }}
                                        className={`relative flex items-center transition-all duration-200 ${visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${year - (index < timeline.length - 1 ? new Date(timeline[index + 1].isoDate).getFullYear() : year) > 1 ? 'mb-32 md:mb-40' : 'mb-16 md:mb-20'}`}
                                        style={{ transitionDelay: visibleItems.has(index) ? `${index * 80}ms` : '0ms' }}
                                    >
                                        <div
                                            className={`absolute left-6 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full z-10 transition-all duration-150 shadow-[0_0_16px_rgba(255,255,255,0.9)] ${visibleItems.has(index) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                                            style={{ transitionDelay: visibleItems.has(index) ? `${(index * 80) + 120}ms` : '0ms' }}
                                        ></div>

                                        <div
                                            className={`absolute left-6 top-1/2 h-px bg-gradient-to-r from-white to-white/30 transition-all duration-200 ${visibleItems.has(index) ? 'w-20 opacity-100' : 'w-0 opacity-0'}`}
                                            style={{ transitionDelay: visibleItems.has(index) ? `${(index * 80) + 180}ms` : '0ms' }}
                                        ></div>


                                        <div className="w-full max-w-lg ml-28">
                                            <div className="backdrop-blur-md rounded-md p-5">
                                                <div className="text-white/70 text-xs font-montserrat uppercase tracking-wide mb-2">{item.displayDate}</div>
                                                <h3 className="text-white text-xl font-bold font-playfair mb-2">{item.title}</h3>
                                                <p className="text-white/90 text-sm font-montserrat leading-relaxed">{item.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Scaffold>
    );
}