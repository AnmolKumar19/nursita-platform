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

  useEffect(() => {
    // FIX: Extract course and isEnrolled from the new backend response wrapper
    api.get(`/courses/${id}`).then((res) => {
      setCourse(res.data.course);
      setEnrolled(res.data.isEnrolled);
    }).catch((err) => {
      console.error("Failed to load course details", err);
    });

    api.get(`/classes/course/${id}`).then((res) => setClasses(res.data)).catch(() => {});
    api.get(`/notes/course/${id}`).then((res) => setNotes(res.data)).catch(() => {});
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      // If course has a price greater than 0, open Razorpay Checkout
      if (course.price && course.price > 0) {
        const { data: order } = await api.post("/payments/create-order", { courseId: id });

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "Nursita",
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
                alert("Payment successful! Course unlocked.");
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
          theme: {
            color: "#0F172A",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function () {
          setEnrolling(false);
        });
        rzp.open();
      } else {
        // Free course enrollment flow
        await api.post("/enrollments", { courseId: id });
        setEnrolled(true);
        setEnrolling(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Could not process enrollment/payment");
      setEnrolling(false);
    }
  };

  if (!course) return <p className="max-w-6xl mx-auto px-6 py-16 text-ink/50">Loading…</p>;

  const dpps = notes.filter((n) => n.type === "dpp");
  const noteFiles = notes.filter((n) => n.type === "note");

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <span className="text-xs uppercase tracking-wide text-teal font-mono">{course.subject}</span>
      <h1 className="font-display text-4xl font-semibold mt-1">{course.title}</h1>
      <p className="text-ink/60 mt-3 max-w-2xl">{course.description}</p>
      <p className="text-sm text-ink/50 mt-2">Taught by {course.instructor?.name}</p>

      {user?.role === "student" && (
        <button
          onClick={handleEnroll}
          disabled={enrolled || enrolling}
          className="mt-6 px-6 py-2.5 rounded-lg bg-ink text-paper font-medium hover:bg-marigold hover:text-ink transition-colors disabled:opacity-50"
        >
          {enrolled ? "Enrolled ✓" : enrolling ? "Processing…" : "Enroll — " + (course.price ? `₹${course.price}` : "Free")}
        </button>
      )}

      <div className="flex gap-2 mt-10 border-b border-rule">
        {[
          { key: "classes", label: "Live & recorded classes" },
          { key: "notes", label: "Notes" },
          { key: "dpp", label: "DPP" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key ? "border-marigold text-ink" : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "classes" && (
        <div className="mt-8 space-y-4">
          {classes.length === 0 && <p className="text-ink/50">No classes scheduled yet.</p>}
          {classes.map((c) => (
            <Link
              key={c._id}
              to={`/classes/${c._id}`}
              className="flex items-center justify-between border border-rule rounded-xl px-5 py-4 bg-white hover:border-ink transition-colors"
            >
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-sm text-ink/50">
                  {new Date(c.scheduledAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`text-xs font-mono px-3 py-1 rounded-full ${
                  c.status === "live"
                    ? "bg-teal/10 text-teal"
                    : c.status === "ended"
                    ? "bg-ink/5 text-ink/60"
                    : "bg-marigold/15 text-marigold"
                }`}
              >
                {c.status === "live" ? "● Live now" : c.status === "ended" ? "Recording" : "Scheduled"}
              </span>
            </Link>
          ))}
        </div>
      )}

      {tab === "notes" && (
        <div className="mt-8 space-y-3">
          {noteFiles.length === 0 && <p className="text-ink/50">No notes uploaded yet.</p>}
          {noteFiles.map((n) => (
            <a
              key={n._id}
              href={n.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="margin-rule flex items-center justify-between py-3 hover:text-marigold transition-colors"
            >
              <span className="font-medium">{n.title}</span>
              <span className="text-sm text-ink/40 font-mono">
                {new Date(n.createdAt).toLocaleDateString()}
              </span>
            </a>
          ))}
        </div>
      )}

      {tab === "dpp" && (
        <div className="mt-8 space-y-3">
          {dpps.length === 0 && <p className="text-ink/50">No DPP uploaded yet.</p>}
          {dpps.map((n) => (
            <a
              key={n._id}
              href={n.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="margin-rule flex items-center justify-between py-3 hover:text-marigold transition-colors"
            >
              <span className="font-medium">{n.title}</span>
              <span className="text-sm text-ink/40 font-mono">
                {new Date(n.createdAt).toLocaleDateString()}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseDetail;