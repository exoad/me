import { strings, featuredProjects, projects } from "../data/shared.ts";
import SEO from "../components/SEO.tsx";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { MdOutlineArrowOutward } from "react-icons/md";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BlogPostData, loadAllBlogPosts } from "../utils/markdown";

function NameCard() {
	// Core Gruvbox colors: red, green, yellow, blue
	const coreColors = ["text-red", "text-green", "text-yellow", "text-blue"];
	const [colorIndex, setColorIndex] = useState(() => {
		const stored = window.sessionStorage.getItem("nameAccentIndex");
		return stored ? Number(stored) % coreColors.length : Math.floor(Math.random() * coreColors.length);
	});
	const [popped, setPopped] = useState(false);
	const name = strings.name;

	const cycleColor = () => {
		setColorIndex((i) => {
			const next = (i + 1) % coreColors.length;
			window.sessionStorage.setItem("nameAccentIndex", String(next));
			return next;
		});
		setPopped(false);
		window.requestAnimationFrame(() => setPopped(true));
		window.setTimeout(() => setPopped(false), 360);
	};

	return (
		<div className="flex flex-col items-start lg:items-end gap-3 animate-fade-in-up">
			<h1
				className="font-black text-5xl sm:text-6xl md:text-7xl text-fg0 tracking-tight cursor-pointer select-none"
				onClick={cycleColor}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						cycleColor();
					}
				}}
				role="button"
				tabIndex={0}
				aria-label="Cycle the first letter color"
				title="Click to change color"
			>
				<span
					className={`inline-block ${coreColors[colorIndex]} transition-colors duration-300 ${popped ? "animate-name-pop" : ""}`}
				>
					{name[0]}
				</span>
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
		<div className="group flex items-center gap-3">
			<a
				href={`mailto:${email}`}
				className="motion-link-reveal text-fg hover:text-fg0 text-base font-sans transition duration-300"
			>
				{email}
			</a>
			<button
				type="button"
				onClick={copyEmail}
				className="motion-press text-[10px] uppercase tracking-[0.16em] text-fg4 opacity-70 transition-colors duration-200 hover:text-yellow group-hover:opacity-100"
				aria-label={`Copy ${email}`}
			>
				{copied ? "copied" : "copy"}
			</button>
		</div>
	);
}

function ProjectRow({ proj }: { proj: (typeof projects)[0] }) {
	const [open, setOpen] = useState(false);
	const panelId = `project-${proj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

	return (
		<div className="border-b border-bg2 transition-all duration-300 hover:border-bg3">
			<button
				onClick={() => setOpen(!open)}
				aria-expanded={open}
				aria-controls={panelId}
				className="motion-press group w-full flex items-center justify-between gap-4 py-4 hover:border-fg3 transition duration-300 text-left"
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
				id={panelId}
				className="motion-panel"
				data-open={open}
			>
				<div className="pb-6">
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
							className="motion-link-reveal motion-press inline-flex items-center gap-1 text-fg3 hover:text-fg text-xs font-sans transition duration-300"
						>
							visit <MdOutlineArrowOutward size={10} />
						</a>
					</div>
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
			className="motion-lift block group hover:opacity-80"
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
			<h3 className="text-2xl sm:text-3xl font-bold text-fg0 mb-2 transition-colors duration-300 group-hover:text-fg1">
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
	const [guestbookCount, setGuestbookCount] = useState<number | null | undefined>(null);

	useEffect(() => {
		loadAllBlogPosts().then(posts => setLatestPosts(posts)).catch(() => {});
		window.fetch("/api/guestbook/list?page=1&limit=1")
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => {
				if (!data) return;
				setGuestbookCount(
					typeof data.totalEntries === "number" ? data.totalEntries : data.totalPages,
				);
			})
			.catch(() => setGuestbookCount(undefined));
	}, []);

	return (
		<div className="flex flex-col gap-y-[3.5rem]">
			<section className="animate-fade-in-up" style={{ animationDelay: '40ms' }}>
				<p className="text-fg2 text-base sm:text-lg font-sans leading-relaxed max-w-xl">
					{strings.pages.home.about.content.split("photography")[0]}
					<Link
						to="/photos"
						className="motion-link-reveal decoration-fg4 hover:decoration-fg2 transition-colors"
					>
						photography
					</Link>
					{strings.pages.home.about.content.split("photography")[1]}
				</p>
			</section>

			{droskProject && (
				<section className="max-w-2xl animate-fade-in-up" style={{ animationDelay: '70ms' }}>
					<h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-4">
						Current Focus
					</h2>
					<FeaturedTeaser proj={droskProject} />
					<div className="border-b border-bg2 mt-4" />
				</section>
			)}

			{/* bibo - Special mention */}
			{biboProject && (
				<section className="max-w-2xl animate-fade-in-up" style={{ animationDelay: '90ms' }}>
					<h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-4">
						Active Project
					</h2>
					<div className="flex items-center gap-2 mb-2">
						<span className="px-1.5 py-0.5 text-[10px] font-sans uppercase tracking-widest bg-green/20 text-green rounded-sm">
							{biboProject.state}
						</span>
					</div>
					<h3 className="text-2xl sm:text-3xl font-bold text-fg0 mb-2">
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

			<section className="max-w-2xl animate-fade-in-up" style={{ animationDelay: '110ms' }}>
				<h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-4">
						Writing
				</h2>
				<Link
					to="/blog"
					className="motion-lift block group hover:opacity-70"
				>
					<h3 className="text-2xl sm:text-3xl font-bold text-fg0 mb-2 transition-colors duration-300 group-hover:text-fg1">
						{strings.pages.blog.title}
					</h3>
					<p className="text-fg3 text-sm font-sans leading-relaxed max-w-lg transition-colors duration-300 group-hover:text-fg2">
						{strings.pages.blog.description}
					</p>
				</Link>
				{latestPosts.length > 0 && (
					<div className="mt-4 flex flex-col gap-4">
						{latestPosts.slice(0, 2).map((post) => (
							<Link
								key={post.slug}
								to={"/blog/" + post.slug}
							className="motion-lift group"
							>
								<div className="flex items-center gap-2 mb-1">
									<span className="text-fg4 text-xs font-sans">{post.date}</span>
									<span className="text-fg4/50 text-xs">&middot;</span>
									<span className="text-fg4 text-xs font-sans">
										{post.tags.map((t: string) => "#" + t).join(" ")}
									</span>
								</div>
								<h4 className="text-base text-fg2 group-hover:text-fg0 transition-colors duration-300">
									{post.title}
								</h4>
							</Link>
						))}
						<Link
							to="/blog"
							className="motion-link-reveal motion-press inline-flex items-center gap-1 text-fg4 hover:text-fg2 text-xs font-sans transition duration-300"
						>
							view all posts <MdOutlineArrowOutward size={10} />
						</Link>
					</div>
				)}
				<div className="border-b border-bg2 mt-4" />
			</section>

			<section className="animate-fade-in-up" style={{ animationDelay: '130ms' }}>
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
						className="motion-link-reveal motion-press inline-flex items-center gap-1 text-fg4 hover:text-fg2 text-xs font-sans transition duration-300"
					>
						all projects <MdOutlineArrowOutward size={10} />
					</a>
				</div>
			</section>

			<section className="max-w-2xl animate-fade-in-up" style={{ animationDelay: '150ms' }}>
				<h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-4">
					Contact
				</h2>
				<div className="flex flex-col gap-2">
					<ContactEmail email="jackm@exoad.net" />
					<ContactEmail email="jmeng2@terpmail.umd.edu" />
				</div>
				<div className="border-b border-bg2 mt-4" />
			</section>

			<section className="max-w-2xl animate-fade-in-up" style={{ animationDelay: '170ms' }}>
				<h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-4">
					Guestbook
				</h2>
				<Link
					to="/guestbook"
					className="motion-lift block group hover:opacity-80"
				>
					<div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
						<h3 className="text-2xl sm:text-3xl font-bold text-fg0 transition-colors duration-300 group-hover:text-fg1">
							{strings.pages.guestbook.title}
						</h3>
						<span className="text-fg4 text-xs font-sans">
							{guestbookCount === null
								? "loading entries"
								: guestbookCount === undefined
									? "entries unavailable"
								: `${guestbookCount} ${guestbookCount === 1 ? "entry" : "entries"}`}
						</span>
					</div>
					<p className="mt-2 text-fg3 text-sm font-sans leading-relaxed max-w-lg transition-colors duration-300 group-hover:text-fg2">
						{strings.pages.guestbook.description}
					</p>
				</Link>
			</section>
		</div>
	);
}

export default function HomePage() {
	return (
		<>
			<SEO title="Home" description={strings.pages.home.about.content} />

			{/* Mobile / small screens: stacked layout */}
			<main id="main">
			<div className="lg:hidden">
				<div className="min-h-[100dvh] flex flex-col items-center justify-center bg-bg0 px-6">
					<div className="flex flex-col items-center gap-8">
						<NameCard />
						<a href="#home-content" className="animate-soft-pulse-down motion-link-reveal text-[10px] uppercase tracking-[0.2em] text-fg4 transition-colors hover:text-yellow">
							{strings.pages.home.scroll_text}
						</a>
					</div>
				</div>
				<div id="home-content" className="bg-bg0 px-[calc(var(--spacing)*_6)] sm:px-[calc(var(--spacing)*_8)] md:px-[calc(var(--spacing)*_16)] pb-20 max-w-3xl mx-auto">
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
							className="motion-link-reveal text-fg4 hover:text-fg3 text-[10px] font-sans transition duration-300"
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
							className="motion-link-reveal text-fg4 hover:text-fg3 text-[10px] font-sans transition duration-300"
						>
							{strings.footer.source.url_attr}
						</a>
					</footer>
				</div>
			</div>
			</main>
		</>
	);
}
