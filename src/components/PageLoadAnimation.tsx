import { useState, useEffect } from "react";

interface PageLoadAnimationProps {
	children: React.ReactNode;
}

export default function PageLoadAnimation({
	children,
}: PageLoadAnimationProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Force a reflow to ensure animation plays
		const raf1 = requestAnimationFrame(() => {
			const raf2 = requestAnimationFrame(() => {
				setIsVisible(true);
			});
			return () => cancelAnimationFrame(raf2);
		});
		
		return () => cancelAnimationFrame(raf1);
	}, []);

	return (
		<div
			className="transition-all duration-1000 ease-out"
			style={{
				opacity: isVisible ? 1 : 0,
				transform: isVisible ? "translateY(0)" : "translateY(16px)",
				transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
			}}
		>
			{children}
		</div>
	);
}
