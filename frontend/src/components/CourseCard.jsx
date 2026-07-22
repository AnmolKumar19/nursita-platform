import { Link } from "react-router-dom";

const CourseCard = ({ course }) => (
  <Link
    to={`/courses/${course._id}`}
    className="group block rounded-2xl border border-rule bg-white overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
  >
    <div className="h-36 bg-ink/90 flex items-center justify-center overflow-hidden">
      {course.thumbnailUrl ? (
        <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="font-display text-4xl text-marigold">{course.subject?.[0] ?? "N"}</span>
      )}
    </div>
    <div className="p-5">
      <span className="text-xs uppercase tracking-wide text-teal font-mono">{course.subject}</span>
      <h3 className="font-display text-lg font-semibold mt-1 group-hover:text-marigold transition-colors">
        {course.title}
      </h3>
      <p className="text-sm text-ink/60 mt-1 line-clamp-2">{course.description}</p>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-ink/60">By {course.instructor?.name || "Nursita faculty"}</span>
        <span className="font-semibold">{course.price ? `₹${course.price}` : "Free"}</span>
      </div>
    </div>
  </Link>
);

export default CourseCard;
