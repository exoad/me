import { useRef, useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import WarpTunnelBg from '../WarpTunnelBg';
import "../../styles/HomePage.css";
import "../../styles/Animations.css";
import upwardsHandSignPic from '../../assets/images/upwards.webp';
import { strings } from '../../data/shared.ts';
import { Column } from '../FlexLayouter.tsx';

const BASE_DELAY = 200;
const STEP_DELAY = 300;

export default function Hero({
    name,
    tagline,
    subtitles,
    scrollText,
    githubLink,
    linkedinLink,
    onIntersect
}: Readonly<{
    name: string;
    tagline: string;
    subtitles: string[];
    scrollText: string;
    githubLink: string;
    linkedinLink: string;
    onIntersect: (isVisible: boolean) => void;
}>) {
    const heroRef = useRef<HTMLDivElement>(null);
    const [heroVisible, setHeroVisible] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const _scrollerTotal = [...subtitles, subtitles[0]];
    useEffect(() => {
        setHeroVisible(true);
        onIntersect(true);
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const isVisible = entry.isIntersecting;
                    setHeroVisible(isVisible);
                    onIntersect(isVisible);
                });
            },
            { threshold: 0.2 }
        );
        if (heroRef.current) {
            observer.observe(heroRef.current);
        }
        const lcpContainer = document.getElementById('lcp-image-container');
        if (lcpContainer) {
            setTimeout(() => {
                lcpContainer.style.opacity = '0';
                lcpContainer.style.transition = 'opacity 300ms ease';
                setTimeout(() => {
                    lcpContainer?.remove();
                }, 300);
            }, 500);
        }
        return () => observer.disconnect();
    }, [onIntersect]);
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4 sm:px-8 md:px-16 relative" ref={heroRef}>
            <WarpTunnelBg scrollY={scrollY} />
            <div className="flex flex-col items-center justify-center gap-6 z-10 max-w-3xl mx-auto">
                <div className="relative mb-1">
                    <div className={`relative origin-center ${heroVisible ? 'animate-logo-reveal' : ''}`}>
                        <img
                            src={upwardsHandSignPic}
                            alt="Logo"
                            className="w-26 h-26 sm:w-36 sm:h-36 md:w-38 md:h-38 object-contain"
                            draggable={false}
                            fetchPriority="high"
                            loading="eager"
                            id="logo-image"
                            decoding="sync"
                        />
                        <div className="logo-overlay-fade-out absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />
                    </div>
                </div>
                <Column gap={6} className="ease-in-out">
                    <h1
                        className={`relative inline-block font-bold text-center font-playfair text-5xl md:text-7xl ${heroVisible ? 'animate-fade-in-up' : 'opacity-0 scale-90'}`}
                        style={{ animationDelay: heroVisible ? `${BASE_DELAY + STEP_DELAY * 0}ms` : '0ms' }}
                    >
                        <span className="relative text-white">{name}</span>
                    </h1>
                    <p
                        className={`text-white px-6 sm:px-0 text-base md:text-lg text-center mx-auto font-montserrat ${heroVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                        style={{ animationDelay: heroVisible ? `${BASE_DELAY + STEP_DELAY * 1}ms` : '0ms' }}
                    >
                        {tagline}
                    </p>
                </Column>
                <div
                    className={`w-20 h-px bg-white/70 my-1 ${heroVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{ animationDelay: heroVisible ? `${BASE_DELAY + STEP_DELAY * 2}ms` : '0ms' }}
                />
                <div
                    className={`overflow-hidden h-[2rem] ${heroVisible ? 'animate-fade-in-up' : 'opacity-0'
                        }`}
                    style={{ animationDelay: heroVisible ? `${BASE_DELAY + STEP_DELAY * 3}ms` : '0ms' }}
                >
                    <div className="subtitle-roller-anim flex flex-col font-montserrat">
                        {_scrollerTotal.map((item, index) => (
                            <div
                                key={`${item}-${index}`}
                                className="text-white text-base md:text-lg text-center h-[2rem] leading-[2rem]"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
                <style>{`
          @keyframes subtitlesRollAnim {
            ${(() => {
                        const stepPercentage = 80 / subtitles.length;
                        let keyframes = '0% { transform: translateY(0); }\n';
                        for (let i = 0; i < subtitles.length; i++) {
                            const pauseStart = 10 + (i * stepPercentage);
                            keyframes += `${pauseStart}% { transform: translateY(-${i * 2}rem); }\n`;
                            if (i < subtitles.length - 1) {
                                keyframes += `${pauseStart + (stepPercentage * 0.8)}% { transform: translateY(-${(i + 1) * 2}rem); }\n`;
                            }
                        }
                        keyframes += `100% { transform: translateY(-${subtitles.length * 2}rem); }`;
                        return keyframes;
                    })()}
          }
        `}</style>
                <div
                    className={`flex gap-6 mt-3 ${heroVisible ? 'animate-scale-in' : 'opacity-0'
                        }`}
                    style={{ animationDelay: heroVisible ? `${BASE_DELAY + STEP_DELAY * 4}ms` : '0ms' }}
                >
                    <a
                        href={githubLink}
                        aria-label={strings.links.github_aria}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-white transition-all duration-300 inline-block hover:scale-110">
                        <SiGithub size={24} />
                    </a>
                    <a
                        href={linkedinLink}
                        aria-label={strings.links.linkedin_aria}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-white transition-all duration-300 inline-block hover:scale-110">
                        <SiLinkedin size={24} />
                    </a>
                </div>
                <div
                    className={`landing-more-below-pulser absolute bottom-8 flex flex-col items-center gap-1 ${heroVisible ? 'animate-fade-in-up' : 'opacity-0'
                        }`}
                    style={{ animationDelay: heroVisible ? `${BASE_DELAY + STEP_DELAY * 5}ms` : '0ms' }}
                >
                    <p className="text-white/60 text-xs font-montserrat">
                        {scrollText}
                    </p>
                    <div className="h-6 w-5 flex justify-center">
                        <FiChevronDown className="absolute text-white/70" size={16} />
                    </div>
                </div>
            </div>
        </div>
    );
}
