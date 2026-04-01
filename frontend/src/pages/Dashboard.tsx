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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 text-sm text-gray-800 bg-white border border-gray-300 rounded shadow-md dark:bg-black/80 dark:text-white">
          <p className="font-semibold">{label}</p>
          {payload.map((p: any, index: number) => (
            <p key={index} style={{ color: p.stroke }}>
              {p.name}: {p.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center flex-grow w-full min-h-screen bg-gray-50 dark:bg-transparent">
        <div className="flex flex-col items-center gap-6 p-8 bg-white border border-gray-200 shadow-2xl dark:bg-white/5 dark:border-white/10 rounded-3xl backdrop-blur-xl">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin shadow-[0_0_25px_rgba(99,102,241,0.6)]"></div>
            <div className="absolute inset-0 rounded-full blur-xl bg-indigo-500/20 animate-pulse"></div>
          </div>

          <p className="text-sm tracking-wide text-gray-500 dark:text-gray-400 animate-pulse">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 m-5 font-sans text-gray-800 dark:text-white dark:bg-transparent">
      
      {/* Title */}
      <h1 className="mb-10 text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
        Analytics Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 border shadow-lg bg-white dark:bg-black/30 border-gray-200 dark:border-white/10 rounded-2xl backdrop-blur-lg
          transition-shadow duration-300 hover:border-pink-400 dark:hover:border-pink-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)]"
        >
          <h3 className="mb-2 text-lg font-semibold text-pink-500">
            Total Sessions
          </h3>
          <p className="text-2xl font-bold">{data.totalSessions}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 border shadow-lg bg-white dark:bg-black/30 border-gray-200 dark:border-white/10 rounded-2xl backdrop-blur-lg
          transition-shadow duration-300 hover:border-blue-400 dark:hover:border-blue-400 hover:shadow-[0_0_20px_rgba(96,165,250,0.6)]"
        >
          <h3 className="mb-2 text-lg font-semibold text-blue-500">
            Avg Speed
          </h3>
          <p className="text-2xl font-bold">{data.avgSpeed} WPM</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 border shadow-lg bg-white dark:bg-black/30 border-gray-200 dark:border-white/10 rounded-2xl backdrop-blur-lg
          transition-shadow duration-300 hover:border-purple-400 dark:hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]"
        >
          <h3 className="mb-2 text-lg font-semibold text-purple-500">
            Avg Score
          </h3>
          <p className="text-2xl font-bold">{data.avgScore}</p>
        </motion.div>
      </div>

      {/* Speed Graph */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-6 mb-8 border shadow-lg bg-white dark:bg-black/30 border-gray-200 dark:border-white/10 rounded-2xl backdrop-blur-lg
        transition-shadow duration-300 hover:border-green-400 dark:hover:border-green-400 hover:shadow-[0_0_25px_rgba(74,222,128,0.6)]"
      >
        <h2 className="mb-4 text-xl font-semibold text-green-500">
          Typing Speed Trend
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.sessions}>
            <CartesianGrid strokeDasharray="3 3" stroke="#8884d820" />
            <XAxis dataKey="date" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="speed" stroke="#22c55e" strokeWidth={2} name="Speed (WPM)"/>
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Score Graph */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-6 border shadow-lg bg-white dark:bg-black/30 border-gray-200 dark:border-white/10 rounded-2xl backdrop-blur-lg
        transition-shadow duration-300 hover:border-blue-400  dark:hover:border-blue-400 hover:shadow-[0_0_25px_rgba(96,165,250,0.6)]"
      >
        <h2 className="mb-4 text-xl font-semibold text-blue-500">
          Score Trend
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.sessions}>
            <CartesianGrid strokeDasharray="3 3" stroke="#8884d820" />
            <XAxis dataKey="date" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} name="Score" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}