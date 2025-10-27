import { useState, useRef, useEffect } from 'react';
import { strings, timeline } from "../data/shared.ts";
import Scaffold, { ScaffoldContent } from '../components/Scaffold.tsx';
import PageDescriptor from '../components/PageDescriptor.tsx';
import { Column } from '../components/FlexLayouter.tsx';

export default function AboutPage({ scaffoldProps = {} }) {
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);
    return (
        <Scaffold {...scaffoldProps}>
            <ScaffoldContent useDefaultLayout>
                <Column className="max-w-5xl">
                    <PageDescriptor noBottomPadding title={strings.pages.about.title} description={strings.pages.about.description} />
                </Column>
                <div className="mb-16 mt-8 text-center max-w-lg">
                    <h2 className="text-white text-lg font-semibold mb-4 font-montserrat">{strings.pages.about.currently.title}
                    </h2>
                    <p className="text-white/70 text-base md:text-lg font-light leading-relaxed font-montserrat">{strings.pages.about.currently.content}
                    </p>
                </div>
                <div className="max-w-8xl">
                    <div className="relative">
                        <div className="absolute left-6 top-0 w-px bg-gradient-to-b from-white to-transparent h-full shadow-[0_0_16px_black]" />
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
                                            className={`absolute left-6 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full z-10 transition-all duration-150 ${visibleItems.has(index) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                                            style={{ transitionDelay: visibleItems.has(index) ? `${(index * 80) + 120}ms` : '0ms' }}
                                        ></div>

                                        <div
                                            className={`absolute left-6 top-1/2 h-px bg-gradient-to-r from-white to-white/30 transition-all duration-200 ${visibleItems.has(index) ? 'sm:w-16 w-[12dvw] opacity-100' : 'w-0 opacity-0'}`}
                                            style={{ transitionDelay: visibleItems.has(index) ? `${(index * 80) + 180}ms` : '0ms' }}
                                        ></div>

                                        <div className="w-full max-w-lg ml-[22dvw] sm:ml-26 pr-2">
                                            <div className="text-white/70 text-xs font-montserrat uppercase tracking-wide mb-2">{item.displayDate}</div>
                                            <h3 className="text-white text-xl font-bold font-playfair mb-2">{item.title}</h3>
                                            <p className="text-white/90 text-sm font-montserrat leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </ScaffoldContent>
        </Scaffold>
    );
}