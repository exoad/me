import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface ContentFadeProps {
    children: ReactNode;
}

export default function ContentFade({ children }: ContentFadeProps) {
    const location = useLocation();

    return (
        <div key={location.pathname} className="page-transition page-transition-enter">
            {children}
        </div>
    );
}
