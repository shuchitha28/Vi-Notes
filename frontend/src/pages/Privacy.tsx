import { motion } from "framer-motion";

export default function Privacy() {
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
          Privacy Policy
        </h1>

        <p>
          At Vi-Notes, your privacy is important to us. We do not share your personal
          data with third parties without consent.
        </p>

        <p>
          All content you create is stored securely and encrypted while at rest
          and in transit. You can request deletion of your data at any time by contacting us.
        </p>

        <p>
          Cookies and usage data are used only to improve user experience and analytics.
          No tracking beyond necessary app functionality is implemented.
        </p>
      </motion.div>
    </motion.div>
  );
}