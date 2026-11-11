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
    featured: boolean;
    technologies: TTechnology[];
    state: TProjectState;
    year: number;
}
