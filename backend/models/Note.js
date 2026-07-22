import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    liveClass: { type: mongoose.Schema.Types.ObjectId, ref: "LiveClass" }, // optional link to a specific class
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ["note", "dpp"], required: true }, // dpp = Daily Practice Problems
    fileUrl: { type: String, required: true },
    fileType: { type: String, default: "pdf" },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
