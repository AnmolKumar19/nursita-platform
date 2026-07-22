import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

export const verifyCourseAccess = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    // Admins and instructors can always access
    if (userRole === "admin" || userRole === "instructor") {
      return next();
    }

    // Determine the courseId based on the route parameters
    // (Depending on whether the route uses /course/:id or /:id)
    const courseId = req.params.courseId || req.params.id;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID required for access check" });
    }

    // Check if the course is free (price is 0 or undefined). If free, allow access.
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.price || course.price === 0) {
      return next();
    }

    // Check if the student has an active paid enrollment
    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (!enrollment) {
      return res.status(403).json({ 
        message: "Access denied. You must purchase/enroll in this course to view its content." 
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};