import { SiC, SiCplusplus, SiDart, SiFlutter, SiKotlin, SiOpenjdk, SiMysql, SiAndroid, SiLlvm, SiPython, SiOpengl, SiJavascript, SiTypescript, SiHtml5, SiGit, SiReact, SiCss3, SiNodedotjs, SiSnapchat } from 'react-icons/si';
import type { TProject, TTimelineEntry, TTechnology } from '../types.d.ts';

export const technologies: Record<string, TTechnology> = {
    c: { name: "C", icon: SiC, color: "#a8b9cc" },
    cpp: { name: "C++", icon: SiCplusplus, color: "#00599c" },
    dart: { name: "Dart", icon: SiDart, color: "#00cbb2" },
    flutter: { name: "Flutter", icon: SiFlutter, color: "#64cbf8" },
    kotlin: { name: "Kotlin", icon: SiKotlin, color: "#7f52ff" },
    java: { name: "Java", icon: SiOpenjdk, color: "#ED8B00" },
    llvm: { name: "LLVM", icon: SiLlvm, color: "#8f1d21" },
    mysql: { name: "MySQL", icon: SiMysql, color: "#4479a1" },
    jetpack_compose: { name: "Jetpack Compose", icon: SiAndroid, color: "#3ddc84" },
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
    lens_studio: { name: "Lens Studio", icon: SiSnapchat, color: "#fffc00" }
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
        description: "Began messing with Scratch and HTML/CSS/JS to make simple games on the web.",
    },
    {
        displayDate: "2020",
        isoDate: "2020-05-15",
        title: "A Love for Object-Oriented Programming",
        description: "Started learning Java in high school as well as learning to mod Minecraft with Forge.",
    },
    {
        displayDate: "2021",
        isoDate: "2021-01-10",
        title: "First Open-Source Contribution",
        description: "Started to learn about Git and GitHub and published some on-going small projects to test. I published my high school projects and some Discord bots I was making at the time.",
    },
    {
        displayDate: "2021",
        isoDate: "2021-02-10",
        title: "Exploring Web Development",
        description: "Dabbed a little bit in with NodeJS and hosting simple web apps off of my own machine. It was also around this time I decided that web development was not for me due to costs and lack of interest.",
    },
    {
        displayDate: "2021",
        isoDate: "2021-12-20",
        title: "Started learning C and computer systems",
        description: "I became fascinated by how computers work, I studied the C programming language and computer architecture as well writing a simple LLVM IR interpreter that handled basic function calls and arithmetic. I would later revisit this project in the coming years to add more features.",
    },
    {
        displayDate: "2021",
        isoDate: "2022-01-10",
        title: "VEX Robotics",
        description: "Joined VEX Robotics team: 1569A Omega. I began to learn about control systems, strategy, and advancing my knowledge of C++. We would later place top 25 in the world at the VEX Robotics World Championship 2022 @ Dallas, TX.",
    },
    {
        displayDate: "2022",
        isoDate: "2022-05-15",
        title: "A Year Long Passion Project: Halcyon",
        description: "Wrote a cross platform OpenGL graphics library in C with the audio and logic being handled by Java. This was my first time doing any kind of advanced graphics programming and it was a fun ride, but the complexity and burnout got to me after a year.",
    },
    {
        displayDate: "2022",
        isoDate: "2022-08-20",
        title: "Baby Upsolver",
        description: "Began intereted in competitive programming and problem solving. I started doing problems on Codeforces and Codechef and studied algorithms and data structures on the side. I would eventually pause this journey to once again focus on projects and outside interests.",
    },
    {
        displayDate: "2023",
        isoDate: "2023-01-10",
        title: "Dart & Flutter",
        description: "Started learning Dart & Flutter to make cross-platform applications. I was drawn to the simplicity of the language and the ease of use of Flutter. I would later use this knowledge to remake Halcyon and countless other apps.",
    },
    {
        displayDate: "2023",
        isoDate: "2023-05-15",
        title: "Began to standardize my code",
        description: "I began to clean up code I have written not just stylistically, but semantically thru creating multiple shared libraries across languages for me to use. I also started to formulate my own best practices for Java, C, and Dart.",
    },
    {
        displayDate: "2024",
        isoDate: "2024-01-10",
        title: "FRC Robotics",
        description: "Joined FRC Robotics team: 2638. This was my first time working with a larger team and I was tasked with using my Flutter knowledge and previous experience to create a streamlined scouting app for our team. We would publish this app and get over 10,000+ downloads globally. We would later go on to compete at the FRC World Championship 2024 @ Houston, TX.",
    },
    {
        displayDate: "2024",
        isoDate: "2024-03-15",
        title: "Started University",
        description: "I first attended The Pennsylvania State University as a Computer Science major. I was exposed to a lot of new opportunities, but I would later transfer to the University of Maryland - College Park due to better research opportunities and location.",
    },
    {
        displayDate: "2025",
        isoDate: "2024-08-20",
        title: "A New Beginning",
        description: "Transferred to the University of Maryland - College Park and started off my Sophomore year fresh. I quickly began building connections with professors and peers and started research in AI/ML.",
    },
    {
        displayDate: "October 2025",
        isoDate: "2024-10-02",
        title: "Published My Website",
        description: "Went back to my roots and spent a weekend building and designing my personal website from scratch using React, TypeScript, and TailwindCSS. With the help of AI, I was able to polish the UI design to my liking.",
    }
].sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()); // this is just a safety measure to ensure it is always sorted correctly especially since im bad with chronological events :(

// definitely not the best way to do this LOL but idk
// coded this up at like midngith so :')
import halcyonProjectLogo from '../assets/images/projects_logos/halcyon.webp';
import kiraProjectLogo from '../assets/images/projects_logos/kira.webp';
import ontheflyProjectLogo from '../assets/images/projects_logos/onthefly.webp';
import filewatchProjectLogo from '../assets/images/projects_logos/filewatch.webp';
import softwareRasterizerLogo from '../assets/images/projects_logos/software_rasterizer.webp';
import windowedFileReaderLogo from "../assets/images/projects_logos/windowed_file_reader.webp";
import nukleonLogo from "../assets/images/projects_logos/nukleon.webp";
import onlyHeadingsLogo from "../assets/images/projects_logos/onlyheadings.webp";
import toasterifyLogo from "../assets/images/projects_logos/toasterify.webp";
import prismixLogo from "../assets/images/projects_logos/prismix.webp";

export const projects: TProject[] = [
    {
        title: "Kira",
        description: "A simple, pragmatic, object-oriented programming language focused on compile-time code generation and native performance.",
        color: "#d396ff",
        link: "https://github.com/exoad/kira",
        technologies: [technologies.kotlin, technologies.c],
        featured: true,
        logo: kiraProjectLogo,
        state: "active",
    },
    {
        title: "OnTheFly",
        description: "A cross-platform background utility that uses your custom rules to automatically organize files in real time as they arrive.",
        color: "#ff6b6b",
        link: "https://github.com/exoad/on_the_fly",
        technologies: [technologies.dart, technologies.flutter, technologies.python],
        featured: true,
        demoImage: "https://github.com/exoad/on_the_fly/raw/master/repo/sc_1.png?raw=true",
        logo: ontheflyProjectLogo,
        state: "finished",
    },
    {
        title: "Halcyon",
        description: "A desktop audio player with a modern UI, engineered for minimal CPU and memory footprint, smooth visualizations, and support for 20+ audio formats.",
        color: "#4ecdc4",
        link: "https://exoad.github.io/Halcyon.github/",
        technologies: [technologies.c, technologies.java, technologies.opengl],
        featured: true,
        demoImage: "https://github.com/exoad/Halcyon.c/blob/master/repo/img/upload.png?raw=true",
        logo: halcyonProjectLogo,
        state: "archived",
    },
    {
        title: "Filewatch",
        description: "A desktop that automates your file organization with file format conversion, file renaming, file moving, and more. All within a builtin scriptless visual workflow builder.",
        color: "#d7463f",
        link: "https://github.com/exoad/Filewatch",
        technologies: [technologies.kotlin],
        featured: false,
        logo: filewatchProjectLogo,
        state: "active"
    },
    {
        title: "GTFO-RundownRoulette",
        description: "A fully custom randomization tool for the co-op horror shooter GTFO on Steam, designed to inject fresh variety into every run. Built from scratch, the application also faithfully recreates the game's canonical design system.",
        color: "#ffbb02",
        link: "https://github.com/exoad/GTFO-RundownRoulette",
        technologies: [technologies.flutter, technologies.dart],
        featured: false,
        demoImage: "https://github.com/exoad/GTFO-RundownRoulette/raw/main/repository/screenshot2.png",
        state: "archived",
    },
    {
        title: "software_rasterizer",
        description: "A simple CPU based rasterizer that tries to simulate the hardware workload of rendering 3D geometry entirely thru software.",
        color: "#58e4d0",
        link: "https://github.com/exoad/software_rasterizer",
        technologies: [technologies.c],
        logo: softwareRasterizerLogo,
        featured: false,
        state: "finished",
    },
    {
        title: "windowed_file_reader",
        description: "An efficient file reader that uses a sliding window to chunk up large files and parse them fast.",
        color: "#73aad5",
        link: "https://github.com/exoad/windowed_file_reader",
        technologies: [technologies.dart],
        logo: windowedFileReaderLogo,
        featured: false,
        state: "finished"
    },
    {
        title: "Visus",
        description: "An AR weather applet that visualized the weather around you in the future and for other locations.",
        color: "#ffad4a",
        link: "https://github.com/exoad/visus",
        demoImage: "https://exoad.github.io/me-pictures-bucket/visus_sc.png",
        featured: false,
        technologies: [technologies.lens_studio, technologies.javascript],
        state: "finished",
    },
    {
        title: "Nukleon",
        description: "A 2D automation & management game about nuclear power taking place within an Orwellian Society. It is with a custom sprite packer along with a custom graphics layer ontop of Flutter.",
        link: "https://github.com/exoad/nukleon",
        logo: nukleonLogo,
        technologies: [technologies.dart, technologies.flutter, technologies.c],
        color: "#d1cdb5",
        featured: false,
        state: "active"
    },
    {
        title: "Toasterify",
        description: "A mobile app that warms up your hands using your phone so you don't freeze your hands off in the deep winter.",
        color: "#f7b811",
        logo: toasterifyLogo,
        link: "https://github.com/exoad/toasterify",
        demoImage: "https://github.com/exoad/toasterify/raw/main/repo/screenshot.png",
        featured: false,
        technologies: [technologies.android, technologies.flutter, technologies.dart],
        state: "finished"
    },
    {
        title: "Halite",
        description: "A data driven configuration engine for Java applications to safely handle key-value based property registries. It features customizable type checking and easy use with either implicit handling or through Java Reflection",
        link: "https://github.com/exoad/Halite.java",
        color: "#000000",
        technologies: [technologies.java],
        featured: false,
        state: "finished"
    },
    {
        title: "big_double.dart",
        description: "An implementation of break_infinity in Dart to allow for storing numbers upwards of 10^10^308 in magnitude with close to native performance.",
        link: "https://github.com/exoad/big_double.dart",
        color: "#000000",
        featured: false,
        technologies: [technologies.dart],
        state: "finished",
    },
    {
        title: "Prismix",
        description: "A tool for curating color palettes and inspecting values of colors and related colors all within a custom GUI toolkit.",
        link: "https://github.com/exoad/prismix",
        logo: prismixLogo,
        color: "#ec4c84",
        demoImage: "https://github.com/exoad/prismix/raw/master/repo/screenshot.png",
        technologies: [technologies.java, technologies.kotlin],
        state: "finished",
        featured: false
    },
    {
        title: "ansicolor",
        description: "A ANSI text color stylizer for terminal applications written in Java. It created a natural way to produce colored console text.",
        color: "#000000",
        link: "https://github.com/exoad/ansicolor",
        technologies: [technologies.java],
        state: "finished",
        featured: false
    },
    {
        title: "cpp-runner",
        description: "Run C++ code via JavaScript by compiling on the fly without much safety besides execution time limit.",
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
        demoImage: "https://github.com/exoad/onlyheadings/raw/master/repository/screenshot1.jpg",
        featured: false,
        technologies: [technologies.android, technologies.flutter, technologies.dart],
        state: "finished"
    },
    {
        title: "USACO Mashup Bot",
        description: "A Discord Bot and web scraper that established a static API with the USACO.org website. The Discord bot allows users to see all live problems while hosters can scrape and use the data accordingly.",
        link: "https://github.com/exoad/usaco_mashups",
        color: "#f7c6ff",
        demoImage: "https://github.com/exoad/usaco_mashups/raw/master/repo/img/bitmap.png",
        featured: false,
        technologies: [technologies.java, technologies.javascript, technologies.nodejs],
        state: "finished"
    },
    {
        title: "com.jackmeng",
        description: "My standard library/toolkit for JVM environments. It features 30+ utilities for dealing from graph algorithms to Java Swing helpers.",
        link: "https://github.com/exoad/com.jackmeng",
        featured: false,
        color: "#000000",
        technologies: [technologies.kotlin, technologies.java],
        state: "archived"
    }
];

export const featuredProjects = projects.filter((project) => project.featured);

export const strings = {
    header: {
        names_funny: [
            ["Jiaming", "#ffffffb2"],
            ["Jack", "#fcb438b2"],
            ["exoad", "#11fa95b2"]
        ]
    },
    stalk: [
        {
            city: "New York City",
            state: "NY",
        },
        {
            city: "Washington D.C.",
        }
    ],
    links: {
        github: "https://github.com/exoad",
        github_aria: "My GitHub Profile",
        linkedin: "https://www.linkedin.com/in/jack-meng/",
        linkedin_aria: "My LinkedIn Profile"
    },
    navigation: {
        home: "HOME",
        about: "ABOUT",
        projects: "PROJECTS",
        photos: "PHOTOS",
        contact: "CONTACT"
    },
    name: "Jiaming Meng",
    footer: {
        legals: "© 2025 Jiaming Meng\nAll rights reserved.",
        site: "EXOAD.NET",
        source: {
            leading: "Source Code:",
            url: "https://github.com/exoad/me",
            url_attr: "github.com/exoad/me"
        },
        thank_you: "Thank you for visiting :)"
    },
    timeline: timeline,
    pages: {
        home: {
            tagline: "Mobile Dev • Compilers • Computer Architecture",
            scroll_text: "More to see below",
            // currently_working: "Currently working on: Systems programming & compiler optimization",
            subtitles: [
                "Hobbyist Developer",
                "Full-time University Student",
                "Open-Source Enthusiast",
                "AI/ML Researcher",
                "Part-time Upsolver",
                "Design Minimalist",
                "Tea Connoisseur",
                "Casual Photographer",
                "Avid Movie Watcher"
            ],
            about: {
                content: "I'm Jiaming, a university student and hobbyist programmer passionate about low-level systems. I explore mobile and web development, research AI & ML, and tinker with compiler design. Outside of code, I enjoy hiking, photography, and movies.",
                toolkit_title: "I Use:",
                technologies: [
                    technologies.c,
                    technologies.cpp,
                    technologies.flutter,
                    technologies.kotlin,
                    technologies.java,
                    technologies.python,
                ],
                more: "Learn More About Me",
                cool_photos: "See Some Cool Photos"
            },
            projects_title: "Featured Projects",
            view_project_button: "View Project",
            view_all_projects_button: "View All Projects",
            // and_more: "And more..."
        },
        about: {
            title: "I am Jiaming,",
            description: "A chronological timeline of my personal and professional milestones.\n💖",
            currently: {
                title: "Currently",
                content: "2nd year Undergraduate student at the University of Maryland - College Park."
            },
        },
        projects: {
            project: {
                view_project: "Visit Project"
            }
        },
        not_found: {
            super: "404",
            title: "Page Not Found",
            description: "The page you're looking for doesn't exist. It might have been moved or deleted.",
            go_back: "Go Back"
        },
        photos: {
            title: "Photos Showcase",
            description: "A collection of photos that I have captured as a hobbyist photographer and deemed worthy of sharing :).",
            error: "Couldn't load this image. :(.",
        },
        contact: {
            title: "Get in Touch",
            description: "Feel free to reach out via email or connect with me on any of the following platforms! :)",
            email: "jackm@exoad.net",
            email_aria: "Send me an email",
            github: "exoad",
            github_aria: "My GitHub Profile",
            resume: {
                title: "My Resume",
                aria: "Download my resume (PDF)",
                button_label: "Download Resume",
                updated: "PDF, updated Oct 2025"
            }
        },
        under_construction: {
            title: "Under Construction",
            description: "This page is being worked on, please check back later! :)",
        }
    }
};

