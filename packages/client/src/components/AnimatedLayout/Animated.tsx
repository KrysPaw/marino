import { motion } from 'framer-motion';
import { Outlet } from 'react-router';

export const Animated = (): React.JSX.Element => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -40 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -40 }}
		>
			<Outlet />
		</motion.div>
	);
};
