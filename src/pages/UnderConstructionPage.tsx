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
                    <MdConstruction className="text-white text-8xl md:text-9xl" />
                    <p className="text-white text-xl md:text-5xl font-medium text-center font-playfair "
                    >
                        {strings.pages.under_construction.title}
                    </p>
                    <p className="text-white/70 text-base md:text-lg text-center max-w-md font-montserrat"
                    >
                        {strings.pages.under_construction.description}
                    </p>
                    <SpinningSquareDivider />
                    <div className="flex flex-row items-center justify-centergap-2 text-white/70">
                        <FiChevronLeft className="text-white text-2xl mt-4" />
                        <button
                            className="bg-transparent text-white md:text-base font-light py-3 px-6 cursor-pointer hover:text-gray-300 transition-colors duration-300 group font0-montserrat"
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
