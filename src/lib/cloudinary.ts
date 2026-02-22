import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type CloudinaryFolder =
  | "portfolio/blog"
  | "portfolio/meta"
  | "portfolio/projects"
  | "portfolio/achievements";

/**
 * Upload a Buffer to Cloudinary and return the secure URL.
 * Uses base64 data URI upload (always signed — avoids stream auth issues).
 * @param buffer  Raw file bytes
 * @param folder  Cloudinary folder path
 * @param mimeType  MIME type of the file (e.g. "image/png")
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: CloudinaryFolder,
  mimeType = "image/png",
): Promise<string> {
  const base64 = buffer.toString("base64");
  const dataUri = `data:${mimeType};base64,${base64}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    use_filename: false,
    overwrite: false,
    quality: "auto",
    fetch_format: "auto",
  });
  return result.secure_url;
}

export { cloudinary };
