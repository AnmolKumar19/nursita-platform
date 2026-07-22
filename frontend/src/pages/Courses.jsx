import { useEffect, useState } from "react";
import api from "../api/axios.js";
import CourseCard from "../components/CourseCard.jsx";
import { NURSING_SUBJECTS } from "../constants.js";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/courses", { params: subject ? { subject } : {} })
      .then((res) => setCourses(res.data))
      .finally(() => setLoading(false));
  }, [subject]);

  const subjects = NURSING_SUBJECTS;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl font-semibold">All courses</h1>
      <p className="text-ink/60 mt-2">Pick a subject and start where your syllabus does.</p>

      <div className="flex flex-wrap gap-2 mt-6">
        <button
          onClick={() => setSubject("")}
          className={`px-4 py-1.5 rounded-full text-sm border ${
            subject === "" ? "bg-ink text-paper border-ink" : "border-rule hover:border-ink"
          }`}
        >
          All
        </button>
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setSubject(s)}
            className={`px-4 py-1.5 rounded-full text-sm border ${
              subject === s ? "bg-ink text-paper border-ink" : "border-rule hover:border-ink"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-10 text-ink/50">Loading courses…</p>
      ) : courses.length === 0 ? (
        <p className="mt-10 text-ink/50">No courses here yet — check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {courses.map((c) => (
            <CourseCard key={c._id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
