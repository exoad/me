import { strings, featuredProjects } from "../config/shared.ts";
import SpinningSquareDivider from '../components/SpinningSquareDivider';
import MenuBar from '../components/MenuBar';
import Footer from '../components/Footer.tsx';
import Hero from '../components/HomePage/Hero';
import About from '../components/HomePage/About';
import Projects from '../components/HomePage/Projects';

export default function HomePage() {
    const handleHeroVisibility = () => { };
    const handleAboutVisibility = () => { };
    const handleProjectsVisibility = () => { };
    return (
        <div className="relative select-none">
            <MenuBar />
            <Hero
                name={strings.name}
                tagline={strings.pages.home.tagline}
                subtitles={strings.pages.home.subtitles}
                scrollText={strings.pages.home.scroll_text}
                githubLink={strings.links.github}
                linkedinLink={strings.links.linkedin}
                onIntersect={handleHeroVisibility}
            />
            <SpinningSquareDivider />
            <About
                title={strings.pages.home.about.title}
                content={strings.pages.home.about.content}
                toolkitTitle={strings.pages.home.about.toolkit_title}
                technologies={strings.pages.home.about.technologies}
                onIntersect={handleAboutVisibility}
            />
            <SpinningSquareDivider reverse={true} />
            <Projects
                title={strings.pages.home.projects_title}
                projects={featuredProjects}
                viewProjectButtonText={strings.pages.home.view_project_button}
                viewAllProjectsButtonText={strings.pages.home.view_all_projects_button}
                onIntersect={handleProjectsVisibility}
            />
            <SpinningSquareDivider includeLine={false} />
            <Footer />
        </div>
    );
}
