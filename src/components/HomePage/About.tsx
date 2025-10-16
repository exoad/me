import { useRef, useState, useEffect } from 'react';
import { strings } from '../../data/shared.ts';
import profilePic from '../../assets/images/profile.webp';
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
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setkindaVisible(true);
                        onIntersect(true);
                    } else {
                        setkindaVisible(false);
                        onIntersect(false);
                    }
                });
            },
            { threshold: 0.3 }
        );
        if (aboutRef.current) {
            observer.observe(aboutRef.current);
        }
        return () => observer.disconnect();
    }, [onIntersect]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-8 md:px-14 py-3" ref={aboutRef}>
            <div className="flex flex-col justify-center items-center md:gap-6 gap-4 w-full max-w-6xl">
                <img
                    src={profilePic}
                    alt="Profile"
                    className={`w-48 h-48 md:w-64 md:h-64 object-cover hover:scale-105 transition-all delay-200 duration-1000 ${kindaVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}
                    style={{ transitionDelay: kindaVisible ? '100ms' : '0ms' }}
                    draggable={false}
                    loading="eager"
                />
                <div className="flex flex-col items-center max-w-2xl w-full gap-8">
                    <Row gap={4}>
                        {strings.stalk.map((stalk, index) => {
                            return (
                                <div
                                    key={`${stalk.city}-${index}`}
                                    className={`flex text-white px-2 py-1 items-center gap-2 transition-all duration-1000 ${kindaVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}
                                    style={{ transitionDelay: `${index * 200}ms` }}
                                >
                                    <MdLocationPin className="text-md" />
                                    {stalk.city}{stalk.state ? `, ${stalk.state}` : ""}
                                </div>
                            );
                        })}
                    </Row>
                    <p
                        className={`text-white text-base md:text-lg leading-relaxed font-montserrat text-center transition-all duration-1000 ${kindaVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}
                        style={{ transitionDelay: kindaVisible ? '300ms' : '0ms' }}
                    >
                        {strings.pages.home.about.content}
                    </p>
                    <PfpDividerLine kindaVisible={kindaVisible} />
                    <div className="flex flex-col items-center gap-4">
                        <h2
                            className={`text-white text-2xl font-bold font-playfair transition-all duration-1000 ${kindaVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}
                            style={{ transitionDelay: kindaVisible ? '500ms' : '0ms' }}
                        >
                            {strings.pages.home.about.toolkit_title}
                        </h2>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {Object.entries(strings.pages.home.about.technologies).map((item, index) => {
                                const Icon = item[1].icon;
                                return (
                                    <div
                                        key={item[0]}
                                        className={`flex items-center gap-2 transition-all duration-1000 ${kindaVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}
                                        style={{ transitionDelay: `${index * 150}ms`, color: item[1].color }}
                                    >
                                        <Icon className="text-md" />
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
                            style={{ transitionDelay: kindaVisible ? `400ms` : '0ms' }}
                        >
                            {strings.pages.home.about.more}
                        </AttentionButton>
                        <AttentionButton
                            ariaLabel='See More'
                            onClick={() => navigate("/photos")}
                            className={kindaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                            style={{ transitionDelay: kindaVisible ? `550ms` : '0ms' }}
                            useChildStyle
                            noUnderline
                        >
                            <span className="relative z-10 text-base font-montserrat text-white/70 font-light tracking-wide transition-transform duration-300 group-hover:scale-105">
                                {strings.pages.home.about.cool_photos}
                            </span>
                        </AttentionButton>
                    </Column>
                </div>
            </div>
        </div>
    );
}
function PfpDividerLine({ kindaVisible }: Readonly<{ kindaVisible: boolean; }>) {
    return <div
        className={`h-px w-16 md:w-24 bg-white transition-all duration-1000 ${kindaVisible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}
        style={{ transitionDelay: kindaVisible ? '300ms' : '0ms' }} />;
}

