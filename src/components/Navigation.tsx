import NavLink from './NavLink';

interface NavigationProps {
    items: { path: string; label: string; }[];
    onNavigate: (path: string) => void;
}

export default function Navigation({ items, onNavigate }: Readonly<NavigationProps>) {
    return (
        <nav className="flex gap-6 md:gap-12">
            {items.map((item) => (
                <NavLink
                    key={item.path}
                    path={item.path}
                    label={item.label}
                    onClick={onNavigate}
                />
            ))}
        </nav>
    );
}
