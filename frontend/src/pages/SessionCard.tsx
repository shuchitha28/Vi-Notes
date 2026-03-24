import { motion } from "framer-motion";

interface SessionCardProps {
  session: any;
  onEdit?: (s: any) => void;
  onView?: (s: any) => void;
  onDelete?: (id: string) => void;
  showEdit?: boolean;
}

export default function SessionCard({
  session,
  onEdit,
  onView,
  onDelete,
  showEdit = false,
}: SessionCardProps) {
  return (
    <motion.div
      key={session._id}
      className="flex flex-col p-4 rounded-2xl border border-white/10 bg-black/30 shadow-lg backdrop-blur-lg transition-all duration-300 hover:border-purple-500 hover:shadow-[0_0_25px_rgba(128,0,255,0.6)]"
      style={{ width: "100%", height: "200px" }}
      whileHover={{ scale: 1.03 }}
    >
      <p className="mb-2 font-medium text-white truncate">{session.content}</p>

      {session.submitted && (
        <p className="mb-2 text-sm text-gray-400 truncate">
          Submitted: {new Date(session.updatedAt).toLocaleString()}
        </p>
      )}

      {session.submitted && (
        <div className="mb-2 overflow-hidden text-sm text-gray-300">
          <p className="truncate">Avg Speed: {session.analysis.avgSpeed.toFixed(2)} ms/keystroke</p>
          <p className="truncate">Paste Ratio: {session.analysis.pasteRatio.toFixed(2)}</p>
          <p className="truncate">Suspicion Score: {session.analysis.suspicionScore.toFixed(2)}</p>
        </div>
      )}

      <div className="flex gap-2 mt-auto">
        {showEdit && onEdit && (
          <motion.button
            onClick={() => onEdit(session)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.8)] transition-all duration-300 text-white text-sm"
          >
            Edit
          </motion.button>
        )}
        {onView && (
          <motion.button
            onClick={() => onView(session)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 font-semibold rounded-lg bg-gradient-to-r from-green-500 to-teal-500 shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.8)] transition-all duration-300 text-white text-sm"
          >
            View
          </motion.button>
        )}
        {onDelete && (
          <motion.button
            onClick={() => onDelete(session._id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 font-semibold rounded-lg bg-gradient-to-r from-red-500 to-pink-500 shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.8)] transition-all duration-300 text-white text-sm"
          >
            Delete
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}