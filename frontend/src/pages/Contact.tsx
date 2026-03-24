import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/contact", { name, email, message });
      setStatus({ type: "success", message: "Message sent! We'll get back to you shortly." });
      setName(""); setEmail(""); setMessage("");
    } catch {
      setStatus({ type: "error", message: "Failed to send message. Please try again later." });
    }
  };

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center flex-grow w-full px-6 py-12 font-sans text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
        {/* Overlay with Glow */}
        <AnimatePresence>
        {status && (
            <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60"
            >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className={`relative p-8 rounded-2xl text-center max-w-sm text-white shadow-lg transition-all duration-300 ${
                status.type === "success"
                    ? "bg-green-500/90 shadow-[0_0_25px_rgba(72,255,175,0.8),0_0_50px_rgba(72,255,175,0.5)]"
                    : "bg-red-500/90 shadow-[0_0_25px_rgba(255,72,72,0.8),0_0_50px_rgba(255,72,72,0.5)]"
                }`}
            >
                {/* Close Button */}
                <button
                onClick={() => setStatus(null)}
                className="absolute text-xl font-bold text-white top-3 right-3 hover:text-gray-200"
                >
                &times;
                </button>

                <p className="text-lg font-semibold">{status.message}</p>
            </motion.div>
            </motion.div>
        )}
        </AnimatePresence>

      {/* Main Card */}
      <motion.div
        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(129, 140, 248, 0.7)" }}
        className="w-full max-w-3xl p-10 space-y-6 transition-all duration-300 border shadow-lg bg-black/20 border-white/10 rounded-2xl backdrop-blur-xl"
      >
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
          Contact Us
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg bg-black/30 border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg bg-black/30 border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-48 px-4 py-3 border rounded-lg resize-none bg-black/30 border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            type="submit"
                              className="w-full py-3 mt-6 font-semibold transition-all duration-300 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(99,102,241,0.8)] hover:brightness-110"
          >
            Send Message
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}