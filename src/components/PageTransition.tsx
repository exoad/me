import { useEffect, useState, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Animations.css';

export default function PageTransition({ children, speed = 'default' }: Readonly<{
    children: ReactNode;
    speed?: 'default' | 'fast' | 'slow';
}>) {
    const location = useLocation();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [displayedLocation, setDisplayedLocation] = useState(location);
    const [content, setContent] = useState(children);
    useEffect(() => {
        if (displayedLocation.pathname === location.pathname) {
            return;
        }
        setIsTransitioning(true);
        const timer = setTimeout(() => {
            setDisplayedLocation(location);
            setContent(children);
            setIsTransitioning(false);
        }, 400);
        return () => clearTimeout(timer);
    }, [location, children, displayedLocation.pathname]);
    const transitionClass = isTransitioning
        ? `page-transition page-transition-exit ${speed}`
        : `page-transition page-transition-enter ${speed}`;
    return (
        <div className={transitionClass}>
            {content}
        </div>
    );
}
