import { ReactNode } from 'react';
import '../styles/Animations.css';

interface ContentFadeProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
}

export default function ContentFade({ children, delay = 0, duration = 0.6 }: ContentFadeProps) {
    return (
        <div className="content-fade" style={{
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
        }}>
            {children}
        </div>
    );
}
