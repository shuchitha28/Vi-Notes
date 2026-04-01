import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="
      flex flex-col items-center justify-center w-full px-10 py-6 space-y-2

      /* LIGHT THEME */
      bg-white border-t border-gray-200 text-gray-600

      /* DARK THEME */
      dark:bg-black/40 dark:border-white/10 dark:text-white/70

      backdrop-blur-xl transition-colors duration-300
    "
    >
      <motion.p
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-sm"
      >
        © 2026 Vi-Notes. All rights reserved.
      </motion.p>

      <div className="flex space-x-4">
        <Link
          to="/privacy"
          className="
          transition-colors

          /* LIGHT */
          text-gray-600 hover:text-pink-500

          /* DARK */
          dark:text-white/70 dark:hover:text-pink-400
        "
        >
          Privacy
        </Link>

        <Link
          to="/terms"
          className="text-gray-600 transition-colors  hover:text-purple-500 dark:text-white/70 dark:hover:text-purple-400"
        >
          Terms
        </Link>

        <Link
          to="/contact"
          className="text-gray-600 transition-colors  hover:text-blue-500 dark:text-white/70 dark:hover:text-blue-400"
        >
          Contact
        </Link>
      </div>
    </footer>
  );
}