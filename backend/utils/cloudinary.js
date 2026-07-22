import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploads a file buffer (from multer's memoryStorage) straight to Cloudinary
// via a stream — no extra "multer-storage-cloudinary" package needed, which
// avoids the peer-dependency conflict that package has with Cloudinary v2.
export const uploadBufferToCloudinary = (buffer, filename) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "nursita/materials",
        resource_type: "auto", // handles pdf + images
        public_id: filename.replace(/\.[^/.]+$/, ""), // keep original name, minus extension
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(buffer);
  });

export { cloudinary };
