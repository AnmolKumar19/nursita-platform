import { useState, useEffect } from "react";
import api from "../api/axios.js";

const ChapterManagement = ({ courseId }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(1);

  useEffect(() => {
    if (courseId) fetchChapters();
  }, [courseId]);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      // Use /api/chapters/course/... or /chapters/course/... depending on your baseURL
      const { data } = await api.get(`/api/chapters/course/${courseId}`);
      setChapters(data);
      setOrder(data.length + 1);
    } catch (err) {
      console.error("Failed to load chapters", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChapter = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Chapter title is required");

    try {
      const { data } = await api.post("/api/chapters", {
        courseId,
        title,
        description,
        order: Number(order),
      });

      setChapters((prev) => [...prev, data].sort((a, b) => a.order - b.order));
      setTitle("");
      setDescription("");
      setIsCreating(false);
      setOrder((prev) => prev + 1);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create chapter");
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm("Are you sure? This will unassign all lectures and files in this chapter.")) return;
    try {
      await api.delete(`/api/chapters/${chapterId}`);
      setChapters((prev) => prev.filter((ch) => ch._id !== chapterId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete chapter");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Creation Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Curriculum & Chapters</h2>
          <p className="text-slate-500 text-sm mt-0.5">Organize lectures, notes, and practice problems into structured modules.</p>
        </div>
        
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
        >
          {isCreating ? "Cancel" : "＋ Add New Chapter"}
        </button>
      </div>

      {/* Chapter Creation Form Modal/Card */}
      {isCreating && (
        <form onSubmit={handleCreateChapter} className="bg-white rounded-2xl border border-teal-500/30 ring-4 ring-teal-500/5 p-6 shadow-md space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">New Chapter Workspace</h3>
            <span className="text-xs font-mono bg-teal-50 text-teal-700 px-2.5 py-1 rounded-md font-semibold border border-teal-200/60">
              Sequence Index: #{order}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Chapter Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chapter 1: Introduction to Human Anatomy"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 text-sm text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Order Number</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 text-sm text-slate-800"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief overview of learning outcomes for this chapter..."
              rows="2"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 text-sm text-slate-800 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold text-sm transition-colors shadow-sm"
            >
              Save Chapter
            </button>
          </div>
        </form>
      )}

      {/* Chapters List View */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-400 font-medium">
          Loading curriculum layout...
        </div>
      ) : chapters.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto text-xl">
            📚
          </div>
          <h3 className="font-bold text-slate-800">No Chapters Created Yet</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Group your live classes, recordings, and PDFs into structured chapters to give your students a seamless learning roadmap.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {chapters.map((ch, index) => (
            <div
              key={ch._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Left Info Section */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-teal-500/10 group-hover:text-teal-600 text-slate-700 font-extrabold text-sm flex items-center justify-center border border-slate-200/60 transition-colors shrink-0">
                  #{ch.order || index + 1}
                </div>
                
                <div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-teal-600 transition-colors">
                    {ch.title}
                  </h3>
                  {ch.description ? (
                    <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{ch.description}</p>
                  ) : (
                    <p className="text-xs text-slate-400 italic mt-0.5">No description added</p>
                  )}
                </div>
              </div>

              {/* Right Action Section */}
              <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 justify-between md:justify-end">
                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200/60">
                  ID: {ch._id.slice(-6)}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteChapter(ch._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Chapter"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChapterManagement;