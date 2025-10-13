import Footer from './Footer';
import MenuBar from './MenuBar';
import SpinningSquareDivider from './SpinningSquareDivider';

export default function Scaffold(children: Readonly<{ showSpinner?: boolean, useForcedPadding?: boolean, children: React.ReactNode; }>) {
    return (
        <div className="relative select-none">
            <MenuBar />
            {children.useForcedPadding ? <div className="content-wrapper" style={{ paddingTop: "6rem" }}>
                {children.children}
            </div> : children.children}
            {children.showSpinner ? <SpinningSquareDivider includeLine={false} /> : null}
            <Footer />
        </div>
    );
}