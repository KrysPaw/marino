import { AnimatePresence } from 'framer-motion';
import { cloneElement } from 'react';
import { useLocation, useOutlet } from 'react-router';

export const AnimatedLayout = (): React.JSX.Element => {
	const location = useLocation();
	const element = useOutlet();

	return (
		<AnimatePresence mode="wait" initial={true}>
			{element && cloneElement(element, { key: location.pathname })}
		</AnimatePresence>
	);
};
