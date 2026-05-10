import { useEffect } from 'react';
import SEO from '../components/SEO';
import { SiGithub } from 'react-icons/si';
import { MdOutlineArrowOutward } from 'react-icons/md';

const features = [
  {
    title: "Local-First",
    description: "Your code never leaves your machine. Runs entirely on your hardware with local LLMs.",
    icon: "🏠"
  },
  {
    title: "Privacy Built-In",
    description: "No cloud dependencies, no data harvesting. Your proprietary code stays yours.",
    icon: "🔒"
  },
  {
    title: "Extensible",
    description: "TypeScript extension system with 20+ built-in extensions. Add your own tools easily.",
    icon: "🔧"
  },
  {
    title: "Small Models",
    description: "Optimized for Qwen-3.6-35B and similar small models. No GPU cluster required.",
    icon: "💻"
  }
];

const techStack = [
  { name: "TypeScript", color: "#3178c6" },
  { name: "Node.js", color: "#339933" },
  { name: "React", color: "#61dafb" },
  { name: "llama.cpp", color: "#6b8e23" },
  { name: "pi-coding-agent", color: "#ff6b6b" },
];

export default function BiboPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <>
      <SEO
        title="bibo"
        description="A coding agent for local models on consumer hardware"
        url="https://exoad.net/bibo"
      />

      <div className="min-h-screen bg-[#2a2520] text-[#e8dcc8]">
        {/* Warm gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-[#2a2520] via-[#3d3229] to-[#2a2520] pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(214,93,14,0.08),transparent_50%)] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <header className="border-b border-[#4a4035]/50">
            <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
              <a
                href="/"
                className="text-[#a89984] hover:text-[#e8dcc8] transition-colors duration-300 text-xs font-sans uppercase tracking-widest"
              >
                ← Back
              </a>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🐧</span>
                <h1 className="text-xl font-semibold text-[#e8dcc8]">bibo</h1>
              </div>
              <div className="w-16" />
            </div>
          </header>

          <main className="px-6 py-16">
            <div className="max-w-4xl mx-auto">
              {/* Hero */}
              <div className="text-center mb-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#3d3229] border border-[#5a4d3f] mb-8">
                  <img
                    src="/bibo-icon.png"
                    alt="bibo"
                    className="w-14 h-14"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="text-4xl absolute">🐧</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-[#e8dcc8] mb-4 tracking-tight">
                  bibo
                </h2>
                <p className="text-lg md:text-xl text-[#bdae93] max-w-2xl mx-auto leading-relaxed mb-2">
                  A coding agent for local models on consumer hardware
                </p>
                <p className="text-sm text-[#a89984]">
                  Fortified with industry-grade system prompts from Claude & OpenCode
                </p>

                <div className="flex items-center justify-center gap-4 mt-8">
                  <a
                    href="https://github.com/exoad/bibo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3d3229] border border-[#5a4d3f] text-[#e8dcc8] text-sm hover:bg-[#4a4035] hover:border-[#6b5a4a] transition-all duration-300"
                  >
                    <SiGithub size={16} />
                    View on GitHub
                  </a>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center gap-2 mb-20">
                <div className="w-12 h-px bg-[#5a4d3f]" />
                <span className="text-[#7c6f64] text-xs">◆</span>
                <div className="w-12 h-px bg-[#5a4d3f]" />
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="p-6 bg-[#3d3229]/50 border border-[#4a4035] hover:border-[#6b5a4a] transition-all duration-300 group"
                  >
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold text-[#e8dcc8] mb-2 group-hover:text-[#d79921] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#bdae93] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center gap-2 mb-20">
                <div className="w-12 h-px bg-[#5a4d3f]" />
                <span className="text-[#7c6f64] text-xs">◆</span>
                <div className="w-12 h-px bg-[#5a4d3f]" />
              </div>

              {/* Tech Stack */}
              <div className="text-center mb-20">
                <h3 className="text-xl font-semibold text-[#e8dcc8] mb-6">Built With</h3>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-[#3d3229] border border-[#4a4035] text-sm text-[#bdae93]"
                      style={{ borderColor: `${tech.color}40` }}
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Start */}
              <div className="bg-[#3d3229]/30 border border-[#4a4035] p-6 md:p-8 mb-20">
                <h3 className="text-lg font-semibold text-[#e8dcc8] mb-4">Quick Start</h3>
                <div className="bg-[#1d2021] p-4 font-mono text-sm text-[#a89984] overflow-x-auto">
                  <span className="text-[#98971a]">git clone</span>{' '}
                  <span className="text-[#bdae93]">https://github.com/exoad/bibo.git</span>
                  <br />
                  <span className="text-[#d79921]">cd</span>{' '}
                  <span className="text-[#bdae93]">bibo</span>
                  <br />
                  <span className="text-[#458588]">npm install</span>
                  <br />
                  <span className="text-[#b16286]">./bin/bibo.sh</span>
                </div>
              </div>

              {/* My Server Section */}
              <div className="mb-20">
                <h3 className="text-xl font-semibold text-[#e8dcc8] mb-6 text-center">My Server</h3>
                <div className="bg-[#3d3229]/30 border border-[#4a4035] p-6">
                  <ul className="space-y-3 text-sm text-[#bdae93]">
                    <li className="flex items-start gap-3">
                      <span className="text-[#d79921]">GPU 1:</span>
                      <span>NVIDIA V100 SXM2 (w/ PCIe Adaptor) 32GB for attention layers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d79921]">GPU 2:</span>
                      <span>NVIDIA RTX 3080 (20GB MOD) for MoE expert layers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d79921]">CPU:</span>
                      <span>AMD Ryzen 5 7500X3D</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d79921]">RAM:</span>
                      <span>32GB DDR5</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-xs text-[#7c6f64] italic">
                    Currently running Qwen-3.6-35B-A3B Q5 with llama.cpp
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <a
                  href="https://github.com/exoad/bibo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#d79921] hover:text-[#fabd2f] transition-colors duration-300 text-sm group"
                >
                  Check it out on GitHub
                  <MdOutlineArrowOutward size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-[#4a4035]/50 py-8 px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-[#7c6f64] text-xs">
                © 2025 Jiaming Meng
              </span>
              <div className="flex items-center gap-2 text-[#7c6f64] text-xs">
                <span>Made with</span>
                <span className="text-[#cc241d]">♥</span>
                <span>and local AI</span>
              </div>
              <a
                href="/"
                className="text-[#7c6f64] hover:text-[#a89984] text-xs transition duration-300 uppercase tracking-wider"
              >
                Home
              </a>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
