import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Editor() {
  const location = useLocation();
  const navigate = useNavigate();
  const editingSession = location.state?.editingSession;
  const API_URL = import.meta.env.VITE_API_URL;

  const [title, setTitle] = useState(editingSession?.title || "");
  const [text, setText] = useState(editingSession?.content || "");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    editingSession?._id || null
  );

  const [showPasteWarning, setShowPasteWarning] = useState(false);

  const [overlayMessage, setOverlayMessage] = useState<string | null>(null);
  const [overlayType, setOverlayType] = useState<"success" | "error" | null>(null);

  const keystrokes = useRef<{ keyInterval: number; timestamp: number }[]>(
    editingSession?.keystrokes || []
  );
  const pasteEvents = useRef<{ length: number; timestamp: number }[]>(
    editingSession?.pasteEvents || []
  );
  const lastTime = useRef<number>(Date.now());

  const handleKeyDown = () => {
    const now = Date.now();
    keystrokes.current.push({
      keyInterval: now - lastTime.current,
      timestamp: now,
    });
    lastTime.current = now;
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");

    pasteEvents.current.push({
      length: pasted.length,
      timestamp: Date.now(),
    });

    setText((prev: string) => prev + pasted);

    setShowPasteWarning(true);
    setTimeout(() => setShowPasteWarning(false), 2000);
  };

  const saveSession = async () => {
    if (!title.trim()) {
      setOverlayType("error");
      setOverlayMessage("Please enter a title");
      return;
    }
    
    if (!text.trim()) {
      setOverlayType("error");
      setOverlayMessage("Can't save empty session");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/api/session`,
        {
          sessionId: currentSessionId,
          title,
          content: text,
          keystrokes: keystrokes.current,
          pasteEvents: pasteEvents.current,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentSessionId(res.data._id);

      setOverlayType("success");
      setOverlayMessage("Draft saved!");
    } catch (err) {
      console.error(err);
      setOverlayType("error");
      setOverlayMessage("Failed to save session");
    }
  };

  const handleSubmit = async () => {
      if (!title.trim()) {
      setOverlayType("error");
      setOverlayMessage("Please enter a title");
      return;
    }
    
    if (!text.trim()) {
      setOverlayType("error");
      setOverlayMessage("Can't submit empty session");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/api/session/submit`,
        {
          sessionId: currentSessionId,
          title,
          content: text,
          keystrokes: keystrokes.current,
          pasteEvents: pasteEvents.current,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOverlayType("success");
      setOverlayMessage("Session submitted!");

      setTimeout(() => navigate("/history"), 1200);
    } catch (err) {
      console.error(err);
      setOverlayType("error");
      setOverlayMessage("Failed to submit");
    }
  };

  const clearEditor = () => {
    setText("");
    setTitle("");
    setCurrentSessionId(null);
    keystrokes.current = [];
    pasteEvents.current = [];
    lastTime.current = Date.now();
  };

  useEffect(() => {
    if (overlayMessage) {
      const timer = setTimeout(() => {
        setOverlayMessage(null);
        setOverlayType(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [overlayMessage]);

  useEffect(() => {
    document.getElementById("editor-textarea")?.focus();
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-center flex-grow w-full px-6 py-12 font-sans text-white transition-colors duration-300 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:text-white dark:bg-gradient-to-br dark:from-indigo-900 dark:via-black dark:to-slate-900"
    >
      {/* Title */}
      <h1 className="mb-6 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
        Vi-Notes Editor
      </h1>

      <div className="flex w-full max-w-3xl mb-4">
        <div className="flex items-center justify-center w-24 px-3 py-2 mr-3 text-sm font-bold text-white rounded-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
          Title
        </div>
        
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter session title..."
          className="flex-1 p-3 text-gray-900 bg-white border border-gray-300 rounded-xl dark:border-white/20 dark:bg-black/30 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      {/* Textarea */}
      <textarea
        id="editor-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="w-full max-w-3xl p-4 text-gray-900 bg-white border border-gray-200 resize-none h-96 rounded-2xl backdrop-blur-lg dark:text-white dark:bg-black/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Start typing here..."
      />

      {/* Buttons */}
      <div className="flex w-full max-w-3xl mt-6">
        {/* Clear */}
        <motion.button
          onClick={clearEditor}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
          px-8 py-3 font-semibold rounded-lg shadow-lg
          bg-gradient-to-r from-red-500 to-pink-500
          hover:shadow-[0_0_25px_rgba(239,68,68,0.8)]
          transition-all duration-300
        "
        >
          Clear
        </motion.button>

        {/* Save + Submit */}
        <div className="flex gap-4 ml-auto">
          <motion.button
            onClick={saveSession}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
            px-8 py-3 font-semibold rounded-lg shadow-lg
            bg-gradient-to-r from-indigo-500 to-purple-500
            hover:shadow-[0_0_25px_rgba(99,102,241,0.8)]
            transition-all duration-300
          "
          >
            Save Session
          </motion.button>

          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
            px-8 py-3 font-semibold rounded-lg shadow-lg
            bg-gradient-to-r from-green-500 to-teal-500
            hover:shadow-[0_0_25px_rgba(16,185,129,0.8)]
            transition-all duration-300
          "
          >
            Submit
          </motion.button>
        </div>
      </div>

      {/* Paste warning */}
      <AnimatePresence>
        {showPasteWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm"
          >
            <div className="px-6 py-4 text-center text-white bg-red-600 rounded-lg shadow-lg">
              <p className="text-lg font-bold">
                ⚠️ Pasting is not recommended!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay messages */}
      <AnimatePresence>
        {overlayMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm"
          >
            <div
              className={`px-6 py-4 text-center rounded-lg shadow-lg text-white ${
                overlayType === "success" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              <p className="text-lg font-bold">{overlayMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
