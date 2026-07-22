import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    subject: { type: String, required: true }, // e.g. Fundamentals of Nursing, Pharmacology, Anatomy & Physiology
    thumbnailUrl: { type: String, default: "" },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, default: 0 }, // 0 = free course
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
