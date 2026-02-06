const express = require("express");

const {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");

const { protect } = require("../../middlewares/authMiddleware");
const { uploadResumeImages } = require("../controllers/uploadImages");

const router = express.Router();

router.post("/", protect, createResume); // Create Resume
router.get("/", protect, getUserResumes); // Get all resumes for a user
router.get("/:id", protect, getResumeById); // Get resume by ID
router.put("/:id", protect, updateResume); // Update resume 
router.put("/:id/upload-images", protect, uploadResumeImages);

router.delete("/:id", protect, deleteResume); // Delete resume

module.exports = router;
