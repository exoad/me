import "../styles/StarsBg.css";

export default function StarBg({ scrollY }: Readonly<{ scrollY: number; }>) {
    return (
        <div className="star-bg" style={{ opacity: Math.max(0, 1 - scrollY / 500) }}>
            <div className="shooting-star-norm"></div>
            <div className="steep-path-star"></div>
            <div className="mov-star"></div>
            <div className="slow-mov-star"></div>
        </div>
    );
};