import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Auth";
import Editor from "./pages/Editor";
import History from "./pages/History";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import LandingPage from "./pages/LandingPage";

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  const handleLogin = (usernameFromServer: string) => {
    setIsAuth(true);
    setUsername(usernameFromServer);
    localStorage.setItem("username", usernameFromServer);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuth(false);
    setUsername("");
  };

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Router>
      <div
        className="flex flex-col min-h-screen text-gray-800 transition-colors duration-300 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:text-white dark:bg-gradient-to-br dark:from-indigo-900 dark:via-black dark:to-slate-900"
      >
        <Header
          isAuth={isAuth}
          onLogout={handleLogout}
          theme={theme}
          setTheme={setTheme}
        />

        <div className="flex flex-col flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth routes */}
            <Route
              path="/"
              element={
                isAuth ? (
                  <LandingPage
                    username={username}
                    onLogout={handleLogout}
                  />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />

            <Route
              path="/editor"
              element={isAuth ? <Editor /> : <Navigate to="/" />}
            />
            <Route
              path="/history"
              element={isAuth ? <History /> : <Navigate to="/" />}
            />
            <Route
              path="/profile"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
            <Route
              path="/settings"
              element={isAuth ? <SettingsPage /> : <Navigate to="/" />}
            />
            <Route
              path="/dashboard"
              element={isAuth ? <Dashboard /> : <Navigate to="/" />}
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;