import { strings } from "../data/shared.ts";
import Scaffold from "../components/Scaffold.tsx";
import SEO from "../components/SEO.tsx";
import WarpTunnelBg from "../components/WarpTunnelBg";
import profilePic from "../assets/images/profile_image.webp";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiGithub, SiLinkedin } from "react-icons/si";
import AttentionButton from "../components/AttentionButton";

export default function HomePage({ scaffoldProps = {} }) {
    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        if (window.scrollY > 0) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const navigate = useNavigate();
    return (
        <Scaffold {...scaffoldProps} skipFooter={true}>
            <SEO title="Home" description={strings.pages.home.about.content} />
            <div className="relative h-[100dvh] overflow-hidden bg-black flex items-center justify-center px-4 sm:px-8 md:px-16 pt-16">
                <WarpTunnelBg scrollY={scrollY} />
                <div className="flex flex-col md:flex-row items-center gap-8 z-10 max-w-4xl mx-auto">
                    <img
                        src={profilePic}
                        alt="Profile"
                        className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-cover"
                        draggable={false}
                    />
                    <div className="flex flex-col gap-4 text-center md:text-left">
                        <h1
                            className="font-bold text-4xl md:text-6xl lg:text-7xl font-playfair whitespace-nowrap leading-loose"
                            style={{
                                background:
                                    "linear-gradient(to bottom, #ffffff, #a0a0a0)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {strings.name}
                        </h1>
                        <p className="text-white text-lg md:text-xl font-montserrat">
                            {strings.pages.home.tagline}
                        </p>
                        <hr className="border-white/30 my-2 w-2/3 mx-auto md:w-full md:mx-0" />
                        <p className="text-white text-base md:text-lg font-light leading-relaxed font-montserrat max-w-md">
                            {strings.pages.home.about.content}
                        </p>
                        <p className="text-white text-base md:text-lg font-light font-montserrat mt-4">
                            Currently building{" "}
                            <a
                                href="https://drosk.net/"
                                className="font-bold underline hover:no-underline font-playfair"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Drosk
                            </a>
                            .
                        </p>
                        <hr className="border-white/30 my-2 w-2/3 mx-auto md:w-full md:mx-0" />
                        <div className="flex gap-4 mt-4 justify-center md:justify-start">
                            <AttentionButton
                                onClick={() => navigate("/projects")}
                                noUnderline={true}
                                className="px-6 py-3 text-white font-semibold border-b-2 border-white hover:border-b-4 transition group-hover:scale-100"
                            >
                                View Projects
                            </AttentionButton>
                            <AttentionButton
                                onClick={() => navigate("/contact")}
                                noUnderline={true}
                                className="px-6 py-3 text-white font-semibold border-b-2 border-white hover:border-b-4 transition group-hover:scale-100"
                            >
                                Contact Me
                            </AttentionButton>
                        </div>
                        <div className="flex gap-4 mt-2 justify-center md:justify-start">
                            <a
                                href={strings.links.github}
                                aria-label={strings.links.github_aria}
                                className="text-white hover:text-gray-300 transition"
                            >
                                <SiGithub size={24} />
                            </a>
                            <a
                                href={strings.links.linkedin}
                                aria-label={strings.links.linkedin_aria}
                                className="text-white hover:text-gray-300 transition"
                            >
                                <SiLinkedin size={24} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Scaffold>
    );
}
