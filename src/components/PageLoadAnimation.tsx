import { useState, useEffect } from "react";

interface PageLoadAnimationProps {
	children: React.ReactNode;
}

export default function PageLoadAnimation({
	children,
}: PageLoadAnimationProps) {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		// Use a single timeout for smoother, non-flickery animation
		const timer = setTimeout(() => {
			setIsLoaded(true);
		}, 150);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div
			style={{
				opacity: isLoaded ? 1 : 0,
				transform: isLoaded ? "translateY(0)" : "translateY(12px)",
				transition:
					"opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1)",
				willChange: "opacity, transform",
			}}
		>
			{children}
		</div>
	);
}
