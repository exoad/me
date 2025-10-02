import { useState, useRef, useEffect } from 'react';
import strings from "../data/strings.json";
import { SiC, SiCplusplus, SiDart, SiFlutter, SiKotlin, SiOpenjdk, SiMysql, SiAndroid, SiLlvm, SiPython } from 'react-icons/si';
import { SpinningSquareDivider } from '../components/SpinningSquareDivider';

export function HomePage() {
    const [nameIndex, setNameIndex] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const projectsRef = useRef<HTMLDivElement>(null);
    const [heroVisible, setHeroVisible] = useState(false);
    const [aboutVisible, setAboutVisible] = useState(false);
    const [projectsVisible, setProjectsVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.target === heroRef.current) {
                        setHeroVisible(entry.isIntersecting);
                    } else if (entry.target === aboutRef.current) {
                        setAboutVisible(prev => prev || entry.isIntersecting);
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

    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return (
        <div className="relative select-none">
            <header className="w-full fixed top-0 z-50 backdrop-blur-xs bg-black/46">
                <div className="flex justify-between items-center" style={{ padding: '0.5rem 4rem' }}>
                    <button
                        className="text-white text-lg md:text-xl font-light cursor-pointer hover:scale-105 transition-transform duration-300 bg-transparent border-none"
                        style={{ fontFamily: 'Playfair Display' }}
                        onClick={() => setNameIndex((nameIndex + 1) % strings.header.names_funny.length)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                setNameIndex((nameIndex + 1) % strings.header.names_funny.length);
                            }
                        }}
                    >
                        {strings.header.names_funny[nameIndex]}
                    </button>
                    <nav className="flex gap-6 md:gap-12">
                        <button className="bg-transparent border-none text-white text-sm md:text-base font-light py-2 px-3 md:px-6 cursor-pointer hover:text-gray-300 transition-colors duration-300 group" style={{ fontFamily: 'Montserrat' }}>
                            HOME
                            <span className="block w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                        </button>
                        <button className="bg-transparent border-none text-white text-sm md:text-base font-light py-2 px-3 md:px-6 cursor-pointer hover:text-gray-300 transition-colors duration-300 group" style={{ fontFamily: 'Montserrat' }}>
                            PROJECTS
                            <span className="block w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                        </button>
                        <button className="bg-transparent border-none text-white text-sm md:text-base font-light py-2 px-3 md:px-6 cursor-pointer hover:text-gray-300 transition-colors duration-300 group" style={{ fontFamily: 'Montserrat' }}>
                            SOCIALS
                            <span className="block w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                        </button>
                    </nav>
                </div>
            </header>
            <div className={`min-h-screen flex flex-col items-center justify-center bg-black px-4 sm:px-8 md:px-16 transition-opacity duration-1500 ${heroVisible ? 'opacity-100' : 'opacity-0'}`} ref={heroRef}>
                <div className="flex flex-col items-center justify-center gap-12">
                    <h1
                        className={`text-white text-6xl font-bold transition-all duration-1000 ${heroVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                        style={{ fontFamily: 'Playfair Display' }}
                    >
                        Jiaming Meng
                    </h1>
                    <div className="w-[8rem] h-px bg-white"></div>
                    <div className="overflow-hidden" style={{ height: '2rem' }}>
                        <div
                            className="flex flex-col"
                            style={{
                                animation: 'subtitlesRollAnim 17s ease-in-out infinite',
                                fontFamily: 'Montserrat'
                            }}
                        >
                            {[...strings.pages.home.subtitles, strings.pages.home.subtitles[0]].map((item, index) => (
                                <div
                                    key={`${item}-${index}`}
                                    className="text-white text-xl font-light text-center"
                                    style={{ height: '2rem', lineHeight: '2rem' }}
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
                </div>
            </div>
            <SpinningSquareDivider />
            <div className={`min-h-screen flex items-center justify-center bg-black px-4 sm:px-8 md:px-16 py-8 transition-opacity duration-1500 ${aboutVisible ? 'opacity-100' : 'opacity-0'}`} ref={aboutRef}>
                <div className=" flex flex-col md:flex-row items-center md:gap-16 gap-8 w-full max-w-6xl">
                    <img
                        src="/profile.jpg"
                        alt="Jiaming Profile"
                        className="w-48 h-48 md:w-64 md:h-64 object-cover hover:scale-105 transition-transform duration-300"
                        draggable={false}
                    />
                    <div className="w-px h-16 md:h-24 bg-white"></div>
                    <div className="flex flex-col md:items-start md:text-left text-center items-center max-w-4xl w-full gap-6">
                        <h1
                            className="text-white text-3xl md:text-5xl lg:text-7xl font-bold"
                            style={{ fontFamily: 'Playfair Display' }}
                        >
                            About Me
                        </h1>
                        <p className={`text-white text-base md:text-lg leading-relaxed transition-opacity duration-1500 ${aboutVisible ? 'opacity-100' : 'opacity-0'}`} style={{ fontFamily: 'Montserrat' }}>
                            {strings.pages.home.about.content}
                        </p>
                        <div className="mt-8 flex flex-col gap-4">
                            <h2 className="text-white text-2xl font-bold" style={{ fontFamily: 'Playfair Display' }}>My Toolkit</h2>
                            <div className="flex flex-wrap gap-4 justify-start">
                                {(() => {
                                    const icons = [SiC, SiCplusplus, SiDart, SiFlutter, SiKotlin, SiOpenjdk, SiLlvm, SiMysql, SiAndroid, SiPython];
                                    return ["C", "C++", "Dart", "Flutter", "Kotlin", "Java", "LLVM", "MySQL", "Jetpack Compose", "Python"].map((item, index) => {
                                        const Icon = icons[index];
                                        return (
                                            <div key={item} className={`flex items-center gap-2 transition-all duration-1000 ${aboutVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${index * 500}ms` }}>
                                                <Icon className="text-white text-xs" />
                                                <span className="text-white text-sm" style={{ fontFamily: 'Montserrat' }}>{item}</span>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SpinningSquareDivider reverse={true} />
            <div className={`min-h-screen flex items-center justify-center bg-black px-4 sm:px-8 md:px-16 py-8 transition-opacity duration-1500 ${projectsVisible ? 'opacity-100' : 'opacity-0'}`} ref={projectsRef}>
                <div className="flex flex-col items-center justify-center gap-12 w-full max-w-6xl">
                    <h1
                        className="text-white text-3xl md:text-5xl lg:text-7xl font-bold"
                        style={{ fontFamily: 'Playfair Display' }}
                    >
                        Featured Projects
                    </h1>
                    <div className="w-[8rem] h-px bg-white"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
                        {strings.pages.home.projects.map((project, _) => (
                            <div key={project.title} className={`w-80 h-64 bg-transparent transition-all duration-1000 ease-out flex flex-col items-center justify-between p-8 ${projectsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                <div className="flex flex-col items-center gap-4">
                                    <h2 className="text-white text-[2rem] font-bold text-center"
                                        style={{
                                            fontFamily: 'Playfair Display',
                                            textShadow: `2px 2px ${hexToRgba(project.glow_color, 0.7)}`
                                        }}>{project.title}</h2>
                                    <p className="text-white text-sm text-center" style={{ fontFamily: 'Montserrat' }}>{project.description}</p>
                                </div>
                                <p className="text-white text-xs text-center" style={{ fontFamily: 'Montserrat' }}>{project.technologies.join(', ')} </p>
                                <button
                                    className="bg-transparent border-none text-white text-sm font-light py-2 px-6 cursor-pointer duration-300 group"
                                    style={{ fontFamily: 'Montserrat' }}
                                    onClick={() => window.open(project.link, '_blank')}
                                >
                                    View Project
                                    <span className="block w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <footer className="bg-black text-white text-center" style={{ fontFamily: 'Montserrat' }}>
                (C) 2025 Jiaming Meng
            </footer>
        </div>
    );
}
