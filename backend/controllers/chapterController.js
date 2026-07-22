import Chapter from "../models/Chapter.js";
import Course from "../models/Course.js";

// Create a new Chapter in a course
export const createChapter = async (req, res) => {
  try {
    const { courseId, title, description, order } = req.body;
    const course = await Course.findById(courseId);
    
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (String(course.instructor) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not your course" });
    }

    const chapter = await Chapter.create({ 
      course: courseId, 
      title, 
      description, 
      order: order || 0 
    });

    res.status(201).json(chapter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fetch chapters for a course
export const getChaptersForCourse = async (req, res) => {
  try {
    const chapters = await Chapter.find({ course: req.params.courseId }).sort({ order: 1 });
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an existing chapter (Rename, reorder, or edit description)
export const updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, order } = req.body;

    const chapter = await Chapter.findById(id);
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });

    // Verify course ownership
    const course = await Course.findById(chapter.course);
    if (String(course.instructor) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this chapter" });
    }

    if (title) chapter.title = title;
    if (description !== undefined) chapter.description = description;
    if (order !== undefined) chapter.order = order;

    const updatedChapter = await chapter.save();
    res.json(updatedChapter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a chapter
export const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;

    const chapter = await Chapter.findById(id);
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });

    // Verify course ownership
    const course = await Course.findById(chapter.course);
    if (String(course.instructor) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this chapter" });
    }

    await Chapter.findByIdAndDelete(id);
    res.json({ message: "Chapter deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};