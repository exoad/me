import { useState, useRef, useEffect } from 'react';
import strings from "../config/strings.ts";
import { FiChevronDown } from 'react-icons/fi';
import SpinningSquareDivider from '../components/SpinningSquareDivider';
import StarryBackground from '../components/StarryBackground';
import { hexToRgba } from '../utils/css.ts';
import theme from '../config/theme.json';
import { SiGithub, SiLinkedin } from 'react-icons/si';
export default function HomePage() {
    const [nameIndex, setNameIndex] = useState(0);
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
            <header className="w-full fixed top-0 z-50 backdrop-blur-xs bg-black/48">
                <div className="flex justify-between items-center" style={{ padding: '0.5rem 4rem' }}>
                    <button
                        className="text-white text-lg md:text-xl font-bold font-playfair cursor-pointer hover:scale-105 transition-transform duration-300 bg-transparent border-none"
                        style={{ textShadow: `2px 2px ${strings.header.names_funny[nameIndex][1]}` }}
                        onClick={() => setNameIndex((nameIndex + 1) % strings.header.names_funny.length)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                setNameIndex((nameIndex + 1) % strings.header.names_funny.length);
                            }
                        }}
                    >
                        {strings.header.names_funny[nameIndex][0]}
                    </button>
                    <nav className="flex gap-6 md:gap-12">
                        <button className="bg-transparent border-none text-white text-sm md:text-base font-light font-montserrat py-2 px-3 md:px-6 cursor-pointer transition-colors duration-300 group">
                            {strings.navigation.home}
                            <span className="block w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                        </button>
                        <button className="bg-transparent border-none text-white text-sm md:text-base font-light font-montserrat py-2 px-3 md:px-6 cursor-pointer transition-colors duration-300 group">
                            {strings.navigation.projects}
                            <span className="block w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                        </button>
                        <button className="bg-transparent border-none text-white text-sm md:text-base font-light font-montserrat py-2 px-3 md:px-6 cursor-pointer transition-colors duration-300 group">
                            {strings.navigation.socials}
                            <span className="block w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                        </button>
                    </nav>
                </div>
            </header>
            <div className={`min-h-screen flex flex-col items-center justify-center bg-black px-4 sm:px-8 md:px-16 transition-opacity duration-1500 ${heroVisible ? 'opacity-100' : 'opacity-0'} relative`} ref={heroRef}>
                <StarryBackground scrollY={scrollY} />
                <div className="flex flex-col items-center justify-center gap-8 z-10">
                    <h1
                        className={`text-white text-6xl font-bold font-playfair transition-all duration-1000 ${heroVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    >
                        {strings.name}
                    </h1>

                    <p
                        className={`text-white/90 text-lg md:text-xl text-center max-w-2xl mx-auto font-montserrat transition-all duration-1000 delay-200 ${heroVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    >
                        {strings.pages.home.tagline}
                    </p>
                    <div className="w-[8rem] h-px bg-white" />
                    <div className="overflow-hidden h-[2rem]">
                        <div
                            className="flex flex-col font-montserrat"
                            style={{ animation: 'subtitlesRollAnim 17s ease-in-out infinite' }}
                        >
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
            @keyframes pulse {
              0%, 100% { opacity: 0.6; transform: translateY(0px); }
              50% { opacity: 1; transform: translateY(-5px); }
            }
          `}</style>

                    {/* <div className="mt-2 py-2 px-4 bg-black/30 backdrop-blur-sm transition-all duration-700">
                        <p
                            className={`text-white/80 text-sm font-montserrat transition-all duration-1000 ${heroVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                            style={{ transitionDelay: '400ms' }}
                        >
                            {strings.pages.home.currently_working}
                        </p>
                    </div> */}
                    <div className="flex gap-6 mt-2">
                        <a href={strings.links.github} target="_blank" rel="noopener noreferrer" className="text-white transition-all duration-300 inline-block hover:scale-110">
                            <SiGithub size={28} />
                        </a>
                        <a href={strings.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-white transition-all duration-300 inline-block hover:scale-110">
                            <SiLinkedin size={28} />
                        </a>
                    </div>

                    <div
                        className="absolute bottom-8 flex flex-col items-center gap-2 animate-pulse"
                        style={{ animation: 'pulse 2s infinite ease-in-out' }}
                    >
                        <p
                            className="text-white text-sm font-montserrat"
                        >
                            {strings.pages.home.scroll_text}
                        </p>
                        <div className="h-8 w-5 flex justify-center">
                            <FiChevronDown className="absolute text-white" size={20} />
                        </div>
                    </div>
                </div>
            </div>
            <SpinningSquareDivider />
            <div className={`min-h-screen flex items-center justify-center bg-black px-4 sm:px-8 md:px-16 py-8 transition-opacity duration-1500 ${kindaVisible ? 'opacity-100' : 'opacity-0'}`} ref={aboutRef}>
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
                        <p className={`text-white text-base md:text-lg leading-relaxed font-montserrat transition-opacity duration-1500 ${kindaVisible ? 'opacity-100' : 'opacity-0'}`}>
                            {strings.pages.home.about.content}
                        </p>
                        <div className="mt-8 flex flex-col gap-4">
                            <h2 className="text-white text-2xl font-bold font-playfair">{strings.pages.home.about.toolkit_title}</h2>
                            <div className="flex flex-wrap gap-4 justify-start">
                                {strings.pages.home.about.technologies.map((item, index) =>
                                    <div key={item.name} className={`flex items-center gap-2 transition-all duration-1000 ${kindaVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${index * 500}ms` }}>
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
            <div className={`min-h-screen flex items-center justify-center bg-black px-4 sm:px-8 md:px-16 py-8 transition-opacity duration-1500 ${projectsVisible ? 'opacity-100' : 'opacity-0'}`} ref={projectsRef}>
                <div className="flex flex-col items-center justify-center gap-12 w-full max-w-6xl">
                    <h1 className="text-white text-3xl md:text-5xl lg:text-7xl font-bold font-playfair">
                        {strings.pages.home.projects_title}
                    </h1>
                    <div className="w-[8rem] h-px bg-white"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
                        {strings.pages.home.projects.map((project, _) =>
                            <div key={project.title} className={`w-80 h-64 bg-transparent transition-all duration-1000 ease-out flex flex-col items-center justify-between p-8 ${projectsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                <div className="flex flex-col items-center gap-4">
                                    <h2 className="text-white text-[2rem] font-bold text-center font-playfair"
                                        style={{ textShadow: `2px 2px ${hexToRgba(project.glow_color, 0.7)}` }}
                                    >
                                        {project.title}
                                    </h2>
                                    <p className="text-white text-sm text-center font-montserrat">{project.description}</p>
                                </div>
                                <p className="text-white text-xs text-center font-montserrat">{project.technologies.join(', ')} </p>
                                <button
                                    className="bg-transparent border-none text-white text-sm font-light font-montserrat py-2 px-6 cursor-pointer duration-300 group"
                                    onClick={() => window.open(project.link, '_blank')}
                                >
                                    {strings.pages.home.view_project_button}
                                    <span className="block w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="h-8" />
                    <p className="text-white text-lg text-center max-w-md font-playfair">
                        {strings.pages.home.and_more}
                    </p>
                    <button
                        aria-label="Explore all projects"
                        onClick={() => window.location.href = '/projects'}
                        className="relative inline-flex items-center justify-center text-white font-montserrat px-6 py-3"
                    >
                        <span className="relative z-10">{strings.pages.home.view_all_projects_button}</span>
                    </button>
                </div>
            </div>
            <footer className="bg-black text-white text-center font-montserrat">
                {strings.footer}
            </footer>
        </div>

    );
}
