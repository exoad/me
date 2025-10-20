export interface TTechnology {
    name: string;
    icon: React.ComponentType<{ className?: string; }>;
    color: string;
}

export type TProjectState = "finished" | "archived" | "active";

export interface TProject {
    title: string;
    description: string;
    color: string;
    logo?: string;
    link: string;
    featured: boolean;
    demoImage?: string;
    technologies: TTechnology[];
    state: TProjectState;
}

export interface TTimelineEntry {
    displayDate: string;
    isoDate: string;
    title: string;
    description: string;
    link?: string;
    gradientColor?: string;
}

export interface TShowcasePhoto {
    src: string | any;
    alt: string;
    caption?: string;
    location: string;
    date: string;
    thumbnailSrc: string | any;
}

export interface TStalkEntry {
    city: string;
    state?: string;
}