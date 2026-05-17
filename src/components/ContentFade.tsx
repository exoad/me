import { ReactNode } from 'react';

interface ContentFadeProps {
    children: ReactNode;
}

export default function ContentFade({ children }: ContentFadeProps) {
    return <>{children}</>;
}
