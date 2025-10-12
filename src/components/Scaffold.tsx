import Footer from './Footer';
import MenuBar from './MenuBar';
import SpinningSquareDivider from './SpinningSquareDivider';

export default function Scaffold(children: Readonly<{ showSpinner?: boolean, children: React.ReactNode; }>) {
    return (
        <div className="relative select-none">
            <MenuBar />
            {children.children}
            {children.showSpinner ? <SpinningSquareDivider includeLine={false} /> : null}
            <Footer />
        </div>
    );
}