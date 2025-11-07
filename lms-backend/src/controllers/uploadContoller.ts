// controllers/uploadController.js
import fs from "fs";
import cloudinary from "../utils/cloudinaryConfig.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Upload file from temp folder to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
      resource_type: "auto", // handles both images & videos safely
    });

    // Delete temp file
    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};
