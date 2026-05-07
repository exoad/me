import { useState, useEffect } from "react";

interface PageLoadAnimationProps {
	children: React.ReactNode;
}

export default function PageLoadAnimation({
	children,
}: PageLoadAnimationProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Slower fade in - wait a bit then animate
		const timeout = setTimeout(() => {
			const raf = requestAnimationFrame(() => {
				setIsVisible(true);
			});
			return () => cancelAnimationFrame(raf);
		}, 200);
		
		return () => clearTimeout(timeout);
	}, []);

	return (
		<div
			className="transition-all ease-out"
			style={{
				opacity: isVisible ? 1 : 0,
				transform: isVisible ? "translateY(0)" : "translateY(24px)",
				transitionDuration: "1.8s",
				transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
			}}
		>
			{children}
		</div>
	);
}
