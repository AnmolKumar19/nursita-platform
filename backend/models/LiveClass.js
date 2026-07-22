import mongoose from "mongoose";

// A "class" in Nursita is always backed by a single YouTube video.
// Before/during the scheduled time it's the live stream; after the
// instructor ends the stream, the SAME videoId becomes the recording (VOD).
// So live class + recording are literally one document.
const liveClassSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", required: false },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    youtubeVideoId: { type: String, required: true, trim: true },
    scheduledAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["scheduled", "live", "ended"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

export default mongoose.model("LiveClass", liveClassSchema);