import SpinningSquareDivider from '../components/SpinningSquareDivider';
import { strings } from '../data/shared.ts';
import Scaffold, { ScaffoldContent } from '../components/Scaffold.tsx';
import HoverShowLine from '../components/HoverShowLine.tsx';
import StarBg from "../components/StarsBg";
import { Column } from '../components/FlexLayouter.tsx';
import { useEffect } from 'react';

export default function NotFound({ scaffoldProps = {} }) {
    useEffect(() => {
        if (window.scrollY > 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);
    return (
        <Scaffold showSpinner={false} {...scaffoldProps}>
            <StarBg scrollY={0} />
            <ScaffoldContent useDefaultLayout>

                <Column gap={16} mainAxisAlignment="center" className="transition-opacity duration-1000">
                    <h1
                        className="text-white text-8xl md:text-9xl font-bold font-playfair"
                        style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}
                    >
                        {strings.pages.not_found.super}
                    </h1>
                    <p className="text-white text-xl md:text-5xl font-medium text-center font-montserrat "
                    >
                        {strings.pages.not_found.title}
                    </p>
                    <p className="text-white/50 text-base md:text-lg text-center max-w-md font-montserrat"
                    >
                        {strings.pages.not_found.description}
                    </p>
                    <SpinningSquareDivider />
                    <button
                        className="bg-transparent text-white md:text-base font-light py-3 px-6 cursor-pointer hover:text-gray-300 transition-colors duration-300 group font0-montserrat"
                        onClick={() => globalThis.history.back()}
                    >
                        <span className="text-xl">
                            {strings.pages.not_found.go_back}
                        </span>
                        <HoverShowLine />
                    </button>
                </Column>
            </ScaffoldContent>
        </Scaffold>
    );
}
