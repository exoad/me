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

