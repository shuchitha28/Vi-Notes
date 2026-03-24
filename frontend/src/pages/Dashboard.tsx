import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/user/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  if (!data){
    return (
      <div className="flex items-center justify-center flex-grow w-full min-h-screen bg-transparent">
        <div className="flex flex-col items-center gap-6 p-8 border shadow-2xl bg-white/5 border-white/10 rounded-3xl backdrop-blur-xl">

          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin shadow-[0_0_25px_rgba(99,102,241,0.6)]"></div>

            <div className="absolute inset-0 rounded-full blur-xl bg-indigo-500/20 animate-pulse"></div>
          </div>

          <p className="text-sm tracking-wide text-gray-400 animate-pulse">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 m-5 font-sans text-white">
      <h1 className="mb-10 text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
        Analytics Dashboard
      </h1>

      {/* 🔥 Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 border shadow-lg bg-black/30 border-white/10 rounded-2xl backdrop-blur-lg
                     transition-shadow duration-300 hover:border-pink-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.7)]"
        >
          <h3 className="mb-2 text-lg font-semibold text-pink-500">Total Sessions</h3>
          <p className="text-2xl font-bold">{data.totalSessions}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 border shadow-lg bg-black/30 border-white/10 rounded-2xl backdrop-blur-lg
                     transition-shadow duration-300 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(96,165,250,0.7)]"
        >
          <h3 className="mb-2 text-lg font-semibold text-blue-500">Avg Speed</h3>
          <p className="text-2xl font-bold">{data.avgSpeed} WPM</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 border shadow-lg bg-black/30 border-white/10 rounded-2xl backdrop-blur-lg
                     transition-shadow duration-300 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.7)]"
        >
          <h3 className="mb-2 text-lg font-semibold text-purple-500">Avg Score</h3>
          <p className="text-2xl font-bold">{data.avgScore}</p>
        </motion.div>
      </div>

      {/* 📈 Speed Graph */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-6 mb-8 border shadow-lg bg-black/30 border-white/10 rounded-2xl backdrop-blur-lg
                   transition-shadow duration-300 hover:border-green-400 hover:shadow-[0_0_25px_rgba(74,222,128,0.7)]"
      >
        <h2 className="mb-4 text-xl font-semibold text-green-500">Typing Speed Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.sessions}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: 8 }} />
            <Line type="monotone" dataKey="speed" stroke="#4ade80" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 📊 Score Graph */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-6 border shadow-lg bg-black/30 border-white/10 rounded-2xl backdrop-blur-lg
                   transition-shadow duration-300 hover:border-blue-400 hover:shadow-[0_0_25px_rgba(96,165,250,0.7)]"
      >
        <h2 className="mb-4 text-xl font-semibold text-blue-500">Score Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.sessions}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: 8 }} />
            <Line type="monotone" dataKey="score" stroke="#60a5fa" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}