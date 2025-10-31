import { useRef, useState, useEffect } from 'react';
import { strings } from '../../data/shared.ts';
import profilePic from '../../assets/images/profile_image.webp';
import AttentionButton from '../AttentionButton';
import { Column, Row } from '../FlexLayouter.tsx';
import { MdLocationPin } from "react-icons/md";

export default function About({
    navigate,
    onIntersect
}: Readonly<{
    navigate: (path: string) => void;
    onIntersect: (isVisible: boolean) => void;
}>) {
    const aboutRef = useRef<HTMLDivElement>(null);
    const [kindaVisible, setkindaVisible] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    setScrollY(entry.intersectionRatio);
                    if (entry.isIntersecting) {
                        setkindaVisible(true);
                        onIntersect(true);
                    } else {
                        onIntersect(false);
                        setkindaVisible(false);
                    }
                }
            },
            { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
        );
        if (aboutRef.current) {
            observer.observe(aboutRef.current);
        }
        return () => observer.disconnect();
    }, [onIntersect]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-12 sm:px-8 md:px-14 py-3" ref={aboutRef}>
            <Column mainAxisAlignment='center' crossAxisAlignment='center' className='md:gap-6 gap-4 w-full max-w-6xl' >
                <Column
                    gap={0}
                    className="relative mb-8"
                >
                    <img
                        src={profilePic}
                        alt="Profile Glow"
                        className="absolute inset-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 object-cover scale-415 blur-lg"
                        style={{
                            transitionDelay: kindaVisible ? '100ms' : '0ms',
                            opacity: Math.min(scrollY, 0.3),
                            transition: 'opacity 0.5s ease-out',
                        }}
                        draggable={false}
                        loading="lazy"
                    />
                    <img
                        src={profilePic}
                        alt="Profile"
                        className={`relative w-48 h-48 md:w-64 md:h-64 object-cover z-10 hover:scale-105 transition-all delay-70 duration-350 ${kindaVisible
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 translate-y-6 scale-95'
                            }`}
                        style={{ transitionDelay: kindaVisible ? '100ms' : '0ms' }}
                        draggable={false}
                        loading="lazy"
                    />
                </Column>


                <div className="flex flex-col items-center max-w-2xl w-full gap-8">
                    <Row gap={2} mainAxisAlignment="center" className={`text-white px-2 text-center gap-1 transition-all duration-500 delay-200 ${kindaVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}>
                        <MdLocationPin className="text-md" />
                        {`${strings.stalk.city}, ${strings.stalk.state}`}
                    </Row>
                    <p
                        className={`text-white text-base md:text-lg leading-relaxed font-montserrat text-center transition-all duration-500 ${kindaVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}
                        style={{ transitionDelay: kindaVisible ? '200ms' : '0ms' }}
                    >
                        {strings.pages.home.about.content}
                    </p>
                    <PfpDividerLine kindaVisible={kindaVisible} />
                    <div className="flex flex-col items-center gap-4">
                        <h2
                            className={`text-white text-2xl font-bold font-playfair transition-all duration-500 ${kindaVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}
                            style={{ transitionDelay: kindaVisible ? '250ms' : '0ms' }}
                        >
                            {strings.pages.home.about.toolkit_title}
                        </h2>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {Object.entries(strings.pages.home.about.technologies).map((item, index) => {
                                const Icon = item[1].icon;
                                return (
                                    <div
                                        key={item[0]}
                                        className={`flex items-center gap-2 transition-all duration-500 ${kindaVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}
                                        style={{ transitionDelay: `${index * 120}ms`, color: item[1].color }}
                                    >
                                        <Icon className="text-sm md:text-base" />
                                        <span className="text-white text-sm font-montserrat">{item[1].name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/*cool divider line effect, but the border really belongs to the first button lol */}
                    <Column gap={0}>
                        <AttentionButton
                            ariaLabel="See More"
                            onClick={() => navigate('/about')}
                            className={kindaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                            style={{ transitionDelay: kindaVisible ? `200ms` : '0ms' }}
                        >
                            {strings.pages.home.about.more}
                        </AttentionButton>
                        <AttentionButton
                            ariaLabel='See More'
                            onClick={() => navigate("/photos")}
                            className={kindaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                            style={{ transitionDelay: kindaVisible ? `350ms` : '0ms' }}
                            useChildStyle
                            noUnderline
                        >
                            <span className="relative z-10 text-base font-montserrat text-white/70 font-light tracking-wide transition-transform duration-300 group-hover:scale-105">
                                {strings.pages.home.about.cool_photos}
                            </span>
                        </AttentionButton>
                    </Column>
                </div>
            </Column>
        </div>
    );
}
function PfpDividerLine({ kindaVisible }: Readonly<{ kindaVisible: boolean; }>) {
    return <div
        className={`h-px w-16 md:w-24 bg-white transition-all duration-500 ${kindaVisible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}
        style={{ transitionDelay: kindaVisible ? '300ms' : '0ms' }} />;
}

