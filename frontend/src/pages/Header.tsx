import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSun, FiMoon } from "react-icons/fi";

type Props = {
  isAuth: boolean;
  onLogout: () => void;
  theme: string;
  setTheme: (theme: string) => void;
};

export default function Header({ isAuth, onLogout, theme, setTheme }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const NavLink = ({ to, label }: { to: string; label: string }) => {
    const isActive = location.pathname === to;

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(to)}
        className={
          isActive
            ? "px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
            : "px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/20"
        }
      >
        {label}
      </motion.button>
    );
  };

  return (
    <header className="flex items-center justify-between w-full px-10 py-6 bg-white border-b border-gray-200 shadow-lg backdrop-blur-xl dark:bg-black/40 dark:border-white/10">
      
      {/* Logo */}
      <motion.h1
        onClick={() => navigate("/")}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-2xl font-extrabold text-transparent cursor-pointer bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400"
      >
        Vi-Notes
      </motion.h1>

      <div className="flex items-center gap-4">
        
        {/* Theme Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 transition-all bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20"
        >
          {theme === "dark" ? (
            <FiSun className="text-yellow-400" size={20} />
          ) : (
            <FiMoon className="text-black dark:text-white" size={20} />
          )}
        </motion.button>

        {/* Nav */}
        {isAuth && (
          <nav className="flex items-center gap-4">
            <NavLink to="/dashboard" label="Dashboard" />
            <NavLink to="/editor" label="Editor" />
            <NavLink to="/history" label="History" />
            <NavLink to="/profile" label="Profile" />
            <NavLink to="/settings" label="Settings" />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="px-4 py-2 text-white transition-all duration-300 rounded-lg shadow-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-110"
            >
              Logout
            </motion.button>
          </nav>
        )}
      </div>
    </header>
  );
}