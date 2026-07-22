import express from "express";
import {
  enrollInCourse,
  getMyEnrollments,
  checkEnrollment,
} from "../controllers/enrollmentController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, restrictTo("student"), enrollInCourse);
router.get("/mine", protect, restrictTo("student"), getMyEnrollments);
router.get("/check/:courseId", protect, checkEnrollment);

export default router;
