import express from "express";
import {
  createCourse,
  getCourses,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getCourses);
router.get("/mine", protect, restrictTo("instructor", "admin"), getMyCourses);

// UPDATED: Added 'protect' so req.user is passed and enrollment can be verified
router.get("/:id", protect, getCourseById);

router.post("/", protect, restrictTo("instructor", "admin"), createCourse);
router.put("/:id", protect, restrictTo("instructor", "admin"), updateCourse);
router.delete("/:id", protect, restrictTo("instructor", "admin"), deleteCourse);

export default router;