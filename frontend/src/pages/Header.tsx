import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

type Props = {
  isAuth: boolean;
  onLogout: () => void;
};

export default function Header({ isAuth, onLogout }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const NavLink = ({ to, label }: { to: string; label: string }) => {
    const isActive = location.pathname === to;

    return (
      <button
        onClick={() => navigate(to)}
        className={`px-3 py-1 transition-colors duration-300 rounded-lg text-white/70 hover:text-pink-400 ${
          isActive ? "text-pink-400" : ""
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <header className="flex items-center justify-between w-full px-10 py-6 shadow-lg bg-black/40 backdrop-blur-xl">
      <motion.h1
        onClick={() => navigate("/")}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-2xl font-extrabold text-transparent cursor-pointer bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400"
      >
        Vi-Notes
      </motion.h1>

      {isAuth && (
        <nav className="flex items-center gap-4">
          <NavLink to="/dashboard" label="Dashboard" />
          <NavLink to="/editor" label="Editor" />
          <NavLink to="/history" label="History" />
          <NavLink to="/profile" label="Profile" />
          <NavLink to="/settings" label="Settings" />

          <button
            onClick={onLogout}
            className="px-4 py-2 text-white transition-all duration-300 rounded-lg shadow-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-105 hover:brightness-110 hover:shadow-[0_0_15px_rgba(128,0,255,0.7)]"
          >
            Logout
          </button>
        </nav>
      )}
    </header>
  );
}