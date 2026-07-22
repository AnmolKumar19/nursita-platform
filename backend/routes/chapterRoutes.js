import express from "express";
import { 
  createChapter, 
  getChaptersForCourse, 
  updateChapter, 
  deleteChapter 
} from "../controllers/chapterController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Get chapters for a course (Public or Enrolled)
router.get("/course/:courseId", getChaptersForCourse);

// Create chapter (Instructors & Admins only)
router.post("/", protect, authorize("admin", "instructor"), createChapter);

// Update chapter (Instructors & Admins only)
router.put("/:id", protect, authorize("admin", "instructor"), updateChapter);

// Delete chapter (Instructors & Admins only)
router.delete("/:id", protect, authorize("admin", "instructor"), deleteChapter);

export default router;