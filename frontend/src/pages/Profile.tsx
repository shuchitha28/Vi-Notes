import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  profilePic: string | undefined;
  username: string;
  email: string;
  bio: string;
  completedSessions: number;
  avgTypingSpeed: number;
  score: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    };
    fetchProfile();
  }, []);

  if (!user){
  return (
    <div className="flex items-center justify-center flex-grow w-full min-h-screen bg-transparent">
      <div className="flex flex-col items-center gap-6 p-8 border shadow-2xl bg-white/5 border-white/10 rounded-3xl backdrop-blur-xl">

        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin shadow-[0_0_25px_rgba(99,102,241,0.6)]"></div>

          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full blur-xl bg-indigo-500/20 animate-pulse"></div>
        </div>

        {/* Text */}
        <p className="text-sm tracking-wide text-gray-400 animate-pulse">
          Loading profile...
        </p>
      </div>
    </div>
  );
}
  
  return (
    <div className="flex flex-col items-center justify-center flex-grow w-full px-6 py-12 font-sans text-white">
      
      <div className="w-full max-w-lg p-8 border shadow-2xl bg-white/5 border-white/10 rounded-3xl backdrop-blur-xl hover:border-blue-400 hover:shadow-[0_0_40px_rgba(99,102,241,0.7)] transition-all">

        {/* Avatar + Name */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <img
              src={
                user.profilePic ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              className="w-28 h-28 mb-4 border-2 border-indigo-500 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(99,102,241,0.8)]"
            />
          </div>

          <h2 className="text-3xl font-bold tracking-wide text-white">
            {user.username}
          </h2>
          <p className="mt-1 text-sm text-gray-400">{user.email}</p>
        </div>

        {/* Bio */}
        <div className="p-4 mb-6 text-center border bg-white/5 border-white/10 rounded-xl">
          <p className="text-sm italic text-gray-300">
            {user.bio || "No bio added yet..."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">

          <div className="p-4 text-center transition border rounded-xl bg-white/5 border-white/10 hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <p className="text-sm text-gray-400">Sessions</p>
            <h3 className="text-xl font-semibold text-indigo-400">
              {user.completedSessions}
            </h3>
          </div>

          <div className="p-4 text-center transition border rounded-xl bg-white/5 border-white/10 hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]">
            <p className="text-sm text-gray-400">Speed</p>
            <h3 className="text-xl font-semibold text-pink-400">
              {user.avgTypingSpeed} WPM
            </h3>
          </div>

          <div className="p-4 text-center transition border rounded-xl bg-white/5 border-white/10 hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            <p className="text-sm text-gray-400">Score</p>
            <h3 className="text-xl font-semibold text-green-400">
              {user.score}
            </h3>
          </div>

          <div className="p-4 text-center transition border rounded-xl bg-white/5 border-white/10 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <p className="text-sm text-gray-400">Level</p>
            <h3 className="text-xl font-semibold text-purple-400">
              {Math.floor(user.score / 100)}
            </h3>
          </div>

        </div>
      </div>
    </div>
  );
}