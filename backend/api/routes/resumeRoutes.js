const express = require("express");
const multer = require("multer");

const {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
  parsePdfResume,
  getAtsScore,
} = require("../controllers/resumeController");

const { protect } = require("../../middlewares/authMiddleware");
const { uploadResumeImages } = require("../controllers/uploadImages");

const router = express.Router();

// Memory storage multer for PDF processing
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post("/", protect, createResume); // Create Resume
router.get("/", protect, getUserResumes); // Get all resumes for a user
router.get("/:id", protect, getResumeById); // Get resume by ID
router.put("/:id", protect, updateResume); // Update resume 
router.put("/:id/upload-images", protect, uploadResumeImages);

router.delete("/:id", protect, deleteResume); // Delete resume

// Premium Parsing & ATS score routes
router.post("/parse-pdf", protect, memoryUpload.single("pdf"), parsePdfResume);
router.get("/:id/ats-score", protect, getAtsScore);

module.exports = router;
