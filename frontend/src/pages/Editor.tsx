import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Editor() {
  const location = useLocation();
  const navigate = useNavigate();
  const editingSession = location.state?.editingSession;

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

  // Handle typing
  const handleKeyDown = () => {
    const now = Date.now();
    keystrokes.current.push({
      keyInterval: now - lastTime.current,
      timestamp: now,
    });
    lastTime.current = now;
  };

  // Handle paste
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

  // Save draft
  const saveSession = async () => {
    if (!text.trim()) {
      setOverlayType("error");
      setOverlayMessage("Can't save empty session");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/session",
        {
          sessionId: currentSessionId,
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

  // Submit session
  const handleSubmit = async () => {
    if (!text.trim()) {
      setOverlayType("error");
      setOverlayMessage("Can't submit empty session");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/session/submit",
        {
          sessionId: currentSessionId,
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
    setCurrentSessionId(null);
    keystrokes.current = [];
    pasteEvents.current = [];
    lastTime.current = Date.now();
  };

  // Auto-hide overlay
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
    <div className="relative flex flex-col items-center justify-center flex-grow w-full px-6 py-12 font-sans text-white">
      <h1 className="mb-6 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
        Vi-Notes Editor
      </h1>

      <textarea
        id="editor-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="w-full max-w-3xl p-4 text-white border resize-none h-96 bg-black/30 border-white/10 rounded-2xl backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Start typing here..."
      />

      <div className="flex w-full max-w-3xl mt-6">
        {/* Clear */}
        <motion.button
          onClick={clearEditor}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 font-semibold rounded-lg bg-gradient-to-r from-red-500 to-pink-500 shadow-lg hover:shadow-[0_0_25px_rgba(239,68,68,0.8)] transition-all duration-300"
        >
          Clear
        </motion.button>

        {/* Save + Submit */}
        <div className="flex gap-4 ml-auto">
          <motion.button
            onClick={saveSession}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg hover:shadow-[0_0_25px_rgba(99,102,241,0.8)] transition-all duration-300"
          >
            Save Session
          </motion.button>

          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 font-semibold rounded-lg bg-gradient-to-r from-green-500 to-teal-500 shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.8)] transition-all duration-300"
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
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <div className="px-6 py-4 text-center bg-red-600 rounded-lg shadow-lg">
              <p className="text-lg font-bold text-white">
                ⚠️ Pasting is not recommended!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Alert Overlay */}
      <AnimatePresence>
        {overlayMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <div
              className={`px-6 py-4 text-center rounded-lg shadow-lg ${
                overlayType === "success" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              <p className="text-lg font-bold text-white">
                {overlayMessage}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}