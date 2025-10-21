import { useEffect } from 'react';
import Scaffold, { ScaffoldContent } from '../components/Scaffold';
import { strings } from '../data/shared.ts';
import { Column } from '../components/FlexLayouter.tsx';


export default function ContactPage({ scaffoldProps = {} }) {
    useEffect(() => {
        if (window.scrollY > 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);
    return (
        <Scaffold {...scaffoldProps}>
            <ScaffoldContent useDefaultLayout>
                <div className="flex flex-col md:flex-row items-center md:gap-16 gap-8 w-full max-w-4xl">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-8 w-full">
                        <h1 className="text-white text-4xl md:text-6xl font-bold font-playfair mb-2 transition-all duration-700">
                            {strings.pages.contact.title}
                        </h1>
                        <p className="text-white/70 text-base md:text-lg font-montserrat leading-relaxed mb-4 transition-all duration-700">
                            {strings.pages.contact.description}
                        </p>
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
            </ScaffoldContent>
        </Scaffold>
    );
}

function ResumeBlock() {
    return <div className="w-full max-w-md mt-4 mb-2 flex flex-col items-center md:items-start">
        <a
            href="https://exoad.github.io/me-pictures-bucket/Resume%20(V5).pdf"
            target="_blank"
            aria-label={strings.pages.contact.resume.aria}
            rel="noopener noreferrer"
            className="relative flex items-center justify-center px-6 py-3 rounded-md text-white font-montserrat font-semibold transition-all duration-700 group"
        >
            <span className="relative z-10 font-playfair text-[1rem] font-semibold tracking-wide transition-transform duration-300 group-hover:scale-105">
                {strings.pages.contact.resume.button_label}
            </span>
            <span className="absolute left-0 bottom-0 w-full h-px bg-white" />
        </a>
        <span className="text-xs text-white/60 font-montserrat mt-2">
            {strings.pages.contact.resume.updated}
        </span>
    </div>;
}

function ContactLink({ href, label, value, subtitle = "" }) {
    return (
        <Column className="items-center md:items-start">
            <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-white font-montserrat transition-colors duration-200"
            >
                <span className="font-bold font-playfair text-xl">{label}</span>
                <span className="text-white/70" >{value}</span>
            </a>
            {subtitle && (
                <span className="text-xs italic text-white/50 font-montserrat mt-1">
                    {subtitle}
                </span>
            )}
        </Column>
    );
}
