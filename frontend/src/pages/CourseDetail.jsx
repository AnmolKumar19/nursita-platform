import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [classes, setClasses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tab, setTab] = useState("classes");
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState("");

  useEffect(() => {
    // 1. Fetch course details
    api.get(`/courses/${id}`)
      .then((res) => {
        setCourse(res.data.course);
        setEnrolled(res.data.isEnrolled);
      })
      .catch((err) => console.error("Failed to load course details", err));

    // 2. Fetch classes
    api.get(`/classes/course/${id}`)
      .then((res) => {
        setClasses(res.data);
        setAccessDeniedMessage("");
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          setClasses([]);
          setAccessDeniedMessage("Enroll in this course to unlock live classes, recorded sessions, and study materials.");
        }
      });

    // 3. Fetch notes
    api.get(`/notes/course/${id}`)
      .then((res) => setNotes(res.data))
      .catch((err) => {
        if (err.response?.status === 403) setNotes([]);
      });
  }, [id, enrolled]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      if (course.price && course.price > 0) {
        const { data: order } = await api.post("/payments/create-order", { courseId: id });

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "Nursita Platform",
          description: course.title,
          order_id: order.id,
          handler: async function (response) {
            try {
              const verifyRes = await api.post("/payments/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: id,
              });
              
              if (verifyRes.data.success) {
                setEnrolled(true);
                setAccessDeniedMessage("");
              }
            } catch (err) {
              alert("Verification failed: " + (err.response?.data?.message || err.message));
            } finally {
              setEnrolling(false);
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },
          theme: { color: "#0F172A" },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", () => setEnrolling(false));
        rzp.open();
      } else {
        await api.post("/enrollments", { courseId: id });
        setEnrolled(true);
        setAccessDeniedMessage("");
        setEnrolling(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Could not process enrollment");
      setEnrolling(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await api.delete(`/notes/${noteId}`);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete file");
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      await api.delete(`/classes/${classId}`);
      setClasses((prev) => prev.filter((c) => c._id !== classId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete class");
    }
  };

  if (!course) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex space-x-3 items-center text-slate-400 font-medium">
          <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce"></div>
          <span>Loading course workspace...</span>
        </div>
      </div>
    );
  }

  const isCourseOwner = user?.role === "admin" || String(user?._id) === String(course.instructor?._id || course.instructor);
  const dpps = notes.filter((n) => n.type === "dpp");
  const noteFiles = notes.filter((n) => n.type === "note");

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Header Card */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
              {course.subject}
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {course._id.slice(-6)}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-50 mb-4">
            {course.title}
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed mb-6">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-teal-400 border border-slate-700">
                {course.instructor?.name ? course.instructor.name[0] : "I"}
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Instructor</p>
                <p className="text-sm font-semibold text-slate-200">{course.instructor?.name || "Lead Faculty"}</p>
              </div>
            </div>

            {user?.role === "student" && (
              <button
                onClick={handleEnroll}
                disabled={enrolled || enrolling}
                className={`px-8 py-3.5 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 ${
                  enrolled
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/30 cursor-default"
                    : "bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/10 active:scale-95"
                }`}
              >
                {enrolled ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Enrolled
                  </>
                ) : enrolling ? (
                  "Processing Enrollment..."
                ) : (
                  `Enroll Now — ${course.price ? `₹${course.price}` : "Free"}`
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1.5 bg-slate-200/60 rounded-xl max-w-fit mb-8 border border-slate-300/50">
          {[
            { key: "classes", label: "Lectures & Live", count: classes.length },
            { key: "notes", label: "Class Notes", count: noteFiles.length },
            { key: "dpp", label: "DPPs & Practice", count: dpps.length },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
                tab === t.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.label}
              {enrolled && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  tab === t.key ? "bg-slate-100 text-slate-700" : "bg-slate-300/50 text-slate-600"
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Lock Card for Unenrolled Students */}
        {!enrolled && user?.role === "student" && accessDeniedMessage ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center max-w-lg mx-auto my-12 space-y-4">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-100">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Course Content Locked</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{accessDeniedMessage}</p>
            <button
              onClick={handleEnroll}
              className="mt-2 w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
            >
              Unlock Access
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* CLASSES TAB */}
            {tab === "classes" && (
              <div className="grid gap-4">
                {classes.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
                    No scheduled lectures currently available.
                  </div>
                ) : (
                  classes.map((c) => (
                    <div
                      key={c._id}
                      className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 p-6 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <Link to={`/classes/${c._id}`} className="flex-1 group">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-teal-600 transition-colors">
                            {c.title}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(c.scheduledAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                      </Link>

                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                          c.status === "live"
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : c.status === "ended"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {c.status === "live" && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
                          {c.status === "live" ? "Live Session" : c.status === "ended" ? "Recorded" : "Scheduled"}
                        </span>

                        <Link
                          to={`/classes/${c._id}`}
                          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
                        >
                          Join Class →
                        </Link>

                        {isCourseOwner && (
                          <button
                            onClick={() => handleDeleteClass(c._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete Class"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* NOTES TAB */}
            {tab === "notes" && (
              <div className="grid gap-3">
                {noteFiles.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
                    No notes uploaded for this course yet.
                  </div>
                ) : (
                  noteFiles.map((n) => (
                    <div key={n._id} className="bg-white rounded-xl border border-slate-200/80 p-4 px-6 shadow-sm flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs uppercase border border-rose-100">
                          PDF
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{n.title}</p>
                          <p className="text-xs text-slate-400 font-mono">{new Date(n.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href={n.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 text-sm font-semibold transition-colors"
                        >
                          View Document
                        </a>
                        {isCourseOwner && (
                          <button
                            onClick={() => handleDeleteNote(n._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* DPP TAB */}
            {tab === "dpp" && (
              <div className="grid gap-3">
                {dpps.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
                    No Daily Practice Problems (DPP) uploaded yet.
                  </div>
                ) : (
                  dpps.map((n) => (
                    <div key={n._id} className="bg-white rounded-xl border border-slate-200/80 p-4 px-6 shadow-sm flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase border border-indigo-100">
                          DPP
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{n.title}</p>
                          <p className="text-xs text-slate-400 font-mono">{new Date(n.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href={n.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 text-sm font-semibold transition-colors"
                        >
                          View Problem Set
                        </a>
                        {isCourseOwner && (
                          <button
                            onClick={() => handleDeleteNote(n._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;