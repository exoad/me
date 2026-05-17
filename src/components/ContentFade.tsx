import { ReactNode } from 'react';
import '../styles/Animations.css';

interface ContentFadeProps {
    children: ReactNode;
}

export default function ContentFade({ children }: ContentFadeProps) {
    return (
        <div className="content-fade">
            {children}
        </div>
    );
}
