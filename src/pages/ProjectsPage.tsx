import { useState, useRef, useEffect } from 'react';
import Scaffold, { ScaffoldContent } from '../components/Scaffold';
import { projects, strings } from "../data/shared.ts";
import HoverShowLine from '../components/HoverShowLine.tsx';
import { MdOutlineArrowOutward } from "react-icons/md";
import Divider from '../components/Divider.tsx';
import { hexToRgba } from '../utils/css.ts';
import { Column, Row } from "../components/FlexLayouter.tsx";
import ProjectsColorBar from '../components/ProjectsColorBar.tsx';

const gradients = [
    "from-[#ff1e56] via-[#00f0ff] to-[#7f00ff]",
    "from-[#ffd700] via-[#00ff87] to-[#0066ff]",
    "from-[#e71d36] via-[#06d6a0] to-[#fffa65]",
    "from-[#3a86ff] via-[#ff006e] to-[#ffd6e0]",
    "from-[#ff7eb3] via-[#ff65a3] to-[#7afcff]",
    "from-[#f72585] via-[#b5179e] to-[#7209b7]",
    "from-[#ff9a9e] via-[#fad0c4] to-[#fad390]",
    "from-[#a1c4fd] via-[#c2e9fb] to-[#667eea]"
];

export default function ProjectsPage({ scaffoldProps = {} }) {
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

    return <Scaffold {...scaffoldProps}>
        <ScaffoldContent useDefaultLayout className="w-full overflow-x-hidden">
            <Column gap={12} crossAxisAlignment="start" className="px-4 sm:px-8 md:px-12">
                <Column gap={4} className="text-center w-full mb-8 px-4">
                    <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-[9rem]font-extrabold text-white/20 uppercase tracking-widest leading-tight">
                        {strings.pages.projects.title.prompt}
                    </h2>

                    <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-snu" >
                        {strings.pages.projects.title.figure}
                    </h3>

                    <p className="text-smsm:text-basemd:text-lg font-montserrat mt-4 text-white/70">
                        {strings.pages.projects.title.label}
                    </p>
                </Column>
                <Divider className="w-full md:my-8 my-4" />
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
                                            className="text-xl sm:text-2xl lg:text-3xl font-bold font-playfair break-words"
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
                                    <p className="text-white/70 text-sm sm:text-md font-montserrat mb-4">
                                        {proj.description}
                                    </p>
                                    <Row gap={0}>
                                        <ProjectsColorBar technologies={proj.technologies} ref={proj.title} />
                                    </Row>
                                    <Divider className="w-full my-4" />
                                    <button
                                        className=" bg-transparent border-none text-white text-md font-light font-montserrat cursor-pointer duration-300 group"
                                        onClick={() => window.open(proj.link, "_blank")}
                                    >
                                        <Row gap={2} mainAxisAlignment='center'>
                                            <MdOutlineArrowOutward />
                                            {strings.pages.projects.project.view_project}
                                        </Row>
                                        <HoverShowLine />
                                    </button>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </Column>
        </ScaffoldContent>
    </Scaffold >;
}