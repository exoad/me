import type { CSSProperties } from "react";
import { strings, projects } from "../data/shared.ts";
import SEO from "../components/SEO.tsx";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PhotoStrip from "../components/PhotoStrip";

const EMAIL = "jackm@exoad.net";

/** Places an element in the page's entrance sequence. */
const step = (i: number) => ({ "--i": i }) as CSSProperties;

export default function HomePage() {
	return (
		<>
			<SEO title="Home" description={strings.pages.home.about.content} />
			<main id="main" className="page home">
				<div className="reveal" style={step(0)}>
					<Header />
				</div>

				<p className="intro reveal" style={step(1)}>
					{strings.pages.home.about.content}
				</p>

				<div className="reveal" style={step(2)}>
					<PhotoStrip />
				</div>

				<section>
					<h2 className="reveal" style={step(3)}>projects</h2>
					<ul className="plain-list">
						{projects.map((p, i) => (
							<li key={p.title} className="reveal" style={step(4 + i)}>
								{p.link ? (
									<a
										className="project-name"
										href={p.link}
										target="_blank"
										rel="noopener noreferrer"
									>
										{p.title}
										<span className="arrow" aria-hidden="true">↗</span>
									</a>
								) : (
									<span className="project-name">{p.title}</span>
								)}
								<span className="muted">{p.description}</span>
							</li>
						))}
					</ul>
				</section>

				<p className="links reveal" style={step(5 + projects.length)}>
					<a href={strings.links.github} aria-label={strings.links.github_aria}>github</a>
					{" · "}
					<a href={strings.links.linkedin} aria-label={strings.links.linkedin_aria}>linkedin</a>
					{" · "}
					<a href={strings.links.x} aria-label={strings.links.x_aria}>x</a>
					{" · "}
					<a href={`mailto:${EMAIL}`}>{EMAIL}</a>
				</p>

				<div className="reveal" style={step(6 + projects.length)}>
					<Footer />
				</div>
			</main>
		</>
	);
}
