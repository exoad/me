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
    /** The year the work started, taken from the repository's creation date. */
    year: number;
}

export interface TTimelineEntry {
    displayDate: string;
    isoDate: string;
    title: string;
    description: string;
    link?: string;
    gradientColor?: string;
}

export interface TStalkEntry {
    city: string;
    state?: string;
}

export interface TBlogPost {
    slug: string;
    title: string;
    date: string;
    displayDate: string;
    excerpt: string;
    description: string;
    tags: string[];
    featured?: boolean;
}
