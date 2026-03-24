import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center flex-grow w-full px-6 py-12 font-sans text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(129, 140, 248, 0.7)" }}
        className="w-full max-w-3xl p-10 space-y-6 transition-all duration-300 border shadow-lg bg-black/20 border-white/10 rounded-2xl backdrop-blur-xl"
      >
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
          Privacy Policy
        </h1>

        <p>
          At Vi-Notes, your privacy is important to us. We do not share your personal data with third parties
          without consent.
        </p>
        <p>
          All content you create is stored securely and encrypted while at rest and in transit. You can request
          deletion of your data at any time by contacting us.
        </p>
        <p>
          Cookies and usage data are used only to improve user experience and analytics. No tracking beyond
          necessary app functionality is implemented.
        </p>
      </motion.div>
    </motion.div>
  );
}