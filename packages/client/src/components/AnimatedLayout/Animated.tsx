import { motion } from 'framer-motion';

type Props = {
	children?: React.ReactNode;
};

export const Animated = ({ children }: Props): React.JSX.Element => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -40 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -40 }}
		>
			{children}
		</motion.div>
	);
};
