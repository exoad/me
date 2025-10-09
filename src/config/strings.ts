import { SiC, SiCplusplus, SiDart, SiFlutter, SiKotlin, SiOpenjdk, SiMysql, SiAndroid, SiLlvm, SiPython } from 'react-icons/si';

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
        projects: "PROJECTS",
        socials: "SOCIALS"
    },
    name: "Jiaming Meng",
    footer: "© 2025 Jiaming Meng",
    pages: {
        home: {
            tagline: "Building elegant systems with a passion for performance and simplicity",
            scroll_text: "More to see below",
            // currently_working: "Currently working on: Systems programming & compiler optimization",
            subtitles: [
                "Hobbyist Programmer",
                "Full-time University Student",
                "FOSS Advocate",
                "Part-time Upsolver",
                "Systems Tinkerer",
                "Design Minimalist",
                "Graphics Programming Enthusiast",
                "Object-Oriented Gremlin",
                "Tea Connoisseur",
                "Avid Movie Watcher"
            ],
            about: {
                title: "About Me",
                content: "I am Jiaming Meng, a self-taught programmer and full-time university student with a passion for low-level systems programming. My interests extend to mobile and web development, and I'm currently engaged in university research on AL & ML, while exploring compiler design as a personal passion project. Beyond programming, I find inspiration through hiking, photography, and reading fiction.",
                toolkit_title: "My Toolkit",
                technologies: [
                    { name: "C", icon: SiC },
                    { name: "C++", icon: SiCplusplus },
                    { name: "Dart", icon: SiDart },
                    { name: "Flutter", icon: SiFlutter },
                    { name: "Kotlin", icon: SiKotlin },
                    { name: "Java", icon: SiOpenjdk },
                    { name: "LLVM", icon: SiLlvm },
                    { name: "MySQL", icon: SiMysql },
                    { name: "Jetpack Compose", icon: SiAndroid },
                    { name: "Python", icon: SiPython }
                ]
            },
            projects: [
                {
                    title: "Kira",
                    description: "A simple, pragmatic, object-oriented programming language focused on compile-time code generation and native performance.",
                    glow_color: "#d396ff",
                    link: "https://github.com/exoad/kira",
                    technologies: ["Kotlin", "C"]
                },
                {
                    title: "OnTheFly",
                    description: "A cross-platform background utility that uses your custom rules to automatically organize files in real time as they arrive.",
                    glow_color: "#ff6b6b",
                    link: "https://github.com/exoad/on_the_fly",
                    technologies: ["Dart", "Flutter", "Python"]
                },
                {
                    title: "Halcyon",
                    description: "A desktop audio player with a modern UI, engineered for minimal CPU and memory footprint, smooth visualizations, and support for 20+ audio formats.",
                    glow_color: "#4ecdc4",
                    link: "https://github.com/exoad/Halcyon.c",
                    technologies: ["C", "Java", "OpenGL"]
                }
            ],
            projects_title: "Featured Projects",
            view_project_button: "View Project",
            view_all_projects_button: "View All Projects",
            and_more: "And more..."
        }
    }
};

export default strings;
