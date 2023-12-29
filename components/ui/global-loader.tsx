"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";

const GlobalLoader = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        className="fixed inset-0 bg-muted flex justify-center items-center z-50">
        <Loader className="h-80 w-80 animate-spin" />
        <span className="sr-only">Loading...</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlobalLoader;
