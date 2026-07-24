import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { NURSING_SUBJECTS } from "../constants.js";

const emptyCourse = { title: "", description: "", subject: NURSING_SUBJECTS[0], price: 0 };
const emptyClass = { title: "", description: "", youtubeUrlOrId: "", scheduledAt: "" };
const emptyNote = { title: "", type: "note" };

const InstructorPanel = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [classes, setClasses] = useState([]);

  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [classForm, setClassForm] = useState(emptyClass);
  const [noteForm, setNoteForm] = useState(emptyNote);
  const [noteFile, setNoteFile] = useState(null);
  
  // Grant Access Form state
  const [grantEmail, setGrantEmail] = useState("");
  const [grantCourseId, setGrantCourseId] = useState("");
  const [grantLoading, setGrantLoading] = useState(false);

  const [status, setStatus] = useState("");

  const loadCourses = () => api.get("/courses/mine").then((res) => setCourses(res.data));

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      api.get(`/classes/course/${selectedCourse}`).then((res) => setClasses(res.data));
    }
  }, [selectedCourse]);

  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/courses/${courseId}`);
      setSelectedCourse("");
      setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId));
      setStatus("Course deleted successfully.");
    } catch (error) {
      console.error("Error deleting course:", error);
      alert(error.response?.data?.message || "Failed to delete the course.");
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/courses", courseForm);
      setCourses([res.data, ...courses]);
      setCourseForm(emptyCourse);
      setStatus("Course created successfully.");
    } catch (err) {
      setStatus(err.response?.data?.message || "Error creating course.");
    }
  };

  const handleScheduleClass = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return setStatus("Pick a course first.");
    try {
      const res = await api.post("/classes", { courseId: selectedCourse, ...classForm });
      setClasses([res.data, ...classes]);
      setClassForm(emptyClass);
      setStatus("Class scheduled.");
    } catch (err) {
      setStatus(err.response?.data?.message || "Error scheduling class.");
    }
  };

  const toggleClassStatus = async (cls, newStatus) => {
    try {
      const res = await api.patch(`/classes/${cls._id}/status`, { status: newStatus });
      setClasses(classes.map((c) => (c._id === cls._id ? res.data : c)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadNote = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return setStatus("Pick a course first.");
    if (!noteFile) return setStatus("Choose a file to upload.");
    try {
      const fd = new FormData();
      fd.append("courseId", selectedCourse);
      fd.append("title", noteForm.title);
      fd.append("type", noteForm.type);
      fd.append("file", noteFile);
      await api.post("/notes", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setNoteForm(emptyNote);
      setNoteFile(null);
      setStatus(`${noteForm.type === "dpp" ? "DPP" : "Note"} uploaded.`);
    } catch (err) {
      setStatus(err.response?.data?.message || "Error uploading file.");
    }
  };

  // Handle manual enrollment
  const handleGrantAccess = async (e) => {
    e.preventDefault();
    if (!grantEmail || !grantCourseId) return;
    setGrantLoading(true);
    try {
      const res = await api.post("/enrollments/manual", {
        email: grantEmail,
        courseId: grantCourseId,
      });
      setStatus(res.data.message || `Granted free access to ${grantEmail}`);
      setGrantEmail("");
      setGrantCourseId("");
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to grant access.");
    } finally {
      setGrantLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Teaching Panel</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your course batches, live classes, and study resources.</p>
        </div>
      </div>

      {status && (
        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-semibold flex items-center justify-between">
          <span>{status}</span>
          <button onClick={() => setStatus("")} className="text-amber-600 hover:text-amber-900 font-bold text-xs">✕</button>
        </div>
      )}

      {/* SECTION 1: CREATE NEW COURSE */}
      <section className="mt-8 p-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Create New Course Batch</h2>
        <form onSubmit={handleCreateCourse} className="grid sm:grid-cols-2 gap-4 mt-4">
          <input
            placeholder="Course Title"
            required
            value={courseForm.title}
            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 sm:col-span-2"
          />
          <textarea
            placeholder="Description"
            required
            value={courseForm.description}
            onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 sm:col-span-2"
            rows={3}
          />
          <select
            value={courseForm.subject}
            onChange={(e) => setCourseForm({ ...courseForm, subject: e.target.value })}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-amber-500"
          >
            {NURSING_SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            placeholder="Price in ₹ (0 = free)"
            value={courseForm.price}
            onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
          />
          <button className="sm:col-span-2 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-md active:scale-95">
            Create Course
          </button>
        </form>
      </section>

      {/* SECTION 2: GRANT FREE STUDENT ACCESS */}
      <section className="mt-8 p-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🎁</span>
          <h2 className="text-xl font-bold text-slate-900">Grant Free Student Access</h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">Enroll a student into a batch directly without requiring payment.</p>
        
        <form onSubmit={handleGrantAccess} className="grid sm:grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Student email (e.g. student@gmail.com)"
            required
            value={grantEmail}
            onChange={(e) => setGrantEmail(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
          />
          <select
            required
            value={grantCourseId}
            onChange={(e) => setGrantCourseId(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-amber-500"
          >
            <option value="">Select Batch...</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
          <button
            disabled={grantLoading}
            className="sm:col-span-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-sm active:scale-95 disabled:opacity-60"
          >
            {grantLoading ? "Granting Access..." : "Grant Free Access"}
          </button>
        </form>
      </section>

      {/* SECTION 3: MANAGE COURSE CONTENT */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Manage Batch Content</h2>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="mt-3 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 w-full sm:w-auto"
        >
          <option value="">Select a course to manage…</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </section>

      {selectedCourse && (
        <div className="mt-6 space-y-6">
          {/* Delete Course Option */}
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDeleteCourse(selectedCourse);
              }}
              className="bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            >
              🗑️ Delete Selected Course
            </button>
          </div>

          {/* Schedule Class Form */}
          <section className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Schedule a Live Class</h3>
            <p className="text-xs text-slate-500 mt-1">
              Create the stream on YouTube Studio first, then paste the link here.
            </p>
            <form onSubmit={handleScheduleClass} className="grid sm:grid-cols-2 gap-4 mt-4">
              <input
                placeholder="Class title"
                required
                value={classForm.title}
                onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:col-span-2"
              />
              <input
                placeholder="YouTube link or video ID"
                required
                value={classForm.youtubeUrlOrId}
                onChange={(e) => setClassForm({ ...classForm, youtubeUrlOrId: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:col-span-2"
              />
              <input
                type="datetime-local"
                required
                value={classForm.scheduledAt}
                onChange={(e) => setClassForm({ ...classForm, scheduledAt: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
              <input
                placeholder="Short description (optional)"
                value={classForm.description}
                onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
              <button className="sm:col-span-2 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-md">
                Schedule Class
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {classes.map((c) => (
                <div key={c._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-100 pt-3 gap-2">
                  <span className="text-sm font-semibold text-slate-800">{c.title}</span>
                  <div className="flex gap-2">
                    {["scheduled", "live", "ended"].map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleClassStatus(c, s)}
                        className={`text-xs px-3 py-1 rounded-full border font-bold capitalize transition-all ${
                          c.status === s
                            ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                            : "border-slate-200 text-slate-500 hover:border-slate-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upload Notes / DPP Form */}
          <section className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Upload Notes or DPP</h3>
            <form onSubmit={handleUploadNote} className="grid sm:grid-cols-2 gap-4 mt-4">
              <input
                placeholder="Handout Title"
                required
                value={noteForm.title}
                onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
              <select
                value={noteForm.type}
                onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="note">Note (PDF / Image)</option>
                <option value="dpp">DPP (Daily Practice Problem)</option>
              </select>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                required
                onChange={(e) => setNoteFile(e.target.files[0])}
                className="sm:col-span-2 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
              <button className="sm:col-span-2 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-md">
                Upload Handout
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default InstructorPanel;