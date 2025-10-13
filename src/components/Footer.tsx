import { strings } from "../data/shared.ts";
import "../styles/Footer.css";

export default function Footer() {
    return (
        <footer className="footer-component w-full text-white/60 text-sm font-montserrat py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                <div className="w-full md:w-1/3 text-center md:text-left whitespace-pre-line order-2 md:order-1">
                    {strings.footer.legals}
                </div>
                <div className="w-full md:w-1/3 text-center order-1 md:order-2 text-white/70">
                    <div className="text-xs font-playfair font-bold">{strings.footer.site}</div>
                    <div className="text-xs">{strings.footer.thank_you}</div>
                </div>
                <div className="w-full md:w-1/3 text-center md:text-right order-3 whitespace-nowrap">
                    {strings.footer.source.leading} <a href={strings.footer.source.url} target="_blank" rel="noopener noreferrer"
                        className="text-white/80 hover:text-white transition-colors duration-300">
                        {strings.footer.source.url_attr}
                    </a>
                </div>
            </div>
        </footer>
    );
}