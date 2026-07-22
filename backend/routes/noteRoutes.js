import express from "express";
import { uploadNote, getNotesForCourse, deleteNote } from "../controllers/noteController.js";
import { protect, restrictTo } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, restrictTo("instructor", "admin"), upload.single("file"), uploadNote);
router.get("/course/:courseId", getNotesForCourse);
router.delete("/:id", protect, restrictTo("instructor", "admin"), deleteNote);

export default router;
