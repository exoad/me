export interface TTechnology {
    name: string;
    icon: React.ComponentType<{ className?: string; }>;
    color: string;
}

export interface TProject {
    title: string;
    description: string;
    color: string;
    logo?: string;
    link: string;
    featured: boolean;
    technologies: TTechnology[];
}

export interface TTimelineEntry {
    displayDate: string;
    isoDate: string;
    title: string;
    description: string;
    link?: string;
    technologies?: TTechnology[];
}

export interface TShowcasePhoto {
    src: string;
    alt: string;
    caption?: string;
    location: string;
    date: string;
}