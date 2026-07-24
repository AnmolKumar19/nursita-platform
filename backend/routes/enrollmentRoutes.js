import express from "express";
import {
  enrollInCourse,
  getMyEnrollments,
  checkEnrollment,
  manualEnroll,
  enrollUserManually,
} from "../controllers/enrollmentController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

// Student enrollment routes
router.post("/", protect, restrictTo("student"), enrollInCourse);
router.get("/mine", protect, restrictTo("student"), getMyEnrollments);
router.get("/check/:courseId", protect, checkEnrollment);

// Admin & Instructor route to manually grant free access
router.post("/manual", protect, restrictTo("admin", "instructor"), manualEnroll);
router.post("/grant-access", protect, restrictTo("admin", "instructor"), enrollUserManually);

export default router;