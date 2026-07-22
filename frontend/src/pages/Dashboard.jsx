import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import CourseCard from "../components/CourseCard.jsx";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    if (user?.role === "student") {
      api.get("/enrollments/mine")
        .then((res) => setEnrollments(res.data))
        .catch((err) => console.error("Error fetching enrollments:", err));
    }
  }, [user]);

  // Show loading indicator while AuthContext restores user session on refresh
  if (loading || !user) {
    return <p className="max-w-6xl mx-auto px-6 py-16 text-ink/50">Loading dashboard...</p>;
  }

  // Safely extract first name without throwing errors
  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl font-semibold">Welcome, {firstName}</h1>

      {user?.role === "instructor" && (
        <div className="mt-6 p-6 rounded-2xl border border-rule bg-white">
          <p className="text-ink/70">
            You're set up as an instructor. Head to your teaching panel to create courses,
            schedule live classes and upload notes/DPP.
          </p>
          <Link
            to="/instructor"
            className="inline-block mt-4 px-5 py-2.5 rounded-lg bg-ink text-paper font-medium hover:bg-marigold hover:text-ink transition-colors"
          >
            Go to teaching panel
          </Link>
        </div>
      )}

      {user?.role === "student" && (
        <>
          <p className="text-ink/60 mt-2">Your enrolled courses.</p>
          {enrollments.length === 0 ? (
            <div className="mt-10 p-10 text-center border border-dashed border-rule rounded-2xl">
              <p className="text-ink/60">You haven't enrolled in any course yet.</p>
              <Link to="/courses" className="text-marigold font-medium mt-2 inline-block">
                Browse courses →
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {enrollments.map((e) => (
                e?.course && <CourseCard key={e._id || e.course._id} course={e.course} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;