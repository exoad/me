import { useState, useRef, useEffect } from 'react';
import SEO from '../components/SEO';
import { projects } from "../data/shared.ts";
import { MdOutlineArrowOutward } from "react-icons/md";
import { hexToRgba } from '../utils/css.ts';
import { Row } from "../components/FlexLayouter.tsx";
import ProjectsColorBar from '../components/ProjectsColorBar.tsx';

const gradients = [
    "from-gb-red via-gb-orange to-gb-yellow",
    "from-gb-yellow via-gb-green to-gb-aqua",
    "from-gb-aqua via-gb-blue to-gb-purple",
    "from-gb-purple via-gb-red to-gb-orange",
    "from-gb-orange via-gb-yellow to-gb-green",
    "from-gb-green via-gb-aqua to-gb-blue",
    "from-gb-blue via-gb-purple to-gb-red",
    "from-gb-yellow via-gb-orange to-gb-red"
];

export default function ProjectsPage() {
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    const itemRefs = useRef<(HTMLElement | null)[]>([]);
    useEffect(() => {
        if (window.scrollY > 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);
    useEffect(() => {
        const observers = itemRefs.current.map((ref, index) => {
            if (!ref) return null;
            const observer = new IntersectionObserver(
                (entries) => {
                    for (const entry of entries) {
                        if (entry.isIntersecting) {
                            setVisibleItems((prev) => new Set([...prev, index]));
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

    return (
        <>
            <SEO
                title="Projects"
                description="A collection of projects and experiments."
                url="https://exoad.net/projects"
            />
            <div className="min-h-screen bg-bg0">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="text-center mb-12">
                        <h2 className="text-[10px] uppercase tracking-[0.2em] text-fg4 mb-4 font-sans">Portfolio</h2>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[9rem] font-extrabold text-fg4/30 uppercase tracking-widest leading-tight font-sans">
                            Projects
                        </h1>
                        <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-fg0 leading-tight font-sans mt-2">
                            A collection of work
                        </h3>
                    </div>
                    <div className="border-b border-bg2 mb-12" />
                    <div className="grid gap-8 md:gap-10 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                        {projects.map((proj, index) => (
                            <a
                                key={proj.title}
                                href={proj.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`relative transition-all duration-1000 ease-[cubic-bezier(0.17,0.67,0.38,1)] block ${visibleItems.has(index)
                                    ? "opacity-100 translate-y-0 scale-100 blur-0"
                                    : "opacity-0 translate-y-6 sm:translate-y-8 lg:translate-y-10 scale-95 blur-sm"
                                    }`}
                                style={{ transitionDelay: `${120 + index}ms` }}
                                ref={(el) => { itemRefs.current[index] = el; }}
                            >
                                <div className="overflow-hidden shadow-lg hover:scale-[1.02] ease-[cubic-bezier(0,0,0.2,1)] transition-transform duration-200">
                                    <div className="relative w-full h-[20rem] flex items-center justify-center overflow-hidden">
                                        {proj.demoImage ? (
                                            <>
                                                <img
                                                    src={proj.demoImage}
                                                    alt={`${proj.title} background`}
                                                    className="absolute inset-0 w-full h-full p-6 blur-lg opacity-40"
                                                />
                                                <img
                                                    src={proj.demoImage}
                                                    alt={proj.title}
                                                    className="relative w-[90%] h-[70%] object-contain z-10"
                                                />
                                                {proj.logo && (
                                                    <img
                                                        src={proj.logo}
                                                        alt={`${proj.title} logo`}
                                                        className="absolute bottom-3 left-3 w-12 h-12 object-contain z-20"
                                                    />
                                                )}
                                            </>
                                        ) : proj.logo ? (
                                            <>
                                                <img
                                                    src={proj.logo}
                                                    alt={`${proj.title} blurred background`}
                                                    className="absolute inset-0 w-full h-full p-12 object-cover blur-2xl scale-85 opacity-40"
                                                />
                                                <img
                                                    src={proj.logo}
                                                    alt={`${proj.title} logo`}
                                                    className="relative w-24 h-24 object-contain z-10"
                                                />
                                            </>
                                        ) : (
                                            <div
                                                className={`absolute inset-0 rounded-full p-12 w-full h-full scale-65 blur-3xl opacity-20 bg-gradient-to-br ${gradients[index % gradients.length]}`}
                                            />
                                        )}
                                    </div>
                                    <div className="py-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3
                                                className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans break-words text-fg0"
                                                style={{ textShadow: `2px 2px ${hexToRgba(proj.color, 0.7)}` }}
                                            >
                                                {proj.title}
                                            </h3>
                                            <span
                                                className={`px-1.5 py-0.5 text-xs font-medium capitalize ${proj.state === "active" ? "bg-green-dim/30 text-green" : proj.state === "finished" ? "bg-blue-dim/30 text-blue" : "bg-gray/20 text-fg4"}`}
                                            >
                                                {proj.state}
                                            </span>
                                        </div>
                                        <p className="text-fg3 text-sm sm:text-md font-sans mb-4">
                                            {proj.description}
                                        </p>
                                        <Row gap={0}>
                                            <ProjectsColorBar technologies={proj.technologies} ref={proj.title} />
                                        </Row>
                                        <div className="border-b border-bg2 my-4" />
                                        <div className="bg-transparent border-none text-fg1 text-md font-light font-sans duration-300 group relative">
                                            <Row gap={2} mainAxisAlignment='center'>
                                                <MdOutlineArrowOutward />
                                                View Project
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
