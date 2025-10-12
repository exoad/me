import { useNavigate } from 'react-router-dom';
import { strings } from "../data/shared.ts";
import NameToggle from './NameToggle';
import Navigation from './Navigation';

export default function MenuBar() {
    const navigate = useNavigate();
    return (
        <header className="w-full fixed top-0 z-50 backdrop-blur-sm bg-black/48 border-b-1 border-b-white/20">
            <div className="flex justify-between items-center" style={{ padding: '0.25rem 4rem' }}>
                <NameToggle names={strings.header.names_funny} />
                <Navigation items={[
                    { path: '/', label: strings.navigation.home },
                    { path: '/about', label: strings.navigation.about },
                    { path: '/projects', label: strings.navigation.projects },
                    { path: '/photos', label: strings.navigation.photos },
                    { path: '/socials', label: strings.navigation.socials }
                ]} onNavigate={(path: string) => {
                    navigate(path);
                }} />
            </div>
        </header>
    );
}
