import { strings, featuredProjects, projects } from "../data/shared.ts";
import SEO from "../components/SEO.tsx";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { MdOutlineArrowOutward } from "react-icons/md";
import { useState } from "react";

function NameCard() {
	return (
		<div className="flex flex-col items-end gap-3">
			<h1 className="font-black text-5xl sm:text-6xl md:text-7xl font-playfair text-fg0 tracking-tight">
				{strings.name}
			</h1>
			<p className="text-fg3 text-xs font-montserrat uppercase tracking-[0.2em]">
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

function DroskTeaser() {
	return (
		<div className="relative overflow-hidden rounded-lg border border-yellow/30 bg-gradient-to-br from-bg1 to-bg0 p-6 sm:p-8">
			<div className="absolute top-0 right-0 w-32 h-32 bg-yellow/5 rounded-full blur-3xl" />
			<div className="relative z-10">
				<div className="flex items-center gap-2 mb-3">
					<span className="px-2 py-0.5 text-[10px] font-sans uppercase tracking-widest bg-yellow/20 text-yellow rounded-sm">
						In Development
					</span>
				</div>
				<h3 className="text-3xl sm:text-4xl font-black font-playfair text-fg0 mb-3">
					Drosk
				</h3>
				<p className="text-fg3 text-sm font-sans leading-relaxed mb-4 max-w-lg">
					A modular AI-native workflow engine. Built from the ground up with a
					custom component system that bridges local LLMs with structured
					automation. Privacy-first, offline-capable AI tooling for the future
					of personal computing.
				</p>
				<div className="flex items-center gap-4 text-xs text-fg4 font-sans">
					<span>TypeScript</span>
					<span>•</span>
					<span>React</span>
					<span>•</span>
					<span>Kotlin</span>
					<span>•</span>
					<span>Python</span>
				</div>
			</div>
		</div>
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

	return (
		<div className="flex flex-col gap-24">
			<section>
				<p className="text-fg2 text-base sm:text-lg font-sans leading-relaxed max-w-xl">
					{strings.pages.home.about.content}
				</p>
			</section>

			{/* Drosk Teaser - Prominent */}
			<section>
				<h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-6">
					Current Focus
				</h2>
				<DroskTeaser />
			</section>

			{/* bibo - Special mention */}
			{biboProject && (
				<section>
					<h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-6">
						Active Project
					</h2>
					<div className="border-l-2 border-green pl-4">
						<div className="flex items-center gap-2 mb-2">
							<span className="text-fg0 text-2xl font-playfair font-black">
								{biboProject.title}
							</span>
							<span className="px-1.5 py-0.5 text-[10px] font-sans uppercase tracking-widest bg-green/20 text-green rounded-sm">
								{biboProject.state}
							</span>
						</div>
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
					</div>
				</section>
			)}

			<section>
				<h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-8">
					Projects
				</h2>
				<div className="flex flex-col max-w-2xl">
					{[...otherFeatured, ...allOtherProjects].map((proj) => (
						<ProjectRow key={proj.title} proj={proj} />
					))}
				</div>
				<div className="mt-8">
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

			<section>
				<h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-8">
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
