import { useState, useEffect } from "react";

interface PageLoadAnimationProps {
	children: React.ReactNode;
}

export default function PageLoadAnimation({
	children,
}: PageLoadAnimationProps) {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		// Start animation after a brief delay to prevent flicker
		const timer = setTimeout(() => {
			setIsLoaded(true);
		}, 50);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div
			style={{
				opacity: isLoaded ? 1 : 0,
				transform: isLoaded ? "translateY(0)" : "translateY(8px)",
				transition: "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
				willChange: "opacity, transform",
			}}
		>
			{children}
		</div>
	);
}
