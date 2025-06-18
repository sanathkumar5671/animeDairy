import { motion } from "framer-motion";

export const AnimatedHeader = () => {
  return (
    <div className="relative mb-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-6xl font-extrabold text-center text-white drop-shadow-lg"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-red-300">
          Anime
        </span>{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300">
          Diary
        </span>
      </motion.h1>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-300/50 via-pink-300/50 to-red-300/50 rounded-full"
      />
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-300/20 via-pink-300/20 to-red-300/20 rounded-lg blur opacity-30 animate-pulse" />
    </div>
  );
};
