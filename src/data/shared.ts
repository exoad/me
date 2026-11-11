import type { TProject, TTechnology } from "../types.d.ts";

/** Ming: Jiaming's agent. It keeps its own address and its own mailbox. */
export const ming = {
    name: "Ming",
    site: "https://daoxe.github.io/",
    siteLabel: "daoxe.github.io",
    email: "ming@exoad.net",
};

const tech = (name: string): TTechnology => ({ name });

export const projects: TProject[] = [
    {
        title: "kira",
        description:
            "simple, pure oop language built for transpilation. targets c, c++17, python, and nekovm. highly opinionated.",
        link: "https://github.com/exoad/kira",
        technologies: [tech("C"), tech("C++"), tech("Python")],
        featured: true,
        state: "finished",
        year: 2025,
    },
    {
        title: "ming",
        description: "my own personal agent, running on my own server. glm 5.3 on 512gb of vram.",
        link: ming.site,
        technologies: [],
        featured: true,
        state: "active",
        year: 2026,
    },
    {
        title: "bibo-harness",
        description: "lightweight coding agent harness for pairing with <70b models.",
        link: "https://github.com/exoad/bibo-agent",
        technologies: [],
        featured: true,
        state: "finished",
        year: 2026,
    },
    {
        title: "drosk",
        description: "local-first file automation. secured $10k in non-dilutive funding.",
        link: "https://drosk.net",
        technologies: [tech("Flutter"), tech("C")],
        featured: true,
        state: "finished",
        year: 2026,
    },
    {
        title: "jackbox",
        description: "a server i built to run inference on free university electricity.",
        technologies: [],
        featured: true,
        state: "finished",
        year: 2026,
    },
];

export const strings = {
    name: "Jiaming Meng",
    links: {
        github: "https://github.com/exoad",
        github_aria: "My GitHub Profile",
        linkedin: "https://www.linkedin.com/in/jack-meng/",
        linkedin_aria: "My LinkedIn Profile",
        x: "https://x.com/exoad_",
        x_aria: "My X Profile",
    },
    footer: {
        legals: "© 2026 Jiaming Meng",
        source: {
            leading: "source:",
            url: "https://github.com/exoad/me",
            url_attr: "github.com/exoad/me",
        },
    },
    pages: {
        home: {
            tagline: "i build for fun.",
            about: {
                content: "i build for fun.",
            },
        },
        not_found: {
            super: "404",
            title: "Page Not Found",
            description:
                "The page you're looking for doesn't exist. It might have been moved or deleted.",
            go_back: "Go Back",
        },
        photos: {
            description:
                "A collection of photos that I have captured as a hobbyist photographer and deemed worthy of sharing :).",
        },
    },
};
