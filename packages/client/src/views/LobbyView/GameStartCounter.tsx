import { AnimatePresence, motion } from "framer-motion";

type Props = {
  value: number;
};

export const GameStartCounter = ({ value }: Props): React.JSX.Element => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={value}
        initial={{ y: -20, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.25, type: "spring" }}
        style={{ display: "inline-block" }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
};
