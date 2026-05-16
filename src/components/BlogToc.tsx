import { useEffect, useState } from 'react';
import { TocEntry } from '../utils/markdown';

export default function BlogToc({ entries }: { entries: TocEntry[] }) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                }
            },
            { rootMargin: '-80px 0px -80% 0px', threshold: 0 }
        );

        const headings = document.querySelectorAll('.blog-content h2[id], .blog-content h3[id], .blog-content h4[id]');
        headings.forEach(h => observer.observe(h));

        return () => observer.disconnect();
    }, []);

    if (entries.length === 0) return null;

    return (
        <nav className="hidden lg:flex flex-col w-44 shrink-0 pt-24 sticky top-24 self-start z-10">
            <div className="text-[10px] uppercase tracking-[0.2em] text-fg4 mb-4 font-sans">
                On this page
            </div>
            <ul className="space-y-1.5">
                {entries.map((entry) => (
                    <li key={entry.id}>
                        <a
                            href={`#${entry.id}`}
                            className={`block text-xs font-sans transition-colors duration-200 hover:text-fg0 ${
                                entry.level === 2 ? 'pl-0' : entry.level === 3 ? 'pl-3' : 'pl-6'
                            } ${
                                activeId === entry.id
                                    ? 'text-yellow font-bold'
                                    : 'text-fg4'
                            }`}
                            onClick={(e) => {
                                e.preventDefault();
                                const el = document.getElementById(entry.id);
                                if (el) {
                                    el.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                        >
                            {entry.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
