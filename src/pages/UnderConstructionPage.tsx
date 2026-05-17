import { useState, useEffect } from 'react';
import SpinningSquareDivider from '../components/SpinningSquareDivider';
import { strings } from '../data/shared.ts';
import Scaffold, { ScaffoldContent } from '../components/Scaffold.tsx';
import HoverShowLine from '../components/HoverShowLine.tsx';
import { FiChevronLeft } from 'react-icons/fi';
import { MdConstruction } from "react-icons/md";
import WarpTunnelBg from '../components/WarpTunnelBg.tsx';
export default function UnderConstruction({ scaffoldProps = {} }) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);
    return (
        <Scaffold showSpinner={false} {...scaffoldProps}>
            <ScaffoldContent useDefaultLayout>
                <WarpTunnelBg scrollY={1} />
                <div className={`flex flex-col items-center justify-center gap-16 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
                    <MdConstruction className="text-gb-orange text-8xl md:text-9xl" />
                    <p className="text-gb-fg0 text-xl md:text-5xl font-medium text-center "
                    >
                        {strings.pages.under_construction.title}
                    </p>
                    <p className="text-gb-fg3 text-base md:text-lg text-center max-w-md font-montserrat"
                    >
                        {strings.pages.under_construction.description}
                    </p>
                    <SpinningSquareDivider />
                    <div className="flex flex-row items-center justify-center gap-2 text-gb-fg3">
                        <FiChevronLeft className="text-gb-fg1 text-2xl mt-4" />
                        <button
                            className="bg-transparent text-gb-fg1 md:text-base font-light py-3 px-6 cursor-pointer hover:text-gb-orange transition-colors duration-300 group font-montserrat"
                            onClick={() => globalThis.history.back()}
                        >
                            <span className="text-xl">
                                {strings.pages.not_found.go_back}
                            </span>
                            <HoverShowLine />
                        </button>

                    </div>
                </div>
            </ScaffoldContent>
        </Scaffold>
    );
}
