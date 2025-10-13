import { Suspense } from 'react';
import { strings, featuredProjects } from "../data/shared.ts";
import Scaffold from '../components/Scaffold.tsx';

import SpinningSquareDivider from '../components/SpinningSquareDivider';
import Hero from '../components/HomePage/Hero';
import About from '../components/HomePage/About';
import Projects from '../components/HomePage/Projects';

export default function HomePage() {
    return (
        <Scaffold>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="loading-spinner"></div></div>}>
                <Hero
                    name={strings.name}
                    tagline={strings.pages.home.tagline}
                    subtitles={strings.pages.home.subtitles}
                    scrollText={strings.pages.home.scroll_text}
                    githubLink={strings.links.github}
                    linkedinLink={strings.links.linkedin}
                    onIntersect={() => { }}
                />
                <Suspense fallback={<div className="py-8 flex justify-center"><div className="loading-spinner"></div></div>}>
                    <SpinningSquareDivider />
                </Suspense>
                <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center"><div className="loading-spinner"></div></div>}>
                    <About
                        title={strings.pages.home.about.title}
                        content={strings.pages.home.about.content}
                        toolkitTitle={strings.pages.home.about.toolkit_title}
                        technologies={strings.pages.home.about.technologies}
                        onIntersect={() => { }}
                    />
                </Suspense>
                <Suspense fallback={<div className="py-8 flex justify-center"><div className="loading-spinner"></div></div>}>
                    <SpinningSquareDivider reverse={true} />
                </Suspense>
                <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center"><div className="loading-spinner"></div></div>}>
                    <Projects
                        title={strings.pages.home.projects_title}
                        projects={featuredProjects}
                        viewProjectButtonText={strings.pages.home.view_project_button}
                        viewAllProjectsButtonText={strings.pages.home.view_all_projects_button}
                        onIntersect={() => { }}
                    />
                </Suspense>
            </Suspense>
        </Scaffold>
    );
}
