import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import Course from "../models/Course.js";

// Grant free access to a batch
export const enrollUserManually = async (req, res) => {
  try {
    const { email, courseId } = req.body;

    if (!email || !courseId) {
      return res.status(400).json({ message: "Email and course ID are required." });
    }

    // Find student by email
    const student = await User.findOne({ email: email.trim().toLowerCase() });
    if (!student) {
      return res.status(404).json({ message: "No user account found with this email." });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course batch not found." });
    }

    // Check if already enrolled (using 'student' to match your schema)
    const existing = await Enrollment.findOne({
      student: student._id,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({ message: "Student is already enrolled in this batch." });
    }

    // Create enrollment record
    const enrollment = await Enrollment.create({
      student: student._id,
      course: courseId,
      paymentStatus: "completed",
    });

    res.status(201).json({
      success: true,
      message: `Access granted successfully to ${student.name || email}`,
      enrollment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};