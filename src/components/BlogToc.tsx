import { TocEntry } from '../utils/markdown';

export default function BlogToc({ entries }: { entries: TocEntry[] }) {
    if (entries.length === 0) return null;

    return (
        <nav className="hidden lg:block" style={{ width: "10rem", flexShrink: 0, position: "sticky", top: "1rem", alignSelf: "flex-start" }}>
            <div className="muted" style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                On this page
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {entries.map((entry) => (
                    <li key={entry.id} style={{ marginBottom: "0.4rem", paddingLeft: entry.level === 2 ? 0 : entry.level === 3 ? "0.75rem" : "1.5rem" }}>
                        <a href={`#${entry.id}`}>{entry.text}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
