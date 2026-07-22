import multer from "multer";

const ALLOWED_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg"];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) return cb(null, true);
  cb(new Error("Only PDF, PNG and JPG files are allowed"));
};

// Files are kept in memory as a buffer, then streamed to Cloudinary manually
// in noteController.js (see utils/cloudinary.js).
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB cap
});

export default upload;
