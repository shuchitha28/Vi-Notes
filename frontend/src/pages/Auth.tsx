import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AiOutlineMail, AiOutlineLock, AiOutlineUser, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Auth({ onLogin }: { onLogin: (username: string) => void }) {
  const [isStarted, setIsStarted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");

      if (!isFlipped) {
        // LOGIN
        if (!loginEmail || !loginPassword) {
          setError("Please enter email and password");
          return;
        }

        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: loginEmail,
          password: loginPassword,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username); 
        onLogin(res.data.username);
      } else {
        // REGISTER
        if (!registerEmail || !registerPassword || !registerConfirmPassword) {
          setError("Please fill all fields");
          return;
        }

        if (registerPassword !== registerConfirmPassword) {
          setError("Passwords do not match");
          return;
        }

        await axios.post("http://localhost:5000/api/auth/register", {
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
          confirmPassword: registerConfirmPassword,
        });

        setIsFlipped(false);
        setError("Account created! Please login.");
        setRegisterUsername("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterConfirmPassword("");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const inputClass =
    "w-full pl-10 px-4 py-3 border rounded-lg outline-none bg-black/30 border-white/10 focus:ring-2 transition-all";

  return (
    <div className="flex h-[650px] overflow-hidden font-sans text-white bg-gradient-to-br from-indigo-900 via-black to-slate-900">
      {/* Left Panel */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: isStarted ? "50%" : "100%" }}
        transition={{ duration: 0.8 }}
        className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl top-10 left-10"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute w-[300px] h-[300px] bg-pink-300/10 rounded-full blur-3xl bottom-10 right-10"
        />

       ` <div className="relative z-10 px-12 text-center">
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
            alt="AI"
            animate={{ y: [0, -25, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mx-auto mb-8 w-44 drop-shadow-2xl"
          />

          <h1 className="relative mb-6 text-5xl font-extrabold tracking-tight text-white md:text-6xl">
            <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 
              [-webkit-text-stroke:5px_transparent] blur-[1px]">
              Vi-Notes
            </span>
            <span className="relative">Vi-Notes</span>
          </h1>

          <p className="mb-8 text-lg leading-relaxed text-white/80">
            Smartly verify authentic human writing using{" "}
            <span className="font-semibold text-white">behavioral intelligence</span>
          </p>

          {!isStarted && (
            <motion.button
              onClick={() => setIsStarted(true)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 font-semibold text-black bg-white rounded-lg shadow-lg hover:shadow-white/40"
            >
              Get Started
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Right Panel */}
      {isStarted && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center w-1/2 px-6 bg-black/40 backdrop-blur-xl"
        >
          <div className="perspective-[1200px]">
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-[350px] h-[500px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* LOGIN */}
              <div
                className="absolute w-full h-full p-8 border shadow-2xl bg-white/5 border-white/10 rounded-2xl backdrop-blur-xl"
                style={{ backfaceVisibility: "hidden" }}
              >
                <h2 className="mb-6 text-2xl font-bold text-center text-indigo-400">
                  Welcome Back
                </h2>

                {error && <p className="mb-3 text-sm text-center text-red-400">{error}</p>}

                <div className="space-y-4">
                  <div className="relative">
                    <AiOutlineMail className="absolute left-3 top-3.5 text-indigo-400" size={20} />
                    <input
                      placeholder="Email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className={inputClass + " focus:ring-indigo-500"}
                    />
                  </div>
                  <div className="relative">
                    <AiOutlineLock className="absolute left-3 top-3.5 text-indigo-400" size={20} />
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={inputClass + " focus:ring-indigo-500"}
                    />
                    <div
                      className="absolute right-3 top-3.5 cursor-pointer text-indigo-400"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full py-3 mt-6 font-semibold transition-all duration-300 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(99,102,241,0.8)] hover:brightness-110"
                >
                  Login
                </button>

                <p
                  onClick={() => {
                    setError("");
                    setIsFlipped(true);
                  }}
                  className="mt-6 text-sm text-center text-gray-300 cursor-pointer hover:text-white"
                >
                  Don't have an account? <span className="hover:text-purple-400">Register</span>
                </p>
              </div>

              {/* REGISTER */}
              <div
                className="absolute w-full h-full p-8 border shadow-2xl bg-white/5 border-white/10 rounded-2xl backdrop-blur-xl"
                style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
              >
                <h2 className="mb-6 text-2xl font-bold text-center text-pink-400">
                  Create Account
                </h2>

                {error && <p className="mb-3 text-sm text-center text-red-400">{error}</p>}

                <div className="space-y-4">
                  <div className="relative">
                    <AiOutlineUser className="absolute left-3 top-3.5 text-pink-400" size={20} />
                    <input
                      placeholder="Username"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      className={inputClass + " focus:ring-pink-500"}
                    />
                  </div>
                  <div className="relative">
                    <AiOutlineMail className="absolute left-3 top-3.5 text-pink-400" size={20} />
                    <input
                      placeholder="Email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className={inputClass + " focus:ring-pink-500"}
                    />
                  </div>
                  <div className="relative">
                    <AiOutlineLock className="absolute left-3 top-3.5 text-pink-400" size={20} />
                    <input
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="Password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className={inputClass + " focus:ring-pink-500"}
                    />
                    <div
                      className="absolute right-3 top-3.5 cursor-pointer text-pink-400"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    >
                      {showRegisterPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </div>
                  </div>
                  <div className="relative">
                    <AiOutlineLock className="absolute left-3 top-3.5 text-pink-400" size={20} />
                    <input
                      type={showRegisterConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className={inputClass + " focus:ring-pink-500"}
                    />
                    <div
                      className="absolute right-3 top-3.5 cursor-pointer text-pink-400"
                      onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                    >
                      {showRegisterConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full py-3 mt-6 font-semibold transition-all duration-300 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.7)]"
                >
                  Register
                </button>

                <p
                  onClick={() => {
                    setError("");
                    setIsFlipped(false);
                  }}
                  className="mt-6 text-sm text-center text-gray-300 cursor-pointer hover:text-white"
                >
                  Already have an account? <span className="hover:text-pink-400">Login</span>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}