import { useState, useRef, useEffect } from 'react';
import strings from "../config/strings.ts";
import { FiChevronDown } from 'react-icons/fi';
import SpinningSquareDivider from '../components/SpinningSquareDivider';
import StarryBackground from '../components/StarryBackground';
import { hexToRgba } from '../utils/css.ts';
import theme from '../config/theme.json';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import MenuBar from '../components/MenuBar';
import HoverShowLine from '../components/HoverShowLine.tsx';
import "../styles/HomePage.css";
import Footer from '../components/Footer.tsx';
export default function HomePage() {
    const heroRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const projectsRef = useRef<HTMLDivElement>(null);
    const [heroVisible, setHeroVisible] = useState(false);
    const [kindaVisible, setkindaVisible] = useState(false);
    const [projectsVisible, setProjectsVisible] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.target === heroRef.current) {
                        setHeroVisible(entry.isIntersecting);
                    } else if (entry.target === aboutRef.current) {
                        setkindaVisible(prev => prev || entry.isIntersecting);
                    } else if (entry.target === projectsRef.current) {
                        setProjectsVisible(prev => prev || entry.isIntersecting);
                    }
                });
            },
            { threshold: 0.2 }
        );
        if (heroRef.current) {
            observer.observe(heroRef.current);
        }
        if (aboutRef.current) {
            observer.observe(aboutRef.current);
        }
        if (projectsRef.current) {
            observer.observe(projectsRef.current);
        }
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative select-none">
            <MenuBar />
            <div className={`min-h-screen flex flex-col items-center justify-center bg-black px-4 sm:px-8 md:px-16 relative`} ref={heroRef}>
                <StarryBackground scrollY={scrollY} />
                <div className="flex flex-col items-center justify-center gap-6 z-10 max-w-3xl mx-auto">
                    <div className="relative mb-1">
                        <div className={`relative origin-center ${heroVisible ? 'animate-logo-reveal' : ''}`}>
                            <img
                                src="/upwards.png"
                                alt="Logo"
                                className="w-42 h-42 md:w-36 md:h-36 object-contain"
                                draggable={false}
                            />
                            <div className="logo-overlay-fade-out absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none"
                            />
                        </div>
                    </div>
                    <h1 className={`text-white text-5xl md:text-7xl font-bold font-playfair transition-all duration-1000 ${heroVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} tracking-wide`}>
                        {strings.name}
                    </h1>

                    <p
                        className={`text-white/90 text-base md:text-lg text-center max-w-lg mx-auto font-montserrat transition-all duration-1000 delay-200 ${heroVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    >
                        {strings.pages.home.tagline}
                    </p>
                    <div className="w-20 h-px bg-white/70 my-1" />
                    <div className="overflow-hidden h-[2rem]">
                        <div className="subtitle-roller-anim flex flex-col font-montserrat">
                            {[...strings.pages.home.subtitles, strings.pages.home.subtitles[0]].map((item, index) => (
                                <div
                                    key={`${item}-${index}`}
                                    className="text-white text-xl text-center h-[2rem] leading-[2rem]"
                                    style={{ color: index % 2 == 0 ? "#fff" : theme.brand }}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <style>{`
            @keyframes subtitlesRollAnim {
              ${(() => {
                            const stepPercentage = 80 / strings.pages.home.subtitles.length;
                            let keyframes = '0% { transform: translateY(0); }\n';
                            for (let i = 0; i < strings.pages.home.subtitles.length; i++) {
                                const pauseStart = 10 + (i * stepPercentage);
                                keyframes += `${pauseStart}% { transform: translateY(-${i * 2}rem); }\n`;
                                if (i < strings.pages.home.subtitles.length - 1) {
                                    keyframes += `${pauseStart + (stepPercentage * 0.8)}% { transform: translateY(-${(i + 1) * 2}rem); }\n`;
                                }
                            }
                            keyframes += `100% { transform: translateY(-${strings.pages.home.subtitles.length * 2}rem); }`;
                            return keyframes;
                        })()}
            }
          `}</style>

                    <div className="flex gap-5 mt-3">
                        <a href={strings.links.github} target="_blank" rel="noopener noreferrer" className="text-white hover:text-white transition-all duration-300 inline-block hover:scale-110">
                            <SiGithub size={24} />
                        </a>
                        <a href={strings.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-white transition-all duration-300 inline-block hover:scale-110">
                            <SiLinkedin size={24} />
                        </a>
                    </div>

                    <div className="landing-more-below-pulser absolute bottom-8 flex flex-col items-center gap-1">
                        <p className="text-white/60 text-xs font-montserrat">
                            {strings.pages.home.scroll_text}
                        </p>
                        <div className="h-6 w-5 flex justify-center">
                            <FiChevronDown className="absolute text-white/60" size={16} />
                        </div>
                    </div>
                </div>
            </div>
            <SpinningSquareDivider />
            <div className={`min-h-screen flex items-center justify-center bg-black px-4 sm:px-8 md:px-16 py-8 `} ref={aboutRef}>
                <div className=" flex flex-col md:flex-row items-center md:gap-16 gap-8 w-full max-w-6xl">
                    <img
                        src="/profile.jpg"
                        alt="Jiaming Profile"
                        className="w-48 h-48 md:w-64 md:h-64 object-cover hover:scale-105 transition-transform duration-300"
                        draggable={false}
                    />
                    <div className="w-px h-16 md:h-24 bg-white"></div>
                    <div className="flex flex-col md:items-start md:text-left text-center items-center max-w-4xl w-full gap-6">
                        <h1 className="text-white text-4xl md:text-7xl lg:text-7xl font-bold font-playfair">
                            {strings.pages.home.about.title}
                        </h1>
                        <p className={`text-white text-base md:text-lg leading-relaxed font-montserrat `}>
                            {strings.pages.home.about.content}
                        </p>
                        <div className="mt-8 flex flex-col gap-4">
                            <h2 className="text-white text-2xl font-bold font-playfair">{strings.pages.home.about.toolkit_title}</h2>
                            <div className="flex flex-wrap gap-4 justify-start">
                                {strings.pages.home.about.technologies.map((item, index) =>
                                    <div key={item.name} className={`flex items-center gap-2 transition-all duration-1000 ${kindaVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${index * 250}ms` }}>
                                        <item.icon className="text-white text-xs" />
                                        <span className="text-white text-sm font-montserrat">{item.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SpinningSquareDivider reverse={true} />
            <div className={`min-h-screen flex items-center justify-center bg-black px-4 sm:px-8 md:px-16 py-8`} ref={projectsRef}>
                <div className="flex flex-col items-center justify-center gap-12 w-full max-w-6xl">
                    <h1
                        className={`text-white text-3xl md:text-5xl lg:text-7xl font-bold font-playfair transition-all duration-1000 ${projectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ transitionDelay: projectsVisible ? '100ms' : '0ms' }}
                    >
                        {strings.pages.home.projects_title}
                    </h1>
                    <div
                        className={`w-[8rem] h-px bg-white transition-all duration-1000 ${projectsVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
                        style={{ transitionDelay: projectsVisible ? '200ms' : '0ms' }}
                    ></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
                        {strings.pages.home.projects.map((project, index) =>
                            <div
                                key={project.title}
                                className={`w-80 bg-transparent transition-all duration-1000 ease-out p-8 grid grid-rows-[auto_1fr_auto] min-h-[22rem] ${projectsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                                style={{ transitionDelay: projectsVisible ? `${300 + (index * 200)}ms` : '0ms' }}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    {project.logo && (
                                        <img
                                            src={project.logo}
                                            alt={`${project.title} logo`}
                                            className="w-12 h-12 object-contain"
                                        />
                                    )}
                                    <h2
                                        className="text-white text-[2rem] font-bold text-center font-playfair"
                                        style={{ textShadow: `2px 2px ${hexToRgba(project.glow_color, 0.7)}` }}
                                    >
                                        {project.title}
                                    </h2>
                                    <p className="mt-1 text-white/90 text-sm text-center font-montserrat">{project.description}</p>
                                </div>
                                <div className="flex flex-col items-center gap-3 row-start-3 mt-4">
                                    <p className="text-white/80 text-xs text-center font-montserrat">{project.technologies.join(', ')} </p>
                                    <span className="block w-12 h-px bg-white/60" />
                                    <button
                                        className="bg-transparent border-none text-white text-sm font-light font-montserrat py-2 px-6 cursor-pointer duration-300 group"
                                        onClick={() => window.open(project.link, '_blank')}
                                    >
                                        {strings.pages.home.view_project_button}
                                        <HoverShowLine />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="h-8" />
                    <button
                        aria-label="Explore all projects"
                        onClick={() => window.location.href = '/projects'}
                        className={`relative flex flex-col items-center justify-center text-white font-montserrat px-6 py-3 transition-all duration-1000 ${projectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ transitionDelay: projectsVisible ? `${300 + (strings.pages.home.projects.length * 200) + 300}ms` : '0ms' }}
                    >
                        <span className="relative z-10">
                            {strings.pages.home.view_all_projects_button}
                        </span>
                        <span className="block w-full h-px bg-white" />
                    </button>
                </div>
            </div>
            <SpinningSquareDivider includeLine={false} />
            <Footer />
        </div >

    );
}
