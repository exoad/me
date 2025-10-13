import Footer from './Footer';
import MenuBar from './MenuBar';
import SpinningSquareDivider from './SpinningSquareDivider';

export default function Scaffold(props: Readonly<{
    showSpinner?: boolean;
    useForcedPadding?: boolean;
    skipMenuBar?: boolean;
    skipFooter?: boolean;
    children: React.ReactNode;
}>) {
    return (
        <div className="relative select-none">
            {!props.skipMenuBar && <MenuBar />}
            {props.useForcedPadding ? (
                <div className="content-wrapper" style={{ paddingTop: props.skipMenuBar ? "0" : "6rem" }}>
                    {props.children}
                </div>
            ) : props.children}
            {props.showSpinner ? <SpinningSquareDivider includeLine={false} /> : null}
            {!props.skipFooter && <Footer />}
        </div>
    );
}