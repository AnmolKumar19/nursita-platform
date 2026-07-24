import { useState } from "react";
import api from "../api/axios.js";

const GrantAccessModal = ({ courseId, courseName }) => {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      setStatusMessage({ type: "", text: "" });

      const { data } = await api.post("/enrollments/manual", {
        email: email.trim().toLowerCase(),
        courseId,
      });

      setStatusMessage({
        type: "success",
        text: data.message || "Access granted successfully!",
      });

      setEmail("");
      setTimeout(() => {
        setIsOpen(false);
        setStatusMessage({ type: "", text: "" });
      }, 1800);
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to grant access. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccess = async () => {
    if (!email.trim()) {
      setStatusMessage({ type: "error", text: "Please enter an email to revoke access." });
      return;
    }

    try {
      setLoading(true);
      setStatusMessage({ type: "", text: "" });

      const res = await api.post("/enrollments/revoke", {
        email: email.trim().toLowerCase(),
        courseId: courseId, // Using the correct prop
      });

      setStatusMessage({
        type: "success",
        text: res.data.message || "Access revoked successfully!",
      });

      setEmail("");
      setTimeout(() => {
        setIsOpen(false);
        setStatusMessage({ type: "", text: "" });
      }, 1800);
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err.response?.data?.message || "Error revoking access",
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (loading) return;
    setIsOpen(false);
    setEmail("");
    setStatusMessage({ type: "", text: "" });
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 shadow-xs transition-all active:scale-[0.98]"
      >
        <svg
          className="w-4 h-4 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <span>Manage Student Access</span>
      </button>

      {/* Modal Backdrop & Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Grant or Revoke Access</h3>
                  <p className="text-[11px] text-slate-500 truncate max-w-[240px]">
                    {courseName || "Select Course"}
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                disabled={loading}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form & Body */}
            <form onSubmit={handleGrantAccess} className="p-6 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Provide a student's registered account email to give them free access, or click revoke to remove their existing access.
              </p>

              {/* Status Banner */}
              {statusMessage.text && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                    statusMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-rose-50 text-rose-800 border-rose-200"
                  }`}
                >
                  <span className="shrink-0">
                    {statusMessage.type === "success" ? "✅" : "⚠️"}
                  </span>
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Student Account Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 text-sm text-slate-800 transition-all placeholder:text-slate-400"
                  required
                  disabled={loading}
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <div className="flex gap-2">
                  <button
                    type="button" // Important: type="button" prevents it from submitting the form
                    onClick={handleRevokeAccess}
                    disabled={loading}
                    className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 disabled:bg-slate-100 disabled:text-slate-400 border border-rose-200/80 rounded-xl transition-all"
                  >
                    {loading ? "..." : "Revoke"}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center px-5 py-2 text-xs font-bold text-slate-950 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-200 disabled:text-slate-400 rounded-xl shadow-xs transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Wait...
                      </span>
                    ) : (
                      "Grant Access"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GrantAccessModal;