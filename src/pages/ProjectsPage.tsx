import { useState, useRef, useEffect } from 'react';
import Scaffold, { ScaffoldContent } from '../components/Scaffold';
import { projects, strings } from "../data/shared.ts";
import HoverShowLine from '../components/HoverShowLine.tsx';
import Divider from '../components/Divider.tsx';
import { hexToRgba } from '../utils/css.ts';
import { Column, Row } from "../components/FlexLayouter.tsx";
import ProjectsColorBar from '../components/ProjectsColorBar.tsx';

const gradients = [
    "from-pink-500 via-red-500 to-yellow-500",
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-green-400 via-blue-500 to-purple-600",
    "from-yellow-400 via-orange-500 to-red-500",
    "from-cyan-400 via-sky-500 to-blue-600",
];

export default function ProjectsPage({ scaffoldProps = {} }) {
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
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

    return <Scaffold {...scaffoldProps}>
        <Column gap={16} crossAxisAlignment='start' className="px-12">
            <div className="relative mt-64 px-15">
                <h2 className="absolute -top-10 md:-top-30 left-15 text-6xl md:text-[10rem] font-extrabold text-white/15 uppercase tracking-widest">
                    Projects
                </h2>
                <h3 className="relative text-4xl md:text-6xl font-bold text-white">What I've Built</h3>
                <p className="text-white/70 mt-2 max-w-md text-lg md:text-xl">
                    Built with my passion to have fun learning novel concepts.
                </p>
            </div>
            <ScaffoldContent className="gap-32" useDefaultLayout>
                <div className="grid md:gap-16 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((proj, index) => (
                        <div
                            key={proj.title}
                            ref={(el) => { itemRefs.current[index] = el; }}
                            className={`relative transition-all duration-1000 ease-[cubic-bezier(0.17,0.67,0.38,1)]   ${visibleItems.has(index)
                                ? "opacity-100 translate-y-0 scale-100 blur-0"
                                : "opacity-0 translate-y-6 sm:translate-y-8 lg:translate-y-10 scale-95 blur-sm"
                                }`}
                            style={{
                                transitionDelay: `${150 + index}ms`
                            }}
                        >
                            <div className="overflow-hidden shadow-lg hover:scale-[1.02] ease-[cubic-bezier(0,0,0.2,1)] transition-transform duration-200">
                                <div className="relative w-full h-[20rem] flex items-center justify-center overflow-hidden">
                                    {proj.demoImage ? (
                                        <>
                                            <img
                                                src={proj.demoImage}
                                                alt={proj.title}
                                                className="w-full h-full object-contain"
                                            />
                                            {proj.logo && (
                                                <img
                                                    src={proj.logo}
                                                    alt={`${proj.title} logo`}
                                                    className="absolute bottom-3 left-3 w-12 h-12 object-contain"
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
                                            className="text-2xl font-bold font-playfair"
                                            style={{ textShadow: `2px 2px ${hexToRgba(proj.color, 0.7)}` }}
                                        >
                                            {proj.title}
                                        </h3>
                                        <span
                                            className={`px-1.5 py-0.5 text-xs rounded-sm font-medium capitalize ${proj.state === "active" ? "bg-green-500/20 text-green-400" : proj.state === "finished" ? "bg-blue-500/20 text-blue-400" : "bg-gray-500/20 text-gray-400"}`}
                                        >
                                            {proj.state}
                                        </span>
                                    </div>
                                    <p className="text-white/70 text-md font-montserrat mb-4">
                                        {proj.description}
                                    </p>
                                    <Row gap={0}>
                                        <ProjectsColorBar technologies={proj.technologies} ref={proj.title} />
                                    </Row>
                                    <Divider className="w-full my-4" />
                                    <button
                                        className="bg-transparent border-none text-white text-md font-light font-montserrat cursor-pointer duration-300 group"
                                        onClick={() => window.open(proj.link, "_blank")}
                                    >
                                        {strings.pages.projects.project.view_project}
                                        <HoverShowLine />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </ScaffoldContent>
        </Column>
    </Scaffold>;
}