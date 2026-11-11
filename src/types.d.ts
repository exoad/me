export interface TTechnology {
    name: string;
}

export type TProjectState = "finished" | "archived" | "active";

export interface TProject {
    title: string;
    /** One line. It is the whole of what the home page says about it. */
    description: string;
    /** Absent for work with nowhere public to point at. */
    link?: string;
    /** A sibling project shown on the same row. */
    pair?: { title: string; link?: string };
    /** The full span, e.g. "2025–26", for the machine-readable copies. */
    years: string;
    /** Which timeline group the page files it under; defaults to the start year. */
    period?: string;
    featured: boolean;
    technologies: TTechnology[];
    state: TProjectState;
    year: number;
}
