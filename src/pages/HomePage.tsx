import { strings, featuredProjects, projects } from "../data/shared.ts";
import SEO from "../components/SEO.tsx";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { MdOutlineArrowOutward } from "react-icons/md";
import { useState, useEffect } from "react";
import { BlogPostData, loadAllBlogPosts } from "../utils/markdown";

function NameCard() {
	// Core Gruvbox colors: red, green, yellow, blue - randomly selected on load
	const coreColors = ["text-red", "text-green", "text-yellow", "text-blue"];
	const randomColor = coreColors[Math.floor(Math.random() * coreColors.length)];
	const name = strings.name;

	return (
		<div className="flex flex-col items-start lg:items-end gap-3">
			<h1 className="font-black text-5xl sm:text-6xl md:text-7xl font-playfair text-fg0 tracking-tight">
				<span className={randomColor}>{name[0]}</span>
				{name.slice(1)}
			</h1>
			<p className="text-fg3 text-xs font-sans uppercase tracking-[0.2em]">
				{strings.pages.home.tagline}
			</p>
			<div className="flex gap-5 mt-3">
				<a
					href={strings.links.github}
					aria-label={strings.links.github_aria}
					className="text-fg4 hover:text-fg0 transition duration-300"
				>
					<SiGithub size={18} />
				</a>
				<a
					href={strings.links.linkedin}
					aria-label={strings.links.linkedin_aria}
					className="text-fg4 hover:text-fg0 transition duration-300"
				>
					<SiLinkedin size={18} />
				</a>
				<a
					href={strings.links.x}
					aria-label={strings.links.x_aria}
					className="text-fg4 hover:text-fg0 transition duration-300"
				>
					<SiX size={18} />
				</a>
			</div>
		</div>
	);
}

function ProjectRow({ proj }: { proj: (typeof projects)[0] }) {
	const [open, setOpen] = useState(false);

	return (
		<div className="border-b border-bg2">
			<button
				onClick={() => setOpen(!open)}
				className="group w-full flex items-center justify-between gap-4 py-4 hover:border-fg3 transition duration-300 text-left"
			>
				<div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
					<span className="text-fg text-sm sm:text-base font-sans font-semibold">
						{proj.title}
					</span>
					<span className="text-fg4 text-xs font-sans">
						{proj.technologies.map((t) => t.name).join(" · ")}
					</span>
				</div>
				<MdOutlineArrowOutward
					size={12}
					className={`shrink-0 transition duration-300 ${open ? "text-fg3 rotate-90" : "text-bg0 group-hover:text-fg3"}`}
				/>
			</button>
			<div
				className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
					open ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
				}`}
			>
				<p className="text-fg3 text-sm font-sans leading-relaxed mb-4 max-w-lg">
					{proj.description}
				</p>
				<div className="flex items-center gap-4">
					<span
						className={`text-[10px] font-sans uppercase tracking-widest px-2 py-1 rounded-sm ${
							proj.state === "active"
								? "bg-green-dim/30 text-green"
								: proj.state === "finished"
									? "bg-blue-dim/30 text-blue"
									: "bg-gray/20 text-fg4"
						}`}
					>
						{proj.state}
					</span>
					<a
						href={proj.link}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1 text-fg3 hover:text-fg text-xs font-sans transition duration-300"
					>
						visit <MdOutlineArrowOutward size={10} />
					</a>
				</div>
			</div>
		</div>
	);
}

function FeaturedTeaser({ proj }: { proj: (typeof projects)[0] }) {
	return (
		<a
			href={proj.link}
			target="_blank"
			rel="noopener noreferrer"
			className="block group transition-all duration-300 hover:opacity-70"
		>
			<div className="flex items-center gap-2 mb-2">
				<span className={`px-2 py-0.5 text-[10px] font-sans uppercase tracking-widest rounded-sm transition-colors duration-300 ${
					proj.state === "active"
						? "bg-yellow/20 text-yellow group-hover:bg-yellow/30"
						: proj.state === "finished"
							? "bg-blue/20 text-blue group-hover:bg-blue/30"
							: "bg-gray/20 text-fg4 group-hover:bg-gray/30"
				}`}>
					{proj.state === "active" ? "In Development" : proj.state === "finished" ? "Completed" : "Archived"}
				</span>
			</div>
			<h3 className="text-2xl sm:text-3xl font-bold font-playfair text-fg0 mb-2 transition-colors duration-300 group-hover:text-fg1">
				{proj.title}
			</h3>
			<p className="text-fg3 text-sm font-sans leading-relaxed max-w-lg transition-colors duration-300 group-hover:text-fg2">
				{proj.description}
			</p>
		</a>
	);
}

function ContentSections() {
	const droskProject = projects.find((p) => p.title === "Drosk");
	const biboProject = projects.find((p) => p.title === "bibo");
	const otherFeatured = featuredProjects.filter(
		(p) => p.title !== "Drosk" && p.title !== "bibo",
	);
	const allOtherProjects = projects.filter(
		(p) => !p.featured && p.title !== "Drosk" && p.title !== "bibo",
	);
	const [latestPosts, setLatestPosts] = useState<BlogPostData[]>([]);

	useEffect(() => {
		loadAllBlogPosts().then(posts => setLatestPosts(posts)).catch(() => {});
	}, []);

	return (
		<div className="flex flex-col gap-y-[3.5rem]">
			<section>
				<p className="text-fg2 text-base sm:text-lg font-sans leading-relaxed max-w-xl">
					I build software because I believe the best tools respect their users —
					local-first, deterministic, and free from surveillance. From custom
					audio engines and CPU rasterizers to file automation and programming
					languages, I work across the stack to make things that work reliably
					and stay yours. Most of my work is open source. Outside of code, I
					enjoy hiking,{" "}
					<a
						href="/photos"
						className="underline underline-offset-4 decoration-fg4 hover:decoration-fg2 transition-colors"
					>
						photography
					</a>
					, and movies.
				</p>
			</section>

			{droskProject && (
				<section className="max-w-2xl">
					<h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-4">
						Current Focus
					</h2>
					<FeaturedTeaser proj={droskProject} />
					<div className="border-b border-bg2 mt-4" />
				</section>
			)}

			{/* bibo - Special mention */}
			{biboProject && (
				<section className="max-w-2xl">
					<h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-4">
						Active Project
					</h2>
					<div className="flex items-center gap-2 mb-2">
						<span className="px-1.5 py-0.5 text-[10px] font-sans uppercase tracking-widest bg-green/20 text-green rounded-sm">
							{biboProject.state}
						</span>
					</div>
					<h3 className="text-2xl sm:text-3xl font-bold font-playfair text-fg0 mb-2">
						{biboProject.title}
					</h3>
					<p className="text-fg3 text-sm font-sans leading-relaxed mb-3 max-w-lg">
						{biboProject.description}
					</p>
					<a
						href={biboProject.link}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1 text-fg4 hover:text-fg2 text-xs font-sans transition duration-300"
					>
						view project <MdOutlineArrowOutward size={10} />
					</a>
					<div className="border-b border-bg2 mt-4" />
				</section>
			)}

			<section className="max-w-2xl">
				<h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-4">
						Writing
				</h2>
				<a
					href="/blog"
					className="block group transition-all duration-300 hover:opacity-70"
				>
					<h3 className="text-2xl sm:text-3xl font-bold font-playfair text-fg0 mb-2 transition-colors duration-300 group-hover:text-fg1">
						{strings.pages.blog.title}
					</h3>
					<p className="text-fg3 text-sm font-sans leading-relaxed max-w-lg transition-colors duration-300 group-hover:text-fg2">
						{strings.pages.blog.description}
					</p>
				</a>
				{latestPosts.length > 0 && (
					<div className="mt-4 flex flex-col gap-4">
						{latestPosts.slice(0, 2).map((post) => (
							<a
								key={post.slug}
								href={"/blog/" + post.slug}
								className="group transition-all duration-300"
							>
								<div className="flex items-center gap-2 mb-1">
									<span className="text-fg4 text-xs font-sans">{post.date}</span>
									<span className="text-fg4/50 text-xs">&middot;</span>
									<span className="text-fg4 text-xs font-sans">
										{post.tags.map((t: string) => "#" + t).join(" ")}
									</span>
								</div>
								<h4 className="text-base font-playfair text-fg2 group-hover:text-fg0 transition-colors duration-300">
									{post.title}
								</h4>
							</a>
						))}
						<a
							href="/blog"
							className="inline-flex items-center gap-1 text-fg4 hover:text-fg2 text-xs font-sans transition duration-300"
						>
							view all posts <MdOutlineArrowOutward size={10} />
						</a>
					</div>
				)}
				<div className="border-b border-bg2 mt-4" />
			</section>

			<section>
				<h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-4">
					Projects
				</h2>
				<div className="flex flex-col max-w-2xl">
					{[...otherFeatured, ...allOtherProjects].map((proj) => (
						<ProjectRow key={proj.title} proj={proj} />
					))}
				</div>
				<div className="mt-4">
					<a
						href={strings.links.github}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1 text-fg4 hover:text-fg2 text-xs font-sans transition duration-300"
					>
						all projects <MdOutlineArrowOutward size={10} />
					</a>
				</div>
			</section>

			<section className="max-w-2xl">
				<h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-4">
					Contact
				</h2>
				<div className="flex flex-col gap-2">
					<a
						href="mailto:jackm@exoad.net"
						className="text-fg hover:text-fg0 text-base font-sans transition duration-300"
					>
						jackm@exoad.net
					</a>
					<a
						href="mailto:jmeng2@terpmail.umd.edu"
						className="text-fg hover:text-fg0 text-base font-sans transition duration-300"
					>
						jmeng2@terpmail.umd.edu
					</a>
				</div>
			</section>
		</div>
	);
}

export default function HomePage() {
	return (
		<>
			<SEO title="Home" description={strings.pages.home.about.content} />

			{/* Mobile / small screens: stacked layout */}
			<div className="lg:hidden">
				<div className="min-h-[100dvh] flex flex-col items-center justify-center bg-bg0 px-6">
					<NameCard />
				</div>
				<div className="bg-bg0 px-6 sm:px-12 md:px-24 pb-20 max-w-3xl mx-auto">
					<ContentSections />
				</div>
				<footer className="bg-bg0 border-t border-bg2 py-8 px-6">
					<div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
						<span className="text-fg4 text-[10px] font-sans">
							{strings.footer.legals}
						</span>
						<a
							href={strings.footer.source.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-fg4 hover:text-fg3 text-[10px] font-sans transition duration-300"
						>
							{strings.footer.source.url_attr}
						</a>
					</div>
				</footer>
			</div>

			{/* Large screens: side-by-side with sticky name */}
			<div className="hidden lg:flex min-h-[100dvh] bg-bg0">
				<div className="w-[42%] sticky top-0 h-screen flex flex-col items-end justify-center px-12 xl:px-20">
					<NameCard />
				</div>
				<div className="w-[58%] px-12 xl:px-20 py-[20vh]">
					<ContentSections />
					<footer className="mt-24 pt-6 border-t border-bg2 flex justify-between items-center">
						<span className="text-fg4 text-[10px] font-sans">
							{strings.footer.legals}
						</span>
						<a
							href={strings.footer.source.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-fg4 hover:text-fg3 text-[10px] font-sans transition duration-300"
						>
							{strings.footer.source.url_attr}
						</a>
					</footer>
				</div>
			</div>
		</>
	);
}
