import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { NURSING_SUBJECTS } from "../constants.js";
import axios from '../api/axios';

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
  const [status, setStatus] = useState("");
 

 const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    try {
      // Using 'api' to match the rest of your scaffolded file
      await api.delete(`/courses/${courseId}`);
      
      // Clear the dropdown selection
      setSelectedCourse("");
      
      // Remove the deleted course from the screen
      setCourses((prevCourses) => prevCourses.filter(course => course._id !== courseId));

    } catch (error) {
      console.error("Error deleting course:", error);
      alert(error.response?.data?.message || "Failed to delete the course.");
    }
  };

  const loadCourses = () => api.get("/courses/mine").then((res) => setCourses(res.data));

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      api.get(`/classes/course/${selectedCourse}`).then((res) => setClasses(res.data));
    }
  }, [selectedCourse]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const res = await api.post("/courses", courseForm);
    setCourses([res.data, ...courses]);
    setCourseForm(emptyCourse);
    setStatus("Course created.");
  };

  const handleScheduleClass = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return setStatus("Pick a course first.");
    const res = await api.post("/classes", { courseId: selectedCourse, ...classForm });
    setClasses([res.data, ...classes]);
    setClassForm(emptyClass);
    setStatus("Class scheduled.");
  };

  const toggleClassStatus = async (cls, newStatus) => {
    const res = await api.patch(`/classes/${cls._id}/status`, { status: newStatus });
    setClasses(classes.map((c) => (c._id === cls._id ? res.data : c)));
  };

  const handleUploadNote = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return setStatus("Pick a course first.");
    if (!noteFile) return setStatus("Choose a file to upload.");
    const fd = new FormData();
    fd.append("courseId", selectedCourse);
    fd.append("title", noteForm.title);
    fd.append("type", noteForm.type);
    fd.append("file", noteFile);
    await api.post("/notes", fd, { headers: { "Content-Type": "multipart/form-data" } });
    setNoteForm(emptyNote);
    setNoteFile(null);
    setStatus(`${noteForm.type === "dpp" ? "DPP" : "Note"} uploaded.`);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl font-semibold">Teaching panel</h1>
      {status && <p className="mt-3 text-teal text-sm">{status}</p>}

      {/* Create course */}
      <section className="mt-10 p-6 rounded-2xl border border-rule bg-white">
        <h2 className="font-display text-xl font-semibold">New course</h2>
        <form onSubmit={handleCreateCourse} className="grid sm:grid-cols-2 gap-4 mt-4">
          <input
            placeholder="Title"
            required
            value={courseForm.title}
            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
            className="px-4 py-2.5 rounded-lg border border-rule sm:col-span-2"
          />
          <textarea
            placeholder="Description"
            required
            value={courseForm.description}
            onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
            className="px-4 py-2.5 rounded-lg border border-rule sm:col-span-2"
            rows={3}
          />
          <select
            value={courseForm.subject}
            onChange={(e) => setCourseForm({ ...courseForm, subject: e.target.value })}
            className="px-4 py-2.5 rounded-lg border border-rule"
          >
            {NURSING_SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            placeholder="Price (0 = free)"
            value={courseForm.price}
            onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
            className="px-4 py-2.5 rounded-lg border border-rule"
          />
          <button className="sm:col-span-2 py-3 rounded-lg bg-ink text-paper font-medium hover:bg-marigold hover:text-ink transition-colors">
            Create course
          </button>
        </form>
      </section>

      

      {/* Select course for class/notes actions */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">Manage a course</h2>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="mt-3 px-4 py-2.5 rounded-lg border border-rule bg-white"
        >
          <option value="">Select a course…</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </section>

      {selectedCourse && (
        <>
          {/* Delete Course Button */}
        <div className="flex justify-end mt-2 mb-6">
          <button 
            onClick={(e) => {
              e.preventDefault(); // Prevents accidental form submissions if nested improperly
              handleDeleteCourse(selectedCourse);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Delete Selected Course
          </button>
        </div>
          {/* Schedule class */}
          <section className="mt-6 p-6 rounded-2xl border border-rule bg-white">
            <h3 className="font-display text-lg font-semibold">Schedule a live class</h3>
            <p className="text-sm text-ink/50 mt-1">
              Create the live stream in YouTube Studio first, then paste its link here. The same
              link becomes the recording once the stream ends.
            </p>
            <form onSubmit={handleScheduleClass} className="grid sm:grid-cols-2 gap-4 mt-4">
              <input
                placeholder="Class title"
                required
                value={classForm.title}
                onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
                className="px-4 py-2.5 rounded-lg border border-rule sm:col-span-2"
              />
              <input
                placeholder="YouTube link or video ID"
                required
                value={classForm.youtubeUrlOrId}
                onChange={(e) => setClassForm({ ...classForm, youtubeUrlOrId: e.target.value })}
                className="px-4 py-2.5 rounded-lg border border-rule sm:col-span-2"
              />
              <input
                type="datetime-local"
                required
                value={classForm.scheduledAt}
                onChange={(e) => setClassForm({ ...classForm, scheduledAt: e.target.value })}
                className="px-4 py-2.5 rounded-lg border border-rule"
              />
              <input
                placeholder="Short description (optional)"
                value={classForm.description}
                onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
                className="px-4 py-2.5 rounded-lg border border-rule"
              />
              <button className="sm:col-span-2 py-3 rounded-lg bg-ink text-paper font-medium hover:bg-marigold hover:text-ink transition-colors">
                Schedule class
              </button>
            </form>

            <div className="mt-6 space-y-2">
              {classes.map((c) => (
                <div key={c._id} className="flex items-center justify-between border-t border-rule pt-3">
                  <span className="text-sm font-medium">{c.title}</span>
                  <div className="flex gap-2">
                    {["scheduled", "live", "ended"].map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleClassStatus(c, s)}
                        className={`text-xs px-3 py-1 rounded-full border capitalize ${
                          c.status === s ? "bg-ink text-paper border-ink" : "border-rule hover:border-ink"
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

          {/* Upload notes/DPP */}
          <section className="mt-6 p-6 rounded-2xl border border-rule bg-white">
            <h3 className="font-display text-lg font-semibold">Upload notes or DPP</h3>
            <form onSubmit={handleUploadNote} className="grid sm:grid-cols-2 gap-4 mt-4">
              <input
                placeholder="Title"
                required
                value={noteForm.title}
                onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                className="px-4 py-2.5 rounded-lg border border-rule"
              />
              <select
                value={noteForm.type}
                onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })}
                className="px-4 py-2.5 rounded-lg border border-rule"
              >
                <option value="note">Note</option>
                <option value="dpp">DPP</option>
              </select>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                required
                onChange={(e) => setNoteFile(e.target.files[0])}
                className="sm:col-span-2 text-sm"
              />
              <button className="sm:col-span-2 py-3 rounded-lg bg-ink text-paper font-medium hover:bg-marigold hover:text-ink transition-colors">
                Upload
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
};

export default InstructorPanel;
