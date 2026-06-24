import express from "express";
import cloudinary from "cloudinary";
const router = express.Router();
router.post("/upload", async (req, res) => {
    try {
        const { buffer, public_id } = req.body;
        if (!buffer) {
            return res.status(400).json({ message: "No buffer provided" });
        }
        // Best-effort delete of old asset — do NOT block the new upload on failure
        if (public_id) {
            try {
                await cloudinary.v2.uploader.destroy(public_id);
                console.log(`[upload] Destroyed old asset: ${public_id}`);
            } catch (destroyErr: any) {
                console.warn(
                    `[upload] Failed to destroy old asset ${public_id}:`,
                    destroyErr.message
                );
                // Continue with upload — old file cleanup is non-critical
            }
        }
        console.log("[upload] Uploading to Cloudinary, buffer length:", buffer?.length);
        const cloud = await cloudinary.v2.uploader.upload(buffer, {
            resource_type: "auto", // auto-detect PDF vs image
        });
        console.log("[upload] Cloudinary upload success:", cloud.secure_url);
        res.json({
            url: cloud.secure_url,
            public_id: cloud.public_id,
        });
    } catch (error: any) {
        console.error("[upload] Cloudinary upload failed:", {
            message: error.message,
            httpCode: error.http_code,
            name: error.name,
        });
        res.status(500).json({
            message: error.message || "Upload failed",
        });
    }
});
export default router;