import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center w-full px-10 py-6 space-y-2 bg-black/40 backdrop-blur-xl">
      <motion.p
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-sm text-white/70"
      >
        © 2026 Vi-Notes. All rights reserved.
      </motion.p>
      <div className="flex space-x-4">
        <Link
          to="/privacy"
          className="transition-colors text-white/70 hover:text-pink-500"
        >
          Privacy
        </Link>
        <Link
          to="/terms"
          className="transition-colors text-white/70 hover:text-purple-500"
        >
          Terms
        </Link>
        <Link
          to="/contact"
          className="transition-colors text-white/70 hover:text-blue-500"
        >
          Contact
        </Link>
      </div>
    </footer>
  );
}