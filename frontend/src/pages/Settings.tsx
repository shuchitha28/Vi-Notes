import { useEffect, useState } from "react";
import axios from "axios";
import {
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineFileText,
  AiOutlineEdit,
} from "react-icons/ai";

export default function SettingsPage() {
  const [user, setUser] = useState<any>({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const DEFAULT_AVATAR =
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Default";
  const [selectedAvatar, setSelectedAvatar] = useState<string>(DEFAULT_AVATAR);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState<"Face" | "Avatar" | "Robots">("Face");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | "loading">("loading");

  const generateAvatars = (style: string, count: number) => {
    return Array.from(
      { length: count },
      (_, i) => `https://api.dicebear.com/7.x/${style}/svg?seed=${style}-${i}`
    );
  };

  const avatarCategories = {
    Face: generateAvatars("adventurer", 12),
    Avatar: generateAvatars("avataaars", 12),
    Robots: generateAvatars("bottts", 12),
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setSelectedAvatar(res.data.profilePic || DEFAULT_AVATAR);
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/user/profile",
        { ...user, profilePic: selectedAvatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus("success");
      setMessage("Profile updated successfully!");
      setShowOverlay(true);
    } catch {
      setStatus("error");
      setMessage("Failed to update profile");
      setShowOverlay(true);
    } finally {
      setTimeout(() => setShowOverlay(false), 1500);
    }
  };

  const handleResetPassword = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/user/reset-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus("success");
      setMessage("Password reset successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setShowOverlay(true);
    } catch {
      setStatus("error");
      setMessage("Failed to reset password");
      setShowOverlay(true);
    } finally {
      setTimeout(() => setShowOverlay(false), 1500);
    }
  };

  const inputClass =
    "w-full pl-10 px-4 py-3 border rounded-lg outline-none transition-all " +
    "bg-gray-100 border-gray-300 text-gray-900 focus:ring-2 " +
    "dark:bg-black/30 dark:border-white/10 dark:text-white";

  return (
    <div className="flex flex-wrap items-center justify-center flex-grow w-full gap-10 px-6 py-12 text-gray-900 bg-transparent dark:text-white dark:bg-transparent">

      {/* PROFILE CARD */}
      <div className="w-full max-w-md h-[520px] p-8 border shadow-2xl bg-white/70 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-2xl backdrop-blur-xl hover:border-purple-400 dark:hover:border-purple-400 hover:shadow-[0_0_40px_rgba(167,139,250,0.7)] transition-all flex flex-col justify-between">
        <div className="flex flex-col flex-grow">
          <h2 className="flex items-center justify-center gap-2 mb-6 text-2xl font-bold text-indigo-500 dark:text-indigo-400">
            <AiOutlineEdit size={22} /> Edit Profile
          </h2>

          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <img
                src={selectedAvatar}
                alt="Avatar"
                onClick={() => setShowModal(true)}
                className="w-24 h-24 mb-2 transition border-2 border-indigo-500 rounded-full cursor-pointer hover:scale-110 hover:shadow-[0_0_20px_rgba(99,102,241,0.8)]"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Click to change avatar</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <AiOutlineUser className="absolute left-3 top-3.5 text-indigo-500 dark:text-indigo-400" />
              <input
                className={inputClass + " focus:ring-indigo-500"}
                placeholder="Username"
                value={user.username || ""}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
            </div>

            <div className="relative">
              <AiOutlineMail className="absolute left-3 top-3.5 text-indigo-500 dark:text-indigo-400" />
              <input
                className={inputClass + " focus:ring-indigo-500"}
                placeholder="Email"
                value={user.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <AiOutlineFileText className="absolute left-3 top-3.5 text-indigo-500 dark:text-indigo-400" />
              <input
                className={inputClass + " focus:ring-indigo-500"}
                placeholder="Bio"
                value={user.bio || ""}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleUpdate}
          className="flex items-center justify-center w-full gap-2 py-3 mt-6 font-semibold text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(99,102,241,0.8)] hover:brightness-110"
        >
          <AiOutlineEdit size={18} />
          Save Changes
        </button>
      </div>

      {/* PASSWORD CARD */}
      <div className="w-full max-w-md h-[520px] p-8 border shadow-2xl bg-white/70 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-2xl backdrop-blur-xl hover:border-pink-400 dark:hover:border-pink-400 hover:shadow-[0_0_40px_rgba(236,72,153,0.7)] transition-all flex flex-col justify-between">
        <div className="flex flex-col flex-grow">
          <h2 className="flex items-center justify-center gap-2 mb-6 text-2xl font-bold text-pink-500 dark:text-pink-400">
            <AiOutlineLock size={22} /> Reset Password
          </h2>

          <div className="flex justify-center mb-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
              alt="Reset Password"
              className="w-32 h-32 dark:filter dark:brightness-0 dark:invert"
            />
          </div>

          <div className="space-y-4">
            <div className="relative">
              <AiOutlineLock className="absolute left-3 top-3.5 text-pink-500 dark:text-pink-400" />
              <input
                type={showCurrent ? "text" : "password"}
                className={inputClass + " pr-10 focus:ring-pink-500"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <div
                className="absolute right-3 top-3.5 cursor-pointer text-pink-500 dark:text-pink-400"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>

            <div className="relative">
              <AiOutlineLock className="absolute left-3 top-3.5 text-pink-500 dark:text-pink-400" />
              <input
                type={showNew ? "text" : "password"}
                className={inputClass + " pr-10 focus:ring-pink-500"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div
                className="absolute right-3 top-3.5 cursor-pointer text-pink-500 dark:text-pink-400"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleResetPassword}
          className="flex items-center justify-center w-full gap-2 py-3 mt-6 font-semibold text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(236,72,153,0.8)]"
        >
          <AiOutlineLock size={18} />
          Reset Password
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-[360px] p-6 border rounded-2xl bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10 backdrop-blur-xl text-gray-900 dark:text-white">
            <h3 className="mb-4 text-lg font-semibold text-center">
              Choose Avatar
            </h3>

            <div className="flex justify-center gap-2 mb-4">
              {["Face", "Avatar", "Robots"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat as any)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    category === cat
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-3">
              {avatarCategories[category].map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  onClick={() => {
                    setSelectedAvatar(avatar);
                    setShowModal(false);
                  }}
                  className={`w-14 h-14 rounded-full cursor-pointer border-2 transition ${
                    selectedAvatar === avatar
                      ? "border-indigo-500 scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 mt-5 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showOverlay && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className={`px-6 py-5 text-center border shadow-2xl rounded-xl backdrop-blur-xl transition-all duration-300
              ${
                status === "success"
                ? "bg-green-500 border-green-400/30"
                : "bg-red-500 border-red-400/30"
              }`}
            >
            {/* Message */}
            <p className="text-lg font-semibold text-white">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}