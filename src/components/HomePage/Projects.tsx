import { useRef, useState, useEffect } from 'react';
import type { TProject } from '../../types.d.ts';
import { hexToRgba } from '../../utils/css';
import HoverShowLine from '../HoverShowLine';
import AttentionButton from '../AttentionButton.tsx';

export default function Projects({
    title,
    projects,
    viewProjectButtonText,
    viewAllProjectsButtonText,
    onIntersect
}: Readonly<{
    title: string;
    projects: TProject[];
    viewProjectButtonText: string;
    viewAllProjectsButtonText: string;
    onIntersect: (isVisible: boolean) => void;
}>) {
    const projectsRef = useRef<HTMLDivElement>(null);
    const [projectsVisible, setProjectsVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setProjectsVisible(true);
                        onIntersect(true);
                    }
                });
            },
            { threshold: 0.2 }
        );
        if (projectsRef.current) {
            observer.observe(projectsRef.current);
        }
        return () => observer.disconnect();
    }, [onIntersect]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-8 md:px-16 py-8" ref={projectsRef}>
            <div className="flex flex-col items-center justify-center gap-12 w-full max-w-6xl">
                <h1
                    className={`text-white text-3xl md:text-5xl lg:text-7xl font-bold font-playfair transition-all duration-1000 ${projectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: projectsVisible ? '100ms' : '0ms' }}
                >
                    {title}
                </h1>
                <div
                    className={`w-[8rem] h-px bg-white transition-all duration-1000 ${projectsVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
                    style={{ transitionDelay: projectsVisible ? '200ms' : '0ms' }}
                ></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
                    {projects.map((project, index) => (
                        <div
                            key={project.title}
                            className={`w-80 bg-transparent transition-all duration-1000 ease-out p-8 grid grid-rows-[auto_1fr_auto] min-h-[22rem] ${projectsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                            style={{ transitionDelay: projectsVisible ? `${300 + (index * 300)}ms` : '0ms' }}
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
                                    style={{ textShadow: `2px 2px ${hexToRgba(project.color, 0.7)}` }}
                                >
                                    {project.title}
                                </h2>
                                <p className="mt-1 text-white/90 text-sm text-center font-montserrat">{project.description}</p>
                            </div>
                            <div className="flex flex-col items-center gap-3 row-start-3 mt-4">
                                <p className="text-white/80 text-xs text-center font-montserrat">
                                    {project.technologies.map(tech => tech.name).join(', ')}
                                </p>
                                <span className="block w-12 h-px bg-white/60" />
                                <button
                                    className="bg-transparent border-none text-white text-sm font-light font-montserrat py-2 px-6 cursor-pointer duration-300 group"
                                    onClick={() => window.open(project.link, '_blank')}
                                >
                                    {viewProjectButtonText}
                                    <HoverShowLine />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="h-8" />
                <AttentionButton
                    ariaLabel='See More'
                    onClick={() => window.location.href = '/projects'}
                    className={`transition-all duration-1000 ${projectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: projectsVisible ? `${300 + (projects.length * 300) + 400}ms` : '0ms' }}
                >
                    {viewAllProjectsButtonText}
                </AttentionButton>
            </div>
        </div>
    );
}
