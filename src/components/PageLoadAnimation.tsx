import { useEffect, useState } from "react";

interface PageLoadAnimationProps {
	children: React.ReactNode;
}

export default function PageLoadAnimation({
	children,
}: PageLoadAnimationProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// Small delay to ensure we're past any hydration issues
		const timer = setTimeout(() => {
			setMounted(true);
		}, 100);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className={mounted ? "animate-page-enter" : "opacity-0 translate-y-8"}>
			{children}
		</div>
	);
}
