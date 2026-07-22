import express from "express";
import { 
  createChapter, 
  getChaptersForCourse, 
  updateChapter, 
  deleteChapter 
} from "../controllers/chapterController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

// Get chapters for a course (Public or Enrolled)
router.get("/course/:courseId", getChaptersForCourse);

// Create chapter (Instructors & Admins only)
router.post("/", protect, restrictTo("admin", "instructor"), createChapter);

// Update chapter (Instructors & Admins only)
router.put("/:id", protect, restrictTo("admin", "instructor"), updateChapter);

// Delete chapter (Instructors & Admins only)
router.delete("/:id", protect, restrictTo("admin", "instructor"), deleteChapter);

export default router;