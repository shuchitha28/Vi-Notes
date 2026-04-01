import { motion } from "framer-motion";

export default function Terms() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center flex-grow w-full px-6 py-12 font-sans text-gray-800 transition-colors duration-300 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:text-white dark:bg-gradient-to-br dark:from-indigo-900 dark:via-black dark:to-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        whileHover={{
          scale: 1.02,
          boxShadow: "0 0 30px rgba(129, 140, 248, 0.5)",
        }}
        className="w-full max-w-3xl p-10 space-y-6 transition-all duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl backdrop-blur-xl dark:bg-black/20 dark:border-white/10 dark:hover:border-blue-500 hover:border-blue-500"
      >
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
          Terms of Service
        </h1>

        <p>
          By using Vi-Notes, you agree to comply with our terms and guidelines.
          All content you create should be original and not infringe on the rights of others.
        </p>

        <p>
          Vi-Notes is provided “as is.” We are not responsible for loss of content or data,
          and users are responsible for maintaining backups of their work.
        </p>

        <p>
          We reserve the right to modify these terms at any time.
          Continued use of the service constitutes acceptance of any updates.
        </p>
      </motion.div>
    </motion.div>
  );
}