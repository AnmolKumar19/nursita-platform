import express from "express";
import { uploadNote, getNotesForCourse, deleteNote } from "../controllers/noteController.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { verifyCourseAccess } from "../middleware/enrollmentMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, restrictTo("instructor", "admin"), upload.single("file"), uploadNote);

// UPDATED: Added 'protect' and 'verifyCourseAccess' so notes/DPPs are locked behind payment
router.get("/course/:courseId", protect, verifyCourseAccess, getNotesForCourse);

router.delete("/:id", protect, restrictTo("instructor", "admin"), deleteNote);

export default router;