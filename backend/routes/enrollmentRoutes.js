import express from "express";
import {
  enrollInCourse,
  getMyEnrollments,
  checkEnrollment,
  manualEnroll,
} from "../controllers/enrollmentController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, restrictTo("student"), enrollInCourse);
router.get("/mine", protect, restrictTo("student"), getMyEnrollments);
router.get("/check/:courseId", protect, checkEnrollment);

// Admin route to manually grant access to any student
router.post("/manual", protect, restrictTo("admin"), manualEnroll);

export default router;