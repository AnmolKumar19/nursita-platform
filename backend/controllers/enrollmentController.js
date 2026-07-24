import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

// Standard Student Enrollment
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (existing) return res.status(409).json({ message: "Already enrolled" });

    const enrollment = await Enrollment.create({ student: req.user._id, course: courseId });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fetch Student's Enrolled Courses
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).populate({
      path: "course",
      populate: { path: "instructor", select: "name" },
    });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check if Logged-In Student is Enrolled
export const checkEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });
    res.json({ enrolled: !!enrollment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin/Instructor Route: Manually grant course access by student email
export const manualEnroll = async (req, res) => {
  try {
    const { email, courseId } = req.body;

    if (!email || !courseId) {
      return res.status(400).json({ message: "Email and course ID are required" });
    }

    // 1. Find user by email
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    // 2. Find course by ID
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 3. Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: user._id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: "User is already enrolled in this course" });
    }

    // 4. Create enrollment record
    const enrollment = await Enrollment.create({
      student: user._id,
      course: courseId,
      paymentStatus: "completed",
      amountPaid: 0,
    });

    res.status(201).json({
      message: `Access granted to ${user.name || user.email} successfully!`,
      enrollment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to grant access" });
  }
};

// Alias export to support both /manual and /grant-access routes
export const enrollUserManually = manualEnroll;