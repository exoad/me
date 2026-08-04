import { strings, featuredProjects, projects } from "../data/shared.ts";
import SEO from "../components/SEO.tsx";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PhotoStrip from "../components/PhotoStrip";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BlogPostData, loadAllBlogPosts } from "../utils/markdown";

function ContactEmail({ email }: { email: string }) {
	const [copied, setCopied] = useState(false);

	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(email);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1400);
		} catch {
			window.location.href = `mailto:${email}`;
		}
	};

	return (
		<p>
			<a href={`mailto:${email}`}>{email}</a>{" "}
			<button type="button" className="btn-link" onClick={copyEmail} aria-label={`Copy ${email}`}>
				{copied ? "copied" : "[copy]"}
			</button>
		</p>
	);
}

function ProjectRow({ proj }: { proj: (typeof projects)[0] }) {
	return (
		<details className="project-row">
			<summary>
				<strong>{proj.title}</strong>{" "}
				<span className="muted">{proj.technologies.map((t) => t.name).join(" · ")}</span>{" "}
				<span className="muted">[{proj.state}]</span>
			</summary>
			<p className="muted">{proj.description}</p>
			<p>
				<a href={proj.link} target="_blank" rel="noopener noreferrer">
					visit
				</a>
			</p>
		</details>
	);
}

function ContentSections() {
	const biboProject = projects.find((p) => p.title === "bibo");
	const otherFeatured = featuredProjects.filter((p) => p.title !== "bibo");
	const allOtherProjects = projects.filter((p) => !p.featured && p.title !== "bibo");
	const [latestPosts, setLatestPosts] = useState<BlogPostData[]>([]);

	useEffect(() => {
		loadAllBlogPosts().then(posts => setLatestPosts(posts)).catch(() => {});
	}, []);

	return (
		<>
			<section>
				<p>
					{strings.pages.home.about.content.split("photography")[0]}
					<Link to="/photos">photography</Link>
					{strings.pages.home.about.content.split("photography")[1]}
				</p>
			</section>

			{/* Straight after the paragraph that mentions it, so the word and the
			    frames arrive together. */}
			<PhotoStrip />

			{biboProject && (
				<section>
					<h2>Active Project</h2>
					<p className="muted">[{biboProject.state}]</p>
					<h3>{biboProject.title}</h3>
					<p className="muted">{biboProject.description}</p>
					<p>
						<a href={biboProject.link} target="_blank" rel="noopener noreferrer">
							view project
						</a>
					</p>
				</section>
			)}

			<section>
				<h2>Writing</h2>
				{latestPosts.length > 0 && (
					<ul>
						{latestPosts.slice(0, 2).map((post) => (
							<li key={post.slug}>
								<Link to={"/blog/" + post.slug}>{post.title}</Link>{" "}
								<span className="muted">
									{post.date} &middot; {post.tags.map((t: string) => "#" + t).join(" ")}
								</span>
							</li>
						))}
					</ul>
				)}
				<p>
					<Link to="/blog">view all posts</Link>
				</p>
			</section>

			<section>
				<h2>Projects</h2>
				<div>
					{[...otherFeatured, ...allOtherProjects].map((proj) => (
						<ProjectRow key={proj.title} proj={proj} />
					))}
				</div>
				<p>
					<a href={strings.links.github} target="_blank" rel="noopener noreferrer">
						all projects
					</a>
				</p>
			</section>

			<section>
				<h2>Contact</h2>
				<ContactEmail email="jackm@exoad.net" />
				<ContactEmail email="jmeng2@terpmail.umd.edu" />
			</section>
		</>
	);
}

export default function HomePage() {
	return (
		<>
			<SEO title="Home" description={strings.pages.home.about.content} />
			<main id="main" className="page">
				<Header />
				<p className="muted">
					{strings.pages.home.tagline}
					{" — "}
					<a href={strings.links.github} aria-label={strings.links.github_aria}>GitHub</a>
					{" · "}
					<a href={strings.links.linkedin} aria-label={strings.links.linkedin_aria}>LinkedIn</a>
					{" · "}
					<a href={strings.links.x} aria-label={strings.links.x_aria}>X</a>
				</p>
				<ContentSections />
				<Footer />
			</main>
		</>
	);
}
