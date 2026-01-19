import {
    SiC,
    SiCplusplus,
    SiDart,
    SiFlutter,
    SiKotlin,
    SiOpenjdk,
    SiMysql,
    SiAndroid,
    SiLlvm,
    SiPython,
    SiOpengl,
    SiJavascript,
    SiTypescript,
    SiHtml5,
    SiGit,
    SiReact,
    SiCss3,
    SiNodedotjs,
    SiSnapchat,
    SiPytorch,
} from "react-icons/si";
import type { TProject, TTimelineEntry, TTechnology } from "../types.d.ts";

export const technologies: Record<string, TTechnology> = {
    c: { name: "C", icon: SiC, color: "#a8b9cc" },
    cpp: { name: "C++", icon: SiCplusplus, color: "#00599c" },
    dart: { name: "Dart", icon: SiDart, color: "#00cbb2" },
    flutter: { name: "Flutter", icon: SiFlutter, color: "#64cbf8" },
    kotlin: { name: "Kotlin", icon: SiKotlin, color: "#7f52ff" },
    java: { name: "Java", icon: SiOpenjdk, color: "#ED8B00" },
    llvm: { name: "LLVM", icon: SiLlvm, color: "#8f1d21" },
    mysql: { name: "MySQL", icon: SiMysql, color: "#4479a1" },
    jetpack_compose: {
        name: "Jetpack Compose",
        icon: SiAndroid,
        color: "#3ddc84",
    },
    python: { name: "Python", icon: SiPython, color: "#3776ab" },
    opengl: { name: "OpenGL", icon: SiOpengl, color: "#5586a4" },
    git: { name: "Git", icon: SiGit, color: "#f34f29" },
    javascript: { name: "JavaScript", icon: SiJavascript, color: "#f7df1e" },
    typescript: { name: "TypeScript", icon: SiTypescript, color: "#3178c6" },
    html: { name: "HTML", icon: SiHtml5, color: "#e34f26" },
    react: { name: "React", icon: SiReact, color: "#61dafb" },
    css: { name: "CSS", icon: SiCss3, color: "#264de4" },
    nodejs: { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
    java_swing: { name: "Java Swing", icon: SiOpenjdk, color: "#ED8B00" },
    android: { name: "Android", icon: SiAndroid, color: "#32de84" },
    lens_studio: { name: "Lens Studio", icon: SiSnapchat, color: "#fffc00" },
    torch: { name: "PyTorch", icon: SiPytorch, color: "#ee4c2c" },
};

// months are not accurate, they are solely used for sorting purposes and im too lazy to try and remember the specific months if it is even possible for certain spanning events.
export const timeline: TTimelineEntry[] = [
    {
        displayDate: "August 14, 2006",
        isoDate: "2006-08-14",
        title: "Hello World!",
        description: "I was born...",
    },
    {
        displayDate: "2018",
        isoDate: "2018-09-01",
        title: "First Steps in Programming",
        description:
            "Began messing with Scratch and HTML/CSS/JS to make simple games on the web.",
    },
    // {
    //     displayDate: "2020",
    //     isoDate: "2020-05-15",
    //     title: "A Love for Object-Oriented Programming",
    //     description: "Started learning Java in high school as well as learning to mod Minecraft with Forge.",
    // },
    // {
    //     displayDate: "2021",
    //     isoDate: "2021-01-10",
    //     title: "First Open-Source Contribution",
    //     description: "Started to learn about Git and GitHub and published some on-going small projects to test. I published my high school projects and some Discord bots I was making at the time.",
    // },
    {
        displayDate: "2021",
        isoDate: "2021-02-10",
        title: "Exploring Web Development",
        description:
            "Experimented with Node.js by self-hosting simple web apps, but ultimately decided web development wasn't the right path for me.",
    },
    {
        displayDate: "2021",
        isoDate: "2021-12-20",
        title: "Started learning C and computer systems",
        description:
            "Studied C and computer architecture, building a simple LLVM IR interpreter for basic function calls and arithmetic. Revisited the project later to expand its features.",
    },
    {
        displayDate: "2021",
        isoDate: "2022-01-10",
        title: "VEX Robotics",
        description:
            "Joined VEX Robotics Team 1569A Omega, where I learned control systems, strategy, and advanced my C++ skills. We placed top 25 globally at the 2022 VEX Robotics World Championship in Dallas.",
    },
    {
        displayDate: "2022",
        isoDate: "2022-05-15",
        title: "A Year Long Passion Project: Halcyon",
        description:
            "Developed a cross-platform OpenGL graphics library in C with audio and logic in Java. My first experience with advanced graphics programming, completed over the course of a year.",
    },
    // {
    //     displayDate: "2022",
    //     isoDate: "2022-08-20",
    //     title: "Baby Upsolver",
    //     description: "Began intereted in competitive programming and problem solving. I started doing problems on Codeforces and Codechef and studied algorithms and data structures on the side. I would eventually pause this journey to once again focus on projects and outside interests.",
    // },
    // {
    //     displayDate: "2023",
    //     isoDate: "2023-01-10",
    //     title: "Dart & Flutter",
    //     description: "Started learning Dart & Flutter to make cross-platform applications. I was drawn to the simplicity of the language and the ease of use of Flutter. I would later use this knowledge to remake Halcyon and countless other apps.",
    // },
    // {
    //     displayDate: "2023",
    //     isoDate: "2023-05-15",
    //     title: "Began to standardize my code",
    //     description: "I began to clean up code I have written not just stylistically, but semantically thru creating multiple shared libraries across languages for me to use. I also started to formulate my own best practices for Java, C, and Dart.",
    // },
    {
        displayDate: "2024",
        isoDate: "2024-01-10",
        title: "FRC Robotics",
        description:
            "Joined FRC Team 2638, where I built a Flutter-based scouting app that reached 10,000+ global downloads. Our team later competed at the 2024 FRC World Championship in Houston.",
    },
    {
        displayDate: "2024",
        isoDate: "2024-03-15",
        title: "Started University",
        description:
            "Began as a Computer Science major at Penn State before transferring to the University of Maryland, College Park for stronger research opportunities and location.",
    },
    {
        displayDate: "2025",
        isoDate: "2025-08-20",
        title: "A New Beginning",
        description:
            "Transferred to the University of Maryland, College Park as a sophomore, where I built connections with faculty and peers and began research in AI/ML.",
    },
    // {
    //     displayDate: "October 2025",
    //     isoDate: "2024-10-02",
    //     title: "Published My Website",
    //     description: "Went back to my roots and spent a weekend building and designing my personal website from scratch using React, TypeScript, and TailwindCSS. With the help of AI, I was able to polish the UI design to my liking.",
    // },
    {
        displayDate: "October 2025",
        isoDate: "2025-10-19",
        title: "Joined Startup Shell",
        description:
            "I joined Startup Shell, a student run startup incubator at UMD.",
        link: "https://startupshell.org/",
    },
].sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()); // this is just a safety measure to ensure it is always sorted correctly especially since im bad with chronological events :(

// definitely not the best way to do this LOL but idk
// coded this up at like midngith so :')
import halcyonProjectLogo from "../assets/images/projects_logos/halcyon.webp";
import kiraProjectLogo from "../assets/images/projects_logos/kira.webp";
import ontheflyProjectLogo from "../assets/images/projects_logos/onthefly.webp";
import filewatchProjectLogo from "../assets/images/projects_logos/filewatch.webp";
import softwareRasterizerLogo from "../assets/images/projects_logos/software_rasterizer.webp";
import windowedFileReaderLogo from "../assets/images/projects_logos/windowed_file_reader.webp";
import nukleonLogo from "../assets/images/projects_logos/nukleon.webp";
import onlyHeadingsLogo from "../assets/images/projects_logos/onlyheadings.webp";
import toasterifyLogo from "../assets/images/projects_logos/toasterify.webp";
import prismixLogo from "../assets/images/projects_logos/prismix.webp";
import moriLogo from "../assets/images/projects_logos/mori.webp";

export const projects: TProject[] = [
    {
        title: "Kira",
        description:
            "A modern object oriented programming language focused on simplicity and maintainability.",
        color: "#d396ff",
        link: "https://exoad.github.io/kira_lang/",
        technologies: [technologies.kotlin, technologies.c],
        featured: true,
        logo: kiraProjectLogo,
        state: "active",
    },
    {
        title: "Halcyon",
        description:
            "A desktop audio player with a modern UI supporting for over 20 audio formats supported across all major operating systems.",
        color: "#4ecdc4",
        link: "https://exoad.github.io/Halcyon.github/",
        technologies: [technologies.c, technologies.java, technologies.opengl],
        featured: true,
        demoImage:
            "https://github.com/exoad/Halcyon.c/blob/master/repo/img/upload.png?raw=true",
        logo: halcyonProjectLogo,
        state: "archived",
    },
    {
        title: "Mori",
        description:
            "A website that shows your finite life span, so why not watch it disappear. Or watch how much more sleep you have left and more...",
        color: "#cf6e29",
        link: "https://exoad.github.io/mori/",
        technologies: [technologies.react, technologies.typescript],
        demoImage:
            "https://cdn.jsdelivr.net/gh/meng-jack/me-pictures-bucket@main/Screenshot_2-11-2025_202550_exoad.github.io.jpeg",
        featured: false,
        logo: moriLogo,
        state: "finished",
    },
    {
        title: "software_3d",
        description:
            "A software based 3D renderer that simulates the graphics pipeline entirely on the CPU. It supports basic 3D model loading, transformations, and rasterization with depth buffering. Make the CPU Great Again!",
        color: "#ff6f59",
        link: "https://github.com/exoad/software_3d",
        technologies: [technologies.c],
        demoImage:
            "https://github.com/exoad/software_3d/raw/main/repo/screenshot_10.png",
        state: "active",
        featured: false,
    },
    {
        title: "Prosodia-Seq",
        description:
            "A lightweight system that maps English phoneme sequences to context-aware Mandarin pinyin. It blends a seq2seq model with a rule-based resolver to refine outputs and provide confidence and approximation metadata.",
        color: "#6b5b95",
        link: "https://github.com/exoad/Prosodia-Seq",
        technologies: [technologies.python, technologies.torch],
        featured: false,
        state: "finished",
    },
    {
        title: "ShipDSL",
        description:
            "A DSL for forming simple scripts. It uses brace-based syntax {} for blocks, supports conditional execution with if/elif/else, and distinguishes between built-in tags and custom tasks using the $ prefix.",
        color: "#ff7b25",
        link: "https://github.com/exoad/ship",
        technologies: [technologies.python],
        featured: false,
        state: "finished",
    },
    {
        title: "Lair33",
        description:
            "A horror game focused around exploring a temporal shifting megastructure. Based on Doom 64 mechanics built in C and entirely running on the CPU.",
        color: "#7f8c8d",
        link: "https://github.com/exoad/Lair133",
        technologies: [technologies.c],
        featured: false,
        demoImage:
            "https://github.com/meng-jack/me-pictures-bucket/blob/main/2025-11-06%2013_24_47-Friends%20-%20Discord.png?raw=true",
        state: "archived",
    },
    {
        title: "OnTheFly",
        description:
            "A cross-platform background utility that uses your custom rules to automatically organize files in real time as they arrive.",
        color: "#ff6b6b",
        link: "https://github.com/exoad/on_the_fly",
        technologies: [technologies.flutter, technologies.python],
        featured: true,
        demoImage:
            "https://github.com/exoad/on_the_fly/raw/master/repo/sc_1.png?raw=true",
        logo: ontheflyProjectLogo,
        state: "finished",
    },
    {
        title: "Filewatch",
        description:
            "A desktop that automates your file organization with file format conversion, file renaming, file moving, and more. All within a builtin scriptless visual workflow builder.",
        color: "#d7463f",
        link: "https://github.com/exoad/Filewatch",
        technologies: [technologies.kotlin],
        featured: false,
        logo: filewatchProjectLogo,
        state: "archived",
    },
    {
        title: "GTFO-RundownRoulette",
        description:
            "A fully custom randomization tool for the co-op horror shooter GTFO on Steam, designed to inject fresh variety into every run. Built from scratch, the application also faithfully recreates the game's canonical design system.",
        color: "#ffbb02",
        link: "https://github.com/exoad/GTFO-RundownRoulette",
        technologies: [technologies.flutter],
        featured: false,
        demoImage:
            "https://github.com/exoad/GTFO-RundownRoulette/raw/main/repository/screenshot2.png",
        state: "archived",
    },
    {
        title: "software_rasterizer",
        description:
            "A simple CPU based rasterizer that tries to simulate the hardware workload of rendering 3D geometry entirely thru software.",
        color: "#58e4d0",
        link: "https://github.com/exoad/software_rasterizer",
        technologies: [technologies.c],
        logo: softwareRasterizerLogo,
        featured: false,
        state: "finished",
    },
    {
        title: "windowed_file_reader",
        description:
            "An efficient file reader that uses a sliding window to chunk up large files and parse them fast.",
        color: "#73aad5",
        link: "https://github.com/exoad/windowed_file_reader",
        technologies: [technologies.dart],
        logo: windowedFileReaderLogo,
        featured: false,
        state: "finished",
    },
    {
        title: "Visus",
        description:
            "An AR weather applet that visualized the weather around you in the future and for other locations.",
        color: "#ffad4a",
        link: "https://github.com/exoad/visus",
        demoImage:
            "https://cdn.jsdelivr.net/gh/meng-jack/me-pictures-bucket@main/visus_sc.png",
        featured: false,
        technologies: [technologies.lens_studio, technologies.javascript],
        state: "finished",
    },
    {
        title: "Nukleon",
        description:
            "A 2D automation & management game about nuclear power taking place within an Orwellian Society. It is with a custom sprite packer along with a custom graphics layer ontop of Flutter.",
        link: "https://github.com/exoad/nukleon",
        logo: nukleonLogo,
        technologies: [technologies.flutter, technologies.c],
        color: "#d1cdb5",
        featured: false,
        state: "active",
    },
    {
        title: "Toasterify",
        description:
            "A mobile app that warms up your hands using your phone so you don't freeze your hands off in the deep winter.",
        color: "#f7b811",
        logo: toasterifyLogo,
        link: "https://github.com/exoad/toasterify",
        demoImage:
            "https://github.com/exoad/toasterify/raw/main/repo/screenshot.png",
        featured: false,
        technologies: [technologies.android, technologies.flutter],
        state: "finished",
    },
    {
        title: "Halite",
        description:
            "A data driven configuration engine for Java applications to safely handle key-value based property registries. It features customizable type checking and easy use with either implicit handling or through Java Reflection",
        link: "https://github.com/exoad/Halite.java",
        color: "#000000",
        technologies: [technologies.java],
        featured: false,
        state: "finished",
    },
    {
        title: "big_double.dart",
        description:
            "An implementation of break_infinity in Dart to allow for storing numbers upwards of 10^10^308 in magnitude with close to native performance.",
        link: "https://github.com/exoad/big_double.dart",
        color: "#000000",
        featured: false,
        technologies: [technologies.dart],
        state: "finished",
    },
    {
        title: "Prismix",
        description:
            "A tool for curating color palettes and inspecting values of colors and related colors all within a custom GUI toolkit.",
        link: "https://github.com/exoad/prismix",
        logo: prismixLogo,
        color: "#ec4c84",
        demoImage:
            "https://github.com/exoad/prismix/raw/master/repo/screenshot.png",
        technologies: [technologies.java, technologies.kotlin],
        state: "finished",
        featured: false,
    },
    {
        title: "ansicolor",
        description:
            "A ANSI text color stylizer for terminal applications written in Java. It created a natural way to produce colored console text.",
        color: "#000000",
        link: "https://github.com/exoad/ansicolor",
        technologies: [technologies.java],
        state: "finished",
        featured: false,
    },
    {
        title: "cpp-runner",
        description:
            "Run C++ code via JavaScript by compiling on the fly without much safety besides execution time limit.",
        color: "#0000000",
        link: "https://github.com/exoad/cpp-runner",
        technologies: [technologies.nodejs, technologies.javascript],
        state: "finished",
        featured: false,
    },
    {
        title: "OnlyHeadings",
        description: "A simple offline compass & gyscope app for Android.",
        link: "https://github.com/exoad/onlyheadings",
        color: "#ff0000",
        logo: onlyHeadingsLogo,
        demoImage:
            "https://github.com/exoad/onlyheadings/raw/master/repository/screenshot1.jpg",
        featured: false,
        technologies: [technologies.android, technologies.flutter],
        state: "finished",
    },
    {
        title: "USACO Mashup Bot",
        description:
            "A Discord Bot and web scraper that established a static API with the USACO.org website. The Discord bot allows users to see all live problems while hosters can scrape and use the data accordingly.",
        link: "https://github.com/exoad/usaco_mashups",
        color: "#f7c6ff",
        demoImage:
            "https://github.com/exoad/usaco_mashups/raw/master/repo/img/bitmap.png",
        featured: false,
        technologies: [
            technologies.java,
            technologies.javascript,
            technologies.nodejs,
        ],
        state: "finished",
    },
    {
        title: "Rebels Scouting App 2024 'Argus'",
        description:
            "The scouting app created by team 2638 Rebel Robotics for the 2024 FRC Game CRESCENDO.",
        featured: false,
        state: "finished",
        link: "https://github.com/rebels2638/ScoutingApp2024",
        color: "#000000",
        technologies: [technologies.flutter, technologies.android],
        logo: "https://github.com/rebels2638/ScoutingApp2024/raw/master/repo/assets/logo.png",
        demoImage: "https://rebels2638.github.io/ArgusGuide/images/Home.png",
    },
    {
        title: "com.jackmeng",
        description:
            "My standard library/toolkit for JVM environments. It features 30+ utilities for dealing from graph algorithms to Java Swing helpers.",
        link: "https://github.com/exoad/com.jackmeng",
        featured: false,
        color: "#000000",
        technologies: [technologies.kotlin, technologies.java],
        state: "archived",
    },
    {
        title: "f_off",
        description:
            "Small browser extension to completely hide Discord messages from blocked users.",
        link: "https://github.com/exoad/f_off",
        color: "#000000",
        featured: false,
        technologies: [technologies.javascript],
        state: "finished",
    },
];

export const featuredProjects = projects.filter((project) => project.featured);

export const strings = {
    header: {
        names_funny: [
            ["Jiaming", "#ffffffb2"],
            ["Jack", "#fcb438b2"],
            ["exoad", "#11fa95b2"],
        ],
    },
    stalk: {
        city: "New York City",
        state: "NY",
    },
    links: {
        github: "https://github.com/exoad",
        github_aria: "My GitHub Profile",
        linkedin: "https://www.linkedin.com/in/jack-meng/",
        linkedin_aria: "My LinkedIn Profile",
    },
    navigation: {
        home: "HOME",
        about: "ABOUT",
        projects: "PROJECTS",
        photos: "PHOTOS",
        contact: "CONTACT",
        mobile_menu: {
            title: "Menu",
        },
    },
    name: "Jiaming Meng",
    footer: {
        legals: "© 2025 Jiaming Meng\nAll rights reserved.",
        site: "EXOAD.NET",
        source: {
            leading: "Source Code:",
            url: "https://github.com/exoad/me",
            url_attr: "github.com/exoad/me",
        },
        pointer: "🛐🤺",
    },
    timeline: timeline,
    pages: {
        home: {
            tagline: "Compilers • Computer Architecture • Open Source",
            scroll_text: "More to see below",
            subtitles: [
                "Hobbyist Developer",
                "Full-time University Student",
                "Open-Source Enthusiast",
                "AI/ML Researcher",
                "Libre design Advocate",
                "Part-time Upsolver",
                "Design Minimalist",
                "Casual Photographer",
                "Avid Movie Watcher",
            ],
            about: {
                content:
                    "I'm Jiaming, a university student and hobbyist programmer passionate about low-level systems. I spend a lot of time making hobbyist open source projects and generally just fool around with systems. I research AI & ML, and tinker with compiler design. Outside of code, I enjoy hiking, photography, and movies.",
                toolkit_title: "I Use:",
                technologies: [
                    technologies.c,
                    technologies.cpp,
                ],
                more: "Learn More About Me",
                cool_photos: "See Some Cool Photos",
            },
            projects_title: "Featured Projects",
            view_project_button: "View Project",
            view_all_projects_button: "View All Projects",
            // and_more: "And more..."
        },
        about: {
            title: "I am Jiaming,",
            description:
                "A chronological timeline of my personal and professional milestones.\n💖",
            currently: {
                title: "Currently",
                content:
                    "2nd year Undergraduate student at the University of Maryland - College Park.",
            },
        },
        projects: {
            title: {
                prompt: "Projects",
                figure: "What I Have Built",
                label: "Built with my passion to enjoy learning novel concepts and creating libre solutions.",
            },
            project: {
                view_project: "Visit Project",
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
            title: "Photos Showcase",
            description:
                "A collection of photos that I have captured as a hobbyist photographer and deemed worthy of sharing :).",
            error: "Couldn't load this image. :(.",
        },
        contact: {
            title: "Get in Touch",
            description:
                "Feel free to reach out via email or connect with me on any of the following platforms! :)",
            email: "jackm@exoad.net",
            email_aria: "Send me an email",
            github: "exoad",
            github_aria: "My GitHub Profile",
            resume: {
                aria: "View my resume (PDF)",
                button_label: "Download My Resume",
                updated: "PDF, updated Oct 2025",
            },
        },
        under_construction: {
            title: "Under Construction",
            description:
                "This page is being worked on, please check back later! :)",
        },
    },
};
