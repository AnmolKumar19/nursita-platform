import LiveClass from "../models/LiveClass.js";
import Course from "../models/Course.js";

// Extracts an 11-char YouTube video ID from a full URL or accepts a raw ID
const extractVideoId = (input) => {
  if (!input) return null;
  const match = input.match(/(?:youtu\.be\/|[?&]v=|\/live\/|\/embed\/|\/video\/)([\w-]{11})/);
  if (match) return match[1];
  if (/^[\w-]{11}$/.test(input)) return input;
  return null;
};

export const scheduleClass = async (req, res) => {
  try {
    const { courseId, title, description, youtubeUrlOrId, scheduledAt } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (String(course.instructor) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not your course" });
    }

    const youtubeVideoId = extractVideoId(youtubeUrlOrId);
    if (!youtubeVideoId) {
      return res.status(400).json({ message: "Provide a valid YouTube video/stream URL or ID" });
    }

    const liveClass = await LiveClass.create({
      course: courseId,
      title,
      description,
      instructor: req.user._id,
      youtubeVideoId,
      scheduledAt,
    });

    res.status(201).json(liveClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getClassesForCourse = async (req, res) => {
  try {
    const classes = await LiveClass.find({ course: req.params.courseId }).sort({ scheduledAt: -1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getClassById = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id).populate("course", "title");
    if (!liveClass) return res.status(404).json({ message: "Class not found" });
    res.json(liveClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Instructor manually flips status: scheduled -> live -> ended
// (ended just means "now treat this as a recording" - same videoId either way)
export const updateClassStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["scheduled", "live", "ended"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) return res.status(404).json({ message: "Class not found" });
    if (String(liveClass.instructor) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not your class" });
    }
    liveClass.status = status;
    await liveClass.save();
    res.json(liveClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete scheduled or recorded class
export const deleteClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) return res.status(404).json({ message: "Class not found" });

    // Ensure only the instructor who created the class or an admin can delete it
    if (String(liveClass.instructor) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this class" });
    }

    await liveClass.deleteOne();
    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};