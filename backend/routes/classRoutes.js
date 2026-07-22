import express from "express";
import {
  scheduleClass,
  getClassesForCourse,
  getClassById,
  updateClassStatus,
} from "../controllers/classController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, restrictTo("instructor", "admin"), scheduleClass);
router.get("/course/:courseId", getClassesForCourse);
router.get("/:id", getClassById);
router.patch("/:id/status", protect, restrictTo("instructor", "admin"), updateClassStatus);

export default router;
