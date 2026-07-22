import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

export const createCourse = async (req, res) => {
  try {
    const { title, description, subject, thumbnailUrl, price } = req.body;
    const course = await Course.create({
      title,
      description,
      subject,
      thumbnailUrl,
      price,
      instructor: req.user._id,
      published: true,
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCourses = async (req, res) => {
  try {
    const filter = { published: true };
    if (req.query.subject) filter.subject = req.query.subject;
    const courses = await Course.find(filter)
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATED: Safely returns course data and enrollment flag instead of blocking with 403
export const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId).populate("instructor", "name email");
    
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Allow admins or the course instructor to bypass enrollment check
    const isOwnerOrAdmin = 
      req.user && 
      (String(course.instructor._id || course.instructor) === String(req.user._id) || req.user.role === "admin");

    let isEnrolled = false;
    if (req.user && req.user.role === "student") {
      const enrollment = await Enrollment.findOne({ user: req.user._id, course: courseId });
      if (enrollment) isEnrolled = true;
    }

    // Always return 200 with data so frontend renders smoothly without getting stuck on loading
    res.json({
      course,
      isEnrolled: isOwnerOrAdmin || isEnrolled
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (String(course.instructor) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not your course" });
    }
    Object.assign(course, req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (String(course.instructor) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not your course" });
    }
    await course.deleteOne();
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};