import { useState, useEffect } from "react";
import api from "../api/axios.js";

const UploadModal = ({ courseId, onSuccess }) => {
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("note"); // "note" or "dpp"
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (courseId) {
      api.get(`/chapters/course/${courseId}`)
        .then((res) => setChapters(res.data))
        .catch((err) => console.error("Error fetching chapters:", err));
    }
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/notes", {
        course: courseId,
        chapter: selectedChapter || null,
        title,
        type,
        fileUrl,
      });
      alert("Material uploaded successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-bold text-lg text-slate-900">Upload Study Material</h3>

      {/* Select Chapter */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
          Assign to Chapter (Optional)
        </label>
        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
        >
          <option value="">-- General (Unassigned) --</option>
          {chapters.map((ch) => (
            <option key={ch._id} value={ch._id}>
              Chapter {ch.order}: {ch.title}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Chapter 1 Handout"
          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
          required
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
        >
          <option value="note">Class Note (PDF)</option>
          <option value="dpp">Daily Practice Problem (DPP)</option>
        </select>
      </div>

      {/* File URL */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">File Link / URL</label>
        <input
          type="url"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          placeholder="https://example.com/file.pdf"
          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload File"}
      </button>
    </form>
  );
};

export default UploadModal;