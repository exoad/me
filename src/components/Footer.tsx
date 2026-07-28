import { strings } from "../data/shared.ts";

export default function Footer() {
    return (
        <footer className="site-footer">
            <div style={{ whiteSpace: "pre-line" }}>{strings.footer.legals}</div>
            <div>
                {strings.footer.source.leading}{" "}
                <a href={strings.footer.source.url} target="_blank" rel="noopener noreferrer">
                    {strings.footer.source.url_attr}
                </a>
            </div>
        </footer>
    );
}
