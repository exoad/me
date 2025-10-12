import { useState, useRef, useEffect } from 'react';
import strings from "../config/strings.ts";
import SpinningSquareDivider from '../components/SpinningSquareDivider';
import Footer from '../components/Footer.tsx';

interface TimelineItem {
    date: string;
    title: string;
    description: string;
    side: 'left' | 'right';
}

const fakeTimelineData: TimelineItem[] = [
    {
        date: "2018",
        title: "Started Programming Journey",
        description: "Began learning C and C++ through self-study, fascinated by low-level systems programming.",
        side: 'left'
    },
    {
        date: "2019",
        title: "First Open Source Contribution",
        description: "Contributed to LLVM project, marking the beginning of my involvement in open source development.",
        side: 'right'
    },
    {
        date: "2020",
        title: "University Admission",
        description: "Enrolled in university to pursue Computer Science, balancing academics with personal projects.",
        side: 'left'
    },
    {
        date: "2021",
        title: "Mobile Development Exploration",
        description: "Discovered Flutter and Dart, building cross-platform applications and expanding my toolkit.",
        side: 'right'
    },
    {
        date: "2022",
        title: "AI/ML Research",
        description: "Started university research in Artificial Intelligence and Machine Learning, focusing on practical applications.",
        side: 'left'
    },
    {
        date: "2023",
        title: "Compiler Design Passion",
        description: "Began exploring compiler design as a personal passion project, leading to the creation of Kira language.",
        side: 'right'
    },
    {
        date: "2024",
        title: "Portfolio Launch",
        description: "Launched this portfolio website, showcasing projects and sharing the journey of continuous learning.",
        side: 'left'
    }
];

export default function AboutPage() {
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    const itemRefs = useRef<(HTMLDivElement | null)[]>(Array(fakeTimelineData.length).fill(null));

    useEffect(() => {
        const observers = itemRefs.current.map((ref, index) => {
            if (!ref) return null;
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setVisibleItems(prev => new Set([...prev, index]));
                        }
                    });
                },
                { threshold: 0.3 }
            );
            observer.observe(ref);
            return observer;
        });

        return () => {
            observers.forEach(observer => observer?.disconnect());
        };
    }, []);

    return (
        <div className="relative select-none bg-black text-white">
            <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 py-16">
                <div className="max-w-4xl w-full">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-playfair text-center mb-16">
                        My Journey
                    </h1>

                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-px bg-white/30 h-full"></div>
                        <div className="space-y-12">
                            {fakeTimelineData.map((item, index) => (
                                <div
                                    key={`${item.date}-${item.title}`}
                                    ref={el => { itemRefs.current[index] = el; }}
                                    className={`relative flex items-center ${item.side === 'left' ? 'justify-start' : 'justify-end'
                                        } transition-all duration-1000 ${visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                        }`}
                                >
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-black z-10"></div>
                                    <div className={`w-full max-w-md ${item.side === 'left' ? 'pr-8' : 'pl-8'}`}>
                                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                                            <div className="text-white/60 text-sm font-montserrat mb-2">{item.date}</div>
                                            <h3 className="text-white text-xl font-bold font-playfair mb-3">{item.title}</h3>
                                            <p className="text-white/80 text-sm font-montserrat leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <SpinningSquareDivider />
            <Footer />
        </div>
    );
}