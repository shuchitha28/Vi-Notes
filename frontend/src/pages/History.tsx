import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import SessionCard from "./SessionCard";
import { FiSave, FiCheckCircle, FiArrowLeft } from "react-icons/fi";

interface Session {
  _id: string;
  title: string;
  content: string;
  keystrokes: any[];
  pasteEvents: any[];
  analysis: {
    avgSpeed: number;
    pasteRatio: number;
    suspicionScore: number;
  };
  submitted: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function History() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [viewMode, setViewMode] = useState<"main" | "saved" | "completed">("main");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/session", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleEdit = (session: Session) => {
    navigate("/editor", { state: { editingSession: session } });
  };

  const handleView = (session: Session) => setActiveSession(session);
  const handleDelete = (sessionId: string) => setConfirmDeleteId(sessionId);

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/session/${confirmDeleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSessions((prev) =>
        prev.filter((s) => s._id !== confirmDeleteId)
      );
    } catch (err: any) {
      if (err.response?.status === 404) {
        setSessions((prev) =>
          prev.filter((s) => s._id !== confirmDeleteId)
        );
      } else {
        console.error("Failed to delete session:", err);
        setErrorMessage("Failed to delete session. Please try again.");
      }
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const downloadPDF = (session: Session & { userId?: { username: string } }) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let y = 20;

    const primary: [number, number, number] = [99, 102, 241];
    const secondary: [number, number, number] = [236, 72, 153];
    const textColor: [number, number, number] = [50, 50, 50];

    doc.setDrawColor(...primary);
    doc.setLineWidth(0.8);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    doc.setFontSize(18);
    doc.setTextColor(...primary);
    doc.setFont("helvetica", "bold");
    doc.text(session.title || "Untitled", pageWidth / 2, y, { align: "center" });

    y += 15;
    
    doc.setFontSize(12);
    doc.setTextColor(...secondary);
    doc.setFont("helvetica", "bold");
    doc.text("Session Details", margin, y);

    y += 8;
    doc.setTextColor(...textColor);

    doc.setFont("helvetica", "bold");
    doc.text("Username", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(`: ${session.userId?.username || "Unknown"}`, margin + 40, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Submitted", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(`: ${session.submitted ? "Yes" : "No"}`, margin + 40, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Created At", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(
      `: ${new Date(session.createdAt).toLocaleString()}`,
      margin + 40,
      y
    );
    y += 15;

    doc.setFontSize(14);
    doc.setTextColor(...primary);
    doc.setFont("helvetica", "bold");
    doc.text("Content", margin, y);

    y += 8;
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "normal");

    const lines = doc.splitTextToSize(session.content, pageWidth - margin * 2);

    lines.forEach((line: string | string[]) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        doc.setDrawColor(...primary);
        doc.setLineWidth(0.8);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
        y = margin;
      }
      doc.text(line, margin, y);
      y += 7;
    });

    y += 10;

    doc.setFontSize(14);
    doc.setTextColor(...secondary);
    doc.setFont("helvetica", "bold");
    doc.text("Analysis Report", margin, y);

    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(...textColor);

    const reportLines = [
      { label: "Average Speed", value: `: ${session.analysis.avgSpeed.toFixed(2)} ms/keystroke` },
      { label: "Paste Ratio", value: `: ${session.analysis.pasteRatio.toFixed(2)}` },
      { label: "Suspicion Score", value: `: ${session.analysis.suspicionScore.toFixed(2)}` },
    ];

    reportLines.forEach((item) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        doc.setDrawColor(...primary);
        doc.setLineWidth(0.8);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
        y = margin;
      }

      doc.setFont("helvetica", "bold");
      doc.text(item.label, margin, y);

      doc.setFont("helvetica", "normal");
      doc.text(item.value, margin + 60, y);
      y += 8;
    });

    const safeUsername = (session.userId?.username || "user").replace(/\s+/g, "_");
    doc.save(`session_${safeUsername}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-grow w-full min-h-screen bg-gray-100 dark:bg-transparent">
        <div className="flex flex-col items-center gap-6 p-8 bg-white border border-gray-200 shadow-2xl rounded-3xl backdrop-blur-xl dark:bg-white/5 dark:border-white/10">

          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
          </div>

          <p className="text-sm tracking-wide text-gray-600 dark:text-gray-400 animate-pulse">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  const savedSessions = sessions.filter((s) => !s.submitted);
  const completedSessions = sessions.filter((s) => s.submitted);

  if (viewMode === "main") {
    return (
      <div className="flex flex-col items-center justify-center flex-grow w-full text-gray-900 dark:text-white">
        <h1 className="mb-10 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
          Session History
        </h1>

        <div className="flex justify-center gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode("saved")}
            className="flex flex-col items-center justify-center h-100 w-80 p-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg cursor-pointer hover:shadow-[0_0_35px_rgba(128,0,255,0.8)] transition-all"
          >
            <FiSave className="mb-6 text-white text-8xl" />
            <h2 className="text-2xl font-bold text-white">Saved Sessions</h2>
            <p className="mt-2 text-lg text-white/80">{savedSessions.length} Draft</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode("completed")}
            className="flex flex-col items-center justify-center h-96 w-80 p-8 rounded-2xl bg-gradient-to-r from-green-600 to-teal-500 shadow-lg cursor-pointer hover:shadow-[0_0_35px_rgba(0,255,128,0.8)] transition-all"
          >
            <FiCheckCircle className="mb-6 text-white text-8xl" />
            <h2 className="text-2xl font-bold text-white">Completed Sessions</h2>
            <p className="mt-2 text-lg text-white/80">{completedSessions.length} Session</p>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentSessions = viewMode === "saved" ? savedSessions : completedSessions;

  return (
    <div className="min-h-screen p-5 text-gray-900 bg-gray-100 dark:text-white dark:bg-gradient-to-br dark:from-indigo-900 dark:via-black dark:to-slate-900">
      
      <div className="flex items-center mb-6">
        <motion.button
          onClick={() => setViewMode("main")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(128,0,255,0.6)] transition-all duration-300"
        >
          <FiArrowLeft /> Back
        </motion.button>

        <h1
          className={`ml-4 text-3xl font-bold ${
            viewMode === "saved"
              ? "text-purple-600 dark:text-purple-400"
              : "text-green-600 dark:text-green-400"
          }`}
        >
          {viewMode === "saved" ? "Saved Sessions" : "Completed Sessions"}
        </h1>
      </div>

      {currentSessions.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No sessions found.</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {currentSessions.map((s) => (
          <SessionCard
            key={s._id}
            session={s}
            showEdit={!s.submitted}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Overlay Modal */}
      <AnimatePresence>
        {activeSession && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 dark:bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveSession(null)}
          >
            <motion.div
              className="w-11/12 max-w-3xl p-6 overflow-y-auto transition-all duration-300 border shadow-lg bg-white rounded-2xl text-gray-900 max-h-[80vh] border-gray-200 backdrop-blur-lg dark:bg-black/30 dark:text-white dark:border-white/10 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-[0_0_35px_rgba(128,0,255,0.7)]"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="mb-6 text-3xl font-bold text-transparent bg-gradient-to-r from-pink-500 via-blue-500 to-purple-600 bg-clip-text">
                Session Details
              </h2>

              <div className="mb-5">
                <h3 className="mb-2 font-bold text-pink-600 dark:text-pink-400">
                  Title:
                </h3>
                <p className="text-gray-800 whitespace-pre-wrap dark:text-gray-100">
                  {activeSession.title || "Untitled"}
                </p>
              </div>

              <div className="mb-5">
                <h3 className="mb-2 font-bold text-purple-600 dark:text-purple-400">
                  Content:
                </h3>
                <p className="text-gray-800 whitespace-pre-wrap dark:text-gray-100">
                  {activeSession.content}
                </p>
              </div>

              <div className="mb-5">
                <h3 className="mb-2 font-bold text-red-600 dark:text-red-400">
                  Analysis Report:
                </h3>
                <p>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    Average Speed:
                  </span>{" "}
                  {activeSession.analysis.avgSpeed.toFixed(2)} ms/keystroke
                </p>
                <p>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    Paste Ratio:
                  </span>{" "}
                  {activeSession.analysis.pasteRatio.toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    Suspicion Score:
                  </span>{" "}
                  {activeSession.analysis.suspicionScore.toFixed(2)}
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <motion.button
                  onClick={() => downloadPDF(activeSession)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 font-semibold text-white rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-[0_0_20px_rgba(128,0,255,0.6)] transition-all duration-300"
                >
                  Download PDF
                </motion.button>

                <motion.button
                  onClick={() => setActiveSession(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 font-semibold text-white bg-red-500 rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(255,0,128,0.6)] transition-all duration-300"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Confirm Delete Modal */}
        {confirmDeleteId && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 dark:bg-black/80"
          >
            <motion.div
              className="w-11/12 max-w-md p-6 transition-all duration-300 border shadow-lg bg-white rounded-2xl text-gray-900 border-gray-200 backdrop-blur-lg dark:bg-black/30 dark:text-white dark:border-white/10 hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(255,0,120,0.5)]"
            >
              <h2 className="mb-4 text-xl font-bold text-red-600 dark:text-red-400">
                Confirm Delete
              </h2>

              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Are you sure you want to delete this session? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-4 py-2 font-semibold transition-all duration-300 bg-gray-300 rounded-lg dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 font-semibold text-white transition-all duration-300 bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Error Modal */}
        {errorMessage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 dark:bg-black/80"
            onClick={() => setErrorMessage(null)}
          >
            <motion.div
              className="w-11/12 max-w-md p-6 text-gray-900 bg-white border border-red-300 shadow-lg rounded-2xl backdrop-blur-lg dark:bg-black/30 dark:text-white dark:border-red-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="mb-4 text-xl font-bold text-red-600 dark:text-red-400">
                Error
              </h2>

              <p className="mb-6 text-gray-600 dark:text-gray-300">
                {errorMessage}
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => setErrorMessage(null)}
                  className="px-4 py-2 text-white transition bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}