import { useEffect } from 'react';
import SEO from '../components/SEO';
import { strings } from '../data/shared.ts';
import { Column } from '../components/FlexLayouter.tsx';
import CopyEmailButton from '../components/CopyEmailButton.tsx';


export default function ContactPage() {
    useEffect(() => {
        if (window.scrollY > 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);
    return (
        <>
            <SEO
                title="Contact"
                description={strings.pages.contact.description}
                url="https://exoad.net/contacts"
            />
            <div className="min-h-screen bg-bg0">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="mb-12">
                        <h2 className="text-[10px] uppercase tracking-[0.2em] text-fg4 mb-4 font-sans">Get in Touch</h2>
                        <h1 className="text-4xl md:text-6xl font-bold text-fg0 mb-2 transition-all duration-700">
                            {strings.pages.contact.title}
                        </h1>
                        <p className="text-fg3 text-base md:text-lg font-sans leading-relaxed mb-4 transition-all duration-700">
                            {strings.pages.contact.description}
                        </p>
                    </div>
                    <div className="border-b border-bg2 mb-12" />
                    <div className="flex flex-col md:flex-row items-center md:gap-16 gap-8 w-full">
                        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-8 w-full">
                            <ResumeBlock />
                            <div className="flex flex-col gap-6 mt-8 w-full max-w-md">
                                <ContactLink href="mailto:jackm@exoad.net" label="General Email" value="jackm@exoad.net" subtitle="For general inquiries and collaborations." />
                                <ContactLink href="mailto:jmeng2@terpmail.umd.edu" label="University Email" value="jmeng2@terpmail.umd.edu" subtitle="For academic and university-related correspondence." />
                                <ContactLink href="https://github.com/exoad" label="GitHub" value="github.com/exoad" />
                                <ContactLink href="https://www.linkedin.com/in/jack-meng/" label="LinkedIn" value="linkedin.com/in/jack-meng/" subtitle="Connect with me professionally." />
                                <ContactLink label="Discord" href="https://discord.com/users/862856706323906581" value="exoad" subtitle="Slow replies." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function ResumeBlock() {
    return <div className="w-full max-w-md mt-4 mb-2 flex flex-col items-center md:items-start">
        <a
            href="https://exoad.github.io/me-pictures-bucket/Resume%20(V5).pdf"
            target="_blank"
            aria-label={strings.pages.contact.resume.aria}
            rel="noopener noreferrer"
            className="relative flex items-center justify-center px-6 py-3 text-fg0 font-montserrat font-semibold transition-all duration-700 group"
        >
            <span className="relative z-10 text-[1rem] font-semibold tracking-wide transition-transform duration-300 group-hover:scale-105">
                {strings.pages.contact.resume.button_label}
            </span>
            <span className="absolute left-0 bottom-0 w-full h-px bg-gb-orange" />
        </a>
        <span className="text-xs text-fg4 font-montserrat mt-2">
            {strings.pages.contact.resume.updated}
        </span>
    </div>;
}

interface ContactLinkProps {
    href: string;
    label: string;
    value: string;
    subtitle?: string;
}

function ContactLink({ href, label, value, subtitle = "" }: ContactLinkProps) {
    const isEmail = href.startsWith("mailto:");
    
    return (
        <Column className="items-center md:items-start">
            <div className="flex items-center gap-2">
                <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-fg1 font-sans transition-colors duration-200 group"
                >
                    <span className="font-bold text-xl">{label}</span>
                    <span className="text-fg3 group-hover:text-fg2 transition-colors duration-200">{value}</span>
                </a>
                {isEmail && <CopyEmailButton email={value} />}
            </div>
            {subtitle && (
                <span className="text-xs italic text-fg4 font-sans mt-1">
                    {subtitle}
                </span>
            )}
        </Column>
    );
}
