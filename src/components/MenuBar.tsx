import { useNavigate } from 'react-router-dom';
import { strings } from "../data/shared.ts";
import NameToggle from './NameToggle';
import Navigation from './Navigation';

export default function MenuBar() {
    const navigate = useNavigate();
    return (
        <header className="w-full fixed top-0 z-50 backdrop-blur-md bg-gb-bg0/70 border-b border-gb-bg3/50 brightness-125">
            <div className="flex justify-between items-center px-4 sm:px-8 md:px-16 lg:px-24 py-1">
                <NameToggle names={strings.header.names_funny} />
                <Navigation items={[
                    { path: '/', label: strings.navigation.home },
                    { path: '/blog', label: strings.navigation.blog },
                    { path: '/photos', label: strings.navigation.photos },
                    { path: '/guestbook', label: strings.navigation.guestbook }
                ]} onNavigate={(path: string) => {
                    navigate(path);
                }} />
            </div>
        </header>
    );
}
