import { useState, useEffect } from "react";

interface PageLoadAnimationProps {
	children: React.ReactNode;
}

export default function PageLoadAnimation({
	children,
}: PageLoadAnimationProps) {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoaded(true);
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	return (
		<>
			{/* Black overlay that fades out */}
			<div
				style={{
					position: "fixed",
					inset: 0,
					backgroundColor: "#1d2021",
					opacity: isLoaded ? 0 : 1,
					pointerEvents: isLoaded ? "none" : "auto",
					transition: "opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1)",
					zIndex: 9999,
					willChange: "opacity",
				}}
			/>
			{/* Content container */}
			<div
				style={{
					opacity: isLoaded ? 1 : 0,
					transition: "opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.3s",
					willChange: "opacity",
				}}
			>
				{children}
			</div>
		</>
	);
}
