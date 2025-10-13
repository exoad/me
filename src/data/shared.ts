import { SiC, SiCplusplus, SiDart, SiFlutter, SiKotlin, SiOpenjdk, SiMysql, SiAndroid, SiLlvm, SiPython, SiOpengl, SiJavascript, SiTypescript, SiHtml5, SiGit, SiReact, SiCss3, SiNodedotjs } from 'react-icons/si';
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
    java_swing: { name: "Java Swing", icon: SiOpenjdk, color: "#ED8B00" }
};

export const timeline: TTimelineEntry[] = [
    {
        displayDate: "2018",
        isoDate: "2018-09-01",
        title: "Started Programming Journey",
        description: "Began learning C and C++ through self-study, fascinated by low-level systems programming.",
        technologies: [technologies.c, technologies.cpp]
    },
    {
        displayDate: "2019",
        isoDate: "2019-03-15",
        title: "First Open Source Contribution",
        description: "Contributed to LLVM project, marking the beginning of my involvement in open source development.",
        technologies: [technologies.llvm, technologies.cpp]
    },
    {
        displayDate: "2020",
        isoDate: "2020-08-25",
        title: "University Admission",
        description: "Enrolled in university to pursue Computer Science, balancing academics with personal projects.",
    },
    {
        displayDate: "2021",
        isoDate: "2021-05-10",
        title: "Mobile Development Exploration",
        description: "Discovered Flutter and Dart, building cross-platform applications and expanding my toolkit.",
        technologies: [technologies.flutter, technologies.dart]
    },
    {
        displayDate: "2022",
        isoDate: "2022-01-20",
        title: "AI/ML Research",
        description: "Started university research in Artificial Intelligence and Machine Learning, focusing on practical applications.",
        technologies: [technologies.python]
    },
    {
        displayDate: "2023",
        isoDate: "2023-06-15",
        title: "Compiler Design Passion",
        description: "Began exploring compiler design as a personal passion project, leading to the creation of Kira language.",
        technologies: [technologies.kotlin, technologies.c]
    },
    {
        displayDate: "2024",
        isoDate: "2024-02-28",
        title: "Portfolio Launch",
        description: "Launched this portfolio website, showcasing projects and sharing the journey of continuous learning.",
        technologies: [technologies.typescript, technologies.react, technologies.html, technologies.css]
    }
];

import halcyonProjectLogo from '../assets/images/projects_logos/halcyon.webp';
import kiraProjectLogo from '../assets/images/projects_logos/kira.webp';
import ontheflyProjectLogo from '../assets/images/projects_logos/onthefly.webp';

export const projects: TProject[] = [
    {
        title: "Kira",
        description: "A simple, pragmatic, object-oriented programming language focused on compile-time code generation and native performance.",
        color: "#d396ff",
        link: "https://github.com/exoad/kira",
        technologies: [technologies.kotlin, technologies.c],
        featured: true,
        logo: kiraProjectLogo
    },
    {
        title: "OnTheFly",
        description: "A cross-platform background utility that uses your custom rules to automatically organize files in real time as they arrive.",
        color: "#ff6b6b",
        link: "https://github.com/exoad/on_the_fly",
        technologies: [technologies.dart, technologies.flutter, technologies.python],
        featured: true,
        logo: ontheflyProjectLogo
    },
    {
        title: "Halcyon",
        description: "A desktop audio player with a modern UI, engineered for minimal CPU and memory footprint, smooth visualizations, and support for 20+ audio formats.",
        color: "#4ecdc4",
        link: "https://github.com/exoad/Halcyon.c",
        technologies: [technologies.c, technologies.java, technologies.opengl],
        featured: true,
        logo: halcyonProjectLogo
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
        socials: "SOCIALS"
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
            tagline: "Building software with a passion for simplicity and performance.",
            scroll_text: "More to see below",
            // currently_working: "Currently working on: Systems programming & compiler optimization",
            subtitles: [
                "Hobbyist Programmer",
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
                title: "About Me",
                content: "Hi! I am Jiaming, a hobbyist programmer and full-time university student with a passion for low-level systems. My interests extend to mobile and web development, and I'm currently engaged in university research on AL & ML, while exploring compiler design as a personal passion project. Beyond programming, I find inspiration through hiking, photography, and watching movies.",
                toolkit_title: "My Toolkit",
                technologies: [
                    technologies.c,
                    technologies.cpp,
                    technologies.dart,
                    technologies.flutter,
                    technologies.kotlin,
                    technologies.java,
                    technologies.jetpack_compose,
                    technologies.python,
                ],
                more: "See My Complete Story"
            },
            projects_title: "Featured Projects",
            view_project_button: "View Project",
            view_all_projects_button: "View All Projects",
            // and_more: "And more..."
        },
        about: {
            title: "I am Jiaming,",
            description: "A chronological timeline of my personal and professional milestones.\n💖",
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
        }
    }
};

