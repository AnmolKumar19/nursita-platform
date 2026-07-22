import express from "express";
import {
  scheduleClass,
  getClassesForCourse,
  getClassById,
  updateClassStatus,
  deleteClass,
} from "../controllers/classController.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { verifyCourseAccess } from "../middleware/enrollmentMiddleware.js";

const router = express.Router();

router.post("/", protect, restrictTo("instructor", "admin"), scheduleClass);

// Lock down class lists to enrolled users
router.get("/course/:courseId", protect, verifyCourseAccess, getClassesForCourse);

router.get("/:id", protect, getClassById);
router.patch("/:id/status", protect, restrictTo("instructor", "admin"), updateClassStatus);

// Delete scheduled/recorded class (Instructors & Admins only)
router.delete("/:id", protect, restrictTo("instructor", "admin"), deleteClass);

export default router;