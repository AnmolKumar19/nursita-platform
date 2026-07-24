import express from "express";
import {
  enrollInCourse,
  getMyEnrollments,
  checkEnrollment,
  manualEnroll,
  enrollUserManually,
  revokeAccess,
} from "../controllers/enrollmentController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

// === STUDENT ENROLLMENT ROUTES ===
router.post("/", protect, restrictTo("student"), enrollInCourse);
router.get("/mine", protect, restrictTo("student"), getMyEnrollments);
router.get("/check/:courseId", protect, checkEnrollment);

// === ADMIN & INSTRUCTOR MANUAL ACCESS ROUTES ===
// Allows both admins and instructors to grant free batch access to students
router.post("/manual", protect, restrictTo("admin", "instructor"), manualEnroll);
router.post("/grant-access", protect, restrictTo("admin", "instructor"), enrollUserManually);
// === REVOKE ACCESS ROUTE ===
router.post("/revoke", protect, restrictTo("admin", "instructor"), revokeAccess); // <-- ADD THIS ROUTE

export default router;