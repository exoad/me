import { strings } from "../data/shared.ts";
import "../styles/Footer.css";
import { Column } from './FlexLayouter.tsx';

export default function Footer() {
    return (
        <footer className="footer-component w-full text-white/70 text-sm font-montserrat py-4 text-center">
            <Column className="md:flex-row" gap={2} mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                <div className="w-full md:w-1/3 md:text-left whitespace-pre-line order-2 md:order-1">
                    {strings.footer.legals}
                </div>
                <div className="w-full md:w-1/3 order-1 md:order-2 text-xs">
                    <div className="font-playfair font-bold">{strings.footer.site}</div>
                    <div className="pt-1">{strings.footer.pointer}</div>
                </div>
                <div className="w-full md:w-1/3 md:text-right order-3 whitespace-nowrap">
                    {strings.footer.source.leading} <a href={strings.footer.source.url} target="_blank" rel="noopener noreferrer"
                        className="text-white/80 hover:text-white transition-colors duration-300">
                        {strings.footer.source.url_attr}
                    </a>
                </div>
            </Column>
        </footer>
    );
}