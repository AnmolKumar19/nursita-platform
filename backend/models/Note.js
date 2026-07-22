import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    course: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Course", 
      required: true,
      index: true 
    },
    chapter: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Chapter",
      default: null,
      index: true 
    }, // Optional link to a chapter
    liveClass: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "LiveClass",
      default: null 
    }, // Optional link to a specific class
    uploadedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    type: { 
      type: String, 
      enum: ["note", "dpp"], 
      required: true 
    }, // "note" = Class Notes, "dpp" = Daily Practice Problems
    fileUrl: { 
      type: String, 
      required: true, 
      trim: true 
    },
    fileType: { 
      type: String, 
      default: "pdf", 
      lowercase: true, 
      trim: true 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);