import Note from "../models/Note.js";
import Course from "../models/Course.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";

export const uploadNote = async (req, res) => {
  try {
    const { courseId, liveClassId, title, type } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (String(course.instructor) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not your course" });
    }
    if (!req.file) return res.status(400).json({ message: "File is required" });
    if (!["note", "dpp"].includes(type)) {
      return res.status(400).json({ message: "type must be 'note' or 'dpp'" });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, req.file.originalname);

    const note = await Note.create({
      course: courseId,
      liveClass: liveClassId || undefined,
      uploadedBy: req.user._id,
      title,
      type,
      fileUrl: result.secure_url,
      fileType: req.file.mimetype.includes("pdf") ? "pdf" : "image",
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getNotesForCourse = async (req, res) => {
  try {
    const filter = { course: req.params.courseId };
    if (req.query.type) filter.type = req.query.type; // ?type=note or ?type=dpp
    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (String(note.uploadedBy) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not your upload" });
    }
    await note.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
