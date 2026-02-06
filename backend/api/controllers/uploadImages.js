const cloudinary = require('../config/cloudinary');
const Resume = require("../models/Resume");
const upload = require("../../middlewares/uploadMiddleware");

const uploadResumeImages = async (req, res) => {
  try {
    upload.fields([{ name: "thumbnail" }, { name: "profileImg" }])(
      req,
      res,
      async (err) => {
        if (err) {
          console.error("Multer upload error:", err);
          return res
            .status(400)
            .json({ message: "File upload failed", error: err.message });
        }

        console.log("Files received:", req.files);
        console.log("Resume ID:", req.params.id);
        
        const resumeId = req.params.id;
        const resume = await Resume.findOne({
          _id: resumeId,
          userId: req.user._id,
        });

        if (!resume) {
          return res
            .status(404)
            .json({ message: "Resume not found or unauthorized" });
        }

        const newThumbnail = req.files.thumbnail?.[0];
        const newProfileImage = req.files.profileImg?.[0];

        // If new thumbnail uploaded, delete old one from Cloudinary
        if (newThumbnail) {
          if (resume.thumbnailLink) {
            try {
              // Extract public_id from the old Cloudinary URL
              const urlParts = resume.thumbnailLink.split('/');
              const publicIdWithExtension = urlParts[urlParts.length - 1];
              const publicId = `resume-builder/${publicIdWithExtension.split('.')[0]}`;
              await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
              console.error("Error deleting old thumbnail:", deleteError);
            }
          }
          resume.thumbnailLink = newThumbnail.path; // Cloudinary URL
        }

        // If new profile image uploaded, delete old one from Cloudinary
        if (newProfileImage) {
          if (resume.profileInfo?.profilePreviewUrl) {
            try {
              // Extract public_id from the old Cloudinary URL
              const urlParts = resume.profileInfo.profilePreviewUrl.split('/');
              const publicIdWithExtension = urlParts[urlParts.length - 1];
              const publicId = `resume-builder/${publicIdWithExtension.split('.')[0]}`;
              await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
              console.error("Error deleting old profile image:", deleteError);
            }
          }
          resume.profileInfo.profilePreviewUrl = newProfileImage.path; // Cloudinary URL
        }

        await resume.save();

        console.log("Upload successful! Thumbnail:", resume.thumbnailLink, "Profile:", resume.profileInfo?.profilePreviewUrl);

        res.status(200).json({
          message: "Images uploaded successfully",
          thumbnailLink: resume.thumbnailLink,
          profilePreviewUrl: resume.profileInfo?.profilePreviewUrl,
        });
      },
    );
  } catch (error) {
        console.error("Error uploading images:", error);
        res.status(500).json({ message: "Failed to upload images", error: error.message });
  }
};

module.exports = {
  uploadResumeImages,
};