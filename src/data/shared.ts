import type { TProject, TTechnology } from "../types.d.ts";

/** Ming: Jiaming's agent. It keeps its own address and its own mailbox. */
export const ming = {
    name: "Ming",
    site: "https://daoxe.github.io/",
    siteLabel: "daoxe.github.io",
    email: "ming@exoad.net",
};

const tech = (name: string): TTechnology => ({ name });

const gh = (repo: string) => `https://github.com/exoad/${repo}`;

/**
 * In the owner's order: the first three are what is on the go now, the rest run
 * newest first. The page groups them by `period` (an explicit one, or the start
 * year) along a timeline; `years` is the full span, for the machine-readable
 * copies.
 */
export const projects: TProject[] = [
    {
        title: "espmon",
        period: "now",
        pair: { title: "picomon", link: gh("picomon") },
        description: "esp32 and rp2350 libraries, written in kira.",
        link: gh("espmon"),
        technologies: [tech("Kira")],
        featured: true,
        state: "active",
        year: 2026,
        years: "2026",
    },
    {
        title: "kira",
        period: "now",
        description:
            "simple, pure oop language built for transpilation. targets c, c++17, python, and nekovm. highly opinionated.",
        link: gh("kira"),
        technologies: [tech("Kotlin"), tech("C"), tech("C++"), tech("Python")],
        featured: true,
        state: "active",
        year: 2025,
        years: "2025–26",
    },
    {
        title: "ming",
        period: "now",
        description: "my own personal agent, running on my own server. glm 5.3 on 512gb of vram.",
        link: ming.site,
        technologies: [],
        featured: true,
        state: "active",
        year: 2026,
        years: "2026",
    },
    {
        // Not public yet: named, nothing more.
        title: "bibo",
        period: "now",
        description: "being built.",
        technologies: [],
        featured: true,
        state: "active",
        year: 2026,
        years: "2026",
    },
    {
        title: "jackbox",
        description: "a server i built to run inference on free university electricity.",
        technologies: [],
        featured: true,
        state: "finished",
        year: 2026,
        years: "2026",
    },
    {
        title: "bibo-harness",
        description: "lightweight coding agent harness for pairing with <70b models.",
        link: gh("bibo-agent"),
        technologies: [tech("JavaScript")],
        featured: true,
        state: "finished",
        year: 2026,
        years: "2026",
    },
    {
        title: "drosk",
        description: "local-first file automation. secured $10k in non-dilutive funding.",
        link: "https://drosk.net",
        technologies: [tech("Flutter"), tech("C")],
        featured: true,
        state: "active",
        year: 2026,
        years: "2026",
    },
    {
        title: "software_3d",
        pair: { title: "software_rasterizer", link: gh("software_rasterizer") },
        description: "let your cpu cosplay as a gpu. raytracing, sdf raymarching, a bvh and ten shader passes, all in software.",
        link: gh("software_3d"),
        technologies: [tech("C")],
        featured: true,
        state: "finished",
        year: 2025,
        years: "2025–26",
    },
    {
        title: "nukleon",
        description: "automation game about running a nuclear plant in an orwellian future. custom engine on flutter's canvas.",
        link: gh("nukleon"),
        technologies: [tech("Dart"), tech("Flutter")],
        featured: true,
        state: "archived",
        year: 2025,
        years: "2025",
    },
    {
        title: "prosodia-seq",
        description: "seq2seq model that turns english sounds into mandarin pinyin. ok → ou1kei4.",
        link: "https://exoad.github.io/Prosodia-Seq/",
        technologies: [tech("Python"), tech("PyTorch")],
        featured: true,
        state: "finished",
        year: 2025,
        years: "2025",
    },
    {
        title: "crayfish",
        pair: { title: "lair133", link: gh("Lair133") },
        description: "software raycasters: one with a flutter map editor, one slowly turning into a horror game in c.",
        link: gh("crayfish"),
        technologies: [tech("C++"), tech("C"), tech("Flutter")],
        featured: true,
        state: "active",
        year: 2025,
        years: "2025",
    },
    {
        title: "big_double",
        description: "a number type that goes to 10^10^308. speed over accuracy.",
        link: "https://pub.dev/packages/big_double",
        technologies: [tech("Dart")],
        featured: true,
        state: "finished",
        year: 2025,
        years: "2025",
    },
    {
        title: "rundown roulette",
        description: "randomizer for gtfo rundowns and loadouts. i host games with it.",
        link: "https://exoad.github.io/GTFO-RundownRoulette/",
        technologies: [tech("Dart"), tech("Flutter")],
        featured: true,
        state: "finished",
        year: 2025,
        years: "2025",
    },
    {
        title: "on_the_fly",
        description: "background file conversion that sorts files as they land. where drosk started.",
        link: gh("on_the_fly"),
        technologies: [tech("Dart"), tech("Flutter")],
        featured: true,
        state: "archived",
        year: 2024,
        years: "2024",
    },
    {
        title: "toasterify",
        description: "an app that warms your hands by working your phone hard. for winter.",
        link: gh("toasterify"),
        technologies: [tech("Dart"), tech("Flutter")],
        featured: true,
        state: "archived",
        year: 2023,
        years: "2023",
    },
    {
        title: "halcyon",
        description: "the music player i keep rewriting. a java gui on a 2d opengl engine i wrote for it, audio in c. my first big one.",
        link: gh("Halcyon.c"),
        technologies: [tech("Java"), tech("OpenGL"), tech("C")],
        featured: true,
        state: "archived",
        year: 2022,
        years: "2022",
    },
    {
        title: "usaco mashups",
        description: "discord bot and static api for building usaco problem mashups.",
        link: gh("usaco_mashups"),
        technologies: [tech("JavaScript")],
        featured: true,
        state: "archived",
        year: 2022,
        years: "2022",
    },
    {
        title: "yttrius",
        description: "my first language, from high school. promised a jit and a wasm bridge. kira is the one that works.",
        link: gh("yttriuslang.c"),
        technologies: [tech("C")],
        featured: true,
        state: "archived",
        year: 2021,
        years: "2021",
    },
];

/** Smaller things: named, linked, nothing more. */
export const alsoProjects: { title: string; link: string }[] = [
    { title: "zerg", link: gh("zerg") },
    { title: "yus", link: gh("yus") },
    { title: "cursor_vfx", link: gh("cursor_vfx") },
    { title: "terminal_anim", link: gh("terminal_anim") },
    { title: "shellnews-bernard", link: gh("ShellNews-Bernard") },
    { title: "swing-plus", link: gh("swing-plus") },
    { title: "kansi", link: gh("kansi") },
    { title: "better_cpu_reader", link: "https://pub.dev/packages/better_cpu_reader" },
];

/**
 * Jackbox has no page of its own; its photographs open in place. Served from
 * the photo bucket: the page shows small copies resized at build time, and each
 * links to the full original.
 */
const JACKBOX_BASE = "https://photos.exoad.net/blog/server-build";
export const jackboxPhotos = [
    { src: `${JACKBOX_BASE}/img3.jpeg`, width: 1843, height: 2457, alt: "jackbox from the front" },
    { src: `${JACKBOX_BASE}/img1.jpg`, width: 3072, height: 4096, alt: "both gpus laid out before assembly" },
    { src: `${JACKBOX_BASE}/img2.jpg`, width: 4096, height: 3072, alt: "jackbox through the tempered glass" },
    { src: `${JACKBOX_BASE}/img4.jpeg`, width: 1638, height: 1229, alt: "the back panel, signed" },
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
