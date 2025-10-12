interface TTechnology {
    name: string;
    icon: React.ComponentType<{ className?: string; }>;
    color: string;
}

interface TProject {
    title: string;
    description: string;
    color: string;
    logo?: string;
    link: string;
    featured: boolean;
    technologies: TTechnology[];
}

interface TTimelineEntry {
    displayDate: string;
    isoDate: string;
    title: string;
    description: string;
    link?: string;
    technologies?: TTechnology[];
}