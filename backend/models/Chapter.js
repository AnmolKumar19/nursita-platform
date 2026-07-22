import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    description: { type: String },
    order: { type: Number, default: 0 }, // Helps order Chapters (e.g., Chapter 1, 2, 3)
  },
  { timestamps: true }
);

export default mongoose.model("Chapter", chapterSchema);