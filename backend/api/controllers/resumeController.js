const cloudinary = require('../config/cloudinary');
const Resume = require('../models/Resume');

// @desc   Create a new resume
// @route  POST /api/resumes
// @access Private
const createResume = async (req, res) => {
    try {
        const { title } = req.body; 

        // Default template
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: "",
                fullName: "",
                designation: "",
                summary: "",
            },
            contactInfo: {
                email: "",
                phone: "",
                location: "",
                linkedin: "",
                github: "",
                website: "",
            },
            workExperience: [
                {
                    company: "",
                    role: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                },
            ],
            education: [
                {
                    degree: "",
                    institution: "",
                    startDate: "",
                    endDate: "",
                },
            ],
            skills: [
                {
                    name: "",
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: "",
                    description: "",
                    github: "",
                    liveDemo: "",
                },
            ],
            certifications: [
                {
                    title: "",
                    issuer: "",
                    year: "",
                },
            ],
            languages: [
                {
                    name: "",
                    progress: 0,
                },
            ],
            interests: [""],
        };

        const newResume = await Resume.create({
            userId: req.user.id,
            title,
            ...defaultResumeData,
        });

        res.status(201).json(newResume);
    } catch (error) {
        res
          .status(500)
          .json({ message: 'Failed to create resume', error: error.message });
    }
};

// @desc   Get all resumes for logged-in user
// @route  GET /api/resumes
// @access Private
const getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id }).sort({
            createdAt: -1,
        });
        res.json(resumes);
    } catch (error) {
        res
          .status(500)
          .json({ message: 'Failed to create resume', error: error.message });
    }
};

// @desc   Get single resume by ID
// @route  GET /api/resumes/:id
// @access Private
const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

        if(!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.json(resume);
    } catch (error) {
        res
          .status(500)
          .json({ message: 'Failed to create resume', error: error.message });
    }
};

// @desc   Update a resume
// @route  PUT /api/resumes/:id
// @access Private
const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if(!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Merge updates from req.body into existing resume
        Object.assign(resume, req.body);

        // Save updated resume
        const savedResume = await resume.save();

        res.json(savedResume);
    } catch (error) {
        res
          .status(500)
          .json({ message: 'Failed to create resume', error: error.message });
    }
};

// @desc   Delete a resume
// @route  DELETE /api/resumes/:id
// @access Private
const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if(!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Delete thumbnailLink and profilePreviewUrl images from Cloudinary
        if (resume.thumbnailLink) {
            try {
                // Extract public_id from the Cloudinary URL
                const urlParts = resume.thumbnailLink.split('/');
                const publicIdWithExtension = urlParts[urlParts.length - 1];
                const publicId = `resume-builder/${publicIdWithExtension.split('.')[0]}`;
                await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
                console.error("Error deleting thumbnail from Cloudinary:", deleteError);
            }
        }

        if(resume.profileInfo?.profilePreviewUrl) {
            try {
                // Extract public_id from the Cloudinary URL
                const urlParts = resume.profileInfo.profilePreviewUrl.split('/');
                const publicIdWithExtension = urlParts[urlParts.length - 1];
                const publicId = `resume-builder/${publicIdWithExtension.split('.')[0]}`;
                await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
                console.error("Error deleting profile image from Cloudinary:", deleteError);
            }
        }

        const deleted = await Resume.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if(!deleted) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        res
          .status(500)
          .json({ message: 'Failed to create resume', error: error.message });
    }
};

module.exports = {
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume,
};