import { useEffect, useState } from 'react';

interface Size {
	width: number;
	height: number;
}

export function useOnResize(): Size {
	const getSize = (): Size => ({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const [size, setSize] = useState<Size>(getSize);

	useEffect(() => {
		const handleResize = () => setSize(getSize());
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return size;
}
