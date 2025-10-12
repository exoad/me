import { SiC, SiCplusplus, SiDart, SiFlutter, SiKotlin, SiOpenjdk, SiMysql, SiAndroid, SiLlvm, SiPython, SiOpengl, SiJavascript, SiTypescript, SiHtml5, SiGit, SiReact, SiCss3, SiNodedotjs } from 'react-icons/si';
import { TProject, TTimelineEntry, TTechnology } from '../types';

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

const _timeline: TTimelineEntry[] = [

];

import halcyonProjectLogo from '../assets/images/projects_logos/halcyon.png';
import kiraProjectLogo from '../assets/images/projects_logos/kira.png';
import ontheflyProjectLogo from '../assets/images/projects_logos/onthefly.png';

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
        linkedin: "https://www.linkedin.com/in/jack-meng/"
    },
    navigation: {
        home: "HOME",
        journey: "JOURNEY",
        projects: "PROJECTS",
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
    timeline: _timeline,
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
                ]
            },
            projects_title: "Featured Projects",
            view_project_button: "View Project",
            view_all_projects_button: "View All Projects",
            // and_more: "And more..."
        },
        journey: {
            title: "My Journey",
            description: "A chronological timeline of my personal and professional milestones.\n💖",
        },
        not_found: {
            super: "404",
            title: "Page Not Found",
            description: "The page you're looking for doesn't exist. It might have been moved or deleted.",
            go_back: "Go Back"
        }
    }
};

