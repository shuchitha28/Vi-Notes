import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type Props = {
  username: string;
  onLogout: () => void;
};

export default function LandingPage({ username }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center flex-grow w-full px-6 py-12 font-sans text-white bg-gradient-to-br from-indigo-900 via-black to-slate-900">
      <main className="flex flex-col items-center justify-center space-y-10">
        <motion.h2
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400"
        >
          Welcome to Vi-Notes, {username}!
        </motion.h2>

        <p className="max-w-xl text-lg text-center text-white/80">
          Access your notes, track your history, and manage your profile easily. 
          Vi-Notes helps you organize your thoughts with <span className="font-semibold text-white">behavioral intelligence</span>.
        </p>

        <div className="flex gap-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 transition-all rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 hover:brightness-110 hover:shadow-[0_0_25px_rgba(99,102,241,0.7)]"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate("/editor")}
            className="px-6 py-3 transition-all rounded-lg shadow-lg bg-gradient-to-r from-pink-500 to-indigo-500 hover:scale-105 hover:brightness-110 hover:shadow-[0_0_25px_rgba(236,72,153,0.7)]"
          >
            Create Note
          </button>
        </div>
      </main>
    </div>
  );
}