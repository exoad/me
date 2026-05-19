import { ReactNode, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface ContentFadeProps {
    children: ReactNode;
}

export default function ContentFade({ children }: ContentFadeProps) {
    const location = useLocation();
    const routeKey = location.pathname;
    const [current, setCurrent] = useState({ key: routeKey, node: children });
    const [exiting, setExiting] = useState<{ key: string; node: ReactNode } | null>(null);
    const currentRef = useRef(current);
    const exitTimerRef = useRef<number | null>(null);

    useEffect(() => {
        const next = { key: routeKey, node: children };

        if (currentRef.current.key === routeKey) {
            currentRef.current = next;
            setCurrent(next);
            return;
        }

        if (exitTimerRef.current !== null) {
            window.clearTimeout(exitTimerRef.current);
        }

        setExiting(currentRef.current);
        currentRef.current = next;
        setCurrent(next);

        exitTimerRef.current = window.setTimeout(() => {
            setExiting(null);
            exitTimerRef.current = null;
        }, 180);

        return () => {
            if (exitTimerRef.current !== null) {
                window.clearTimeout(exitTimerRef.current);
                exitTimerRef.current = null;
            }
        };
    }, [children, routeKey]);

    return (
        <div className={`content-fade-stack${exiting ? ' is-transitioning' : ''}`}>
            {exiting && (
                <div
                    key={`exit-${exiting.key}`}
                    className="page-transition content-fade-layer content-fade-layer-exit"
                    aria-hidden="true"
                >
                    {exiting.node}
                </div>
            )}
            <div
                key={`enter-${current.key}`}
                className="page-transition content-fade-layer content-fade-layer-enter"
            >
                {current.node}
            </div>
        </div>
    );
}
