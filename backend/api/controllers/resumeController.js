const cloudinary = require('../config/cloudinary');
const Resume = require('../models/Resume');
const crypto = require('crypto');

// Allowed fields that can be updated (prevents userId hijacking)
const ALLOWED_UPDATE_FIELDS = [
    'title', 'thumbnailLink', 'template', 'profileInfo', 'contactInfo',
    'workExperience', 'education', 'skills', 'projects',
    'certifications', 'languages', 'interests',
];

// @desc   Create a new resume
// @route  POST /api/resumes
// @access Private
const createResume = async (req, res) => {
    try {
        const { title, template } = req.body; 

        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Resume title is required' });
        }

        // Default template
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                profilePreviewUrl: "",
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

        // Merge parsed data from request body over defaults
        const mergedData = {
            profileInfo: { ...defaultResumeData.profileInfo, ...(req.body.profileInfo || {}) },
            contactInfo: { ...defaultResumeData.contactInfo, ...(req.body.contactInfo || {}) },
            workExperience: (req.body.workExperience && req.body.workExperience.length > 0)
                ? req.body.workExperience
                : defaultResumeData.workExperience,
            education: (req.body.education && req.body.education.length > 0)
                ? req.body.education
                : defaultResumeData.education,
            skills: (req.body.skills && req.body.skills.length > 0)
                ? req.body.skills
                : defaultResumeData.skills,
            projects: (req.body.projects && req.body.projects.length > 0)
                ? req.body.projects
                : defaultResumeData.projects,
            certifications: (req.body.certifications && req.body.certifications.length > 0)
                ? req.body.certifications
                : defaultResumeData.certifications,
            languages: (req.body.languages && req.body.languages.length > 0)
                ? req.body.languages
                : defaultResumeData.languages,
            interests: (req.body.interests && req.body.interests.length > 0)
                ? req.body.interests
                : defaultResumeData.interests,
        };

        const newResume = await Resume.create({
            userId: req.user.id,
            title: title.trim(),
            template: template || { theme: "01", colorPalette: [], fontSize: "medium" },
            ...mergedData,
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
          .json({ message: 'Failed to fetch resumes', error: error.message });
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
          .json({ message: 'Failed to fetch resume', error: error.message });
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

        // Only allow whitelisted fields to be updated (prevents userId hijacking)
        for (const key of ALLOWED_UPDATE_FIELDS) {
            if (req.body[key] !== undefined) {
                resume[key] = req.body[key];
            }
        }

        // Save updated resume
        const savedResume = await resume.save();

        res.json(savedResume);
    } catch (error) {
        res
          .status(500)
          .json({ message: 'Failed to update resume', error: error.message });
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

        // Delete thumbnailLink and profilePreviewUrl images from Cloudinary (Asynchronously in background to avoid blocking DB delete)
        if (resume.thumbnailLink) {
            try {
                const urlParts = resume.thumbnailLink.split('/');
                const publicIdWithExtension = urlParts[urlParts.length - 1];
                const publicId = `resume-builder/${publicIdWithExtension.split('.')[0]}`;
                cloudinary.uploader.destroy(publicId).catch((deleteError) => {
                    console.error("Error deleting thumbnail from Cloudinary (Background):", deleteError);
                });
            } catch (err) {
                console.error("Error extracting thumbnail public_id:", err);
            }
        }

        if(resume.profileInfo?.profilePreviewUrl) {
            try {
                const urlParts = resume.profileInfo.profilePreviewUrl.split('/');
                const publicIdWithExtension = urlParts[urlParts.length - 1];
                const publicId = `resume-builder/${publicIdWithExtension.split('.')[0]}`;
                cloudinary.uploader.destroy(publicId).catch((deleteError) => {
                    console.error("Error deleting profile image from Cloudinary (Background):", deleteError);
                });
            } catch (err) {
                console.error("Error extracting profile preview public_id:", err);
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
          .json({ message: 'Failed to delete resume', error: error.message });
    }
};

const parsePdfResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No PDF file uploaded" });
        }

        const { PDFParse } = require("pdf-parse");
        const { parseRawTextToResume } = require("../utils/resumeParser");

        const dataBuffer = req.file.buffer;
        const parser = new PDFParse({ data: dataBuffer });
        const parsedPdf = await parser.getText();
        const parsedData = parseRawTextToResume(parsedPdf.text);

        res.json({
            message: "PDF parsed successfully",
            resumeData: parsedData,
        });
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        res.status(500).json({ message: "Failed to parse PDF resume", error: error.message });
    }
};

const callGeminiAts = async (resume) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim().length < 5) {
        throw new Error("No Gemini API key configured");
    }

    const payload = {
        contents: [
            {
                parts: [
                    {
                        text: `You are an expert ATS (Applicant Tracking System) parser and resume auditor.
Analyze the following resume JSON data and return an ATS scorecard analysis.

Resume Data:
${JSON.stringify({
  profileInfo: resume.profileInfo,
  contactInfo: resume.contactInfo,
  workExperience: resume.workExperience,
  education: resume.education,
  skills: resume.skills,
  projects: resume.projects,
  certifications: resume.certifications,
  languages: resume.languages,
  interests: resume.interests
}, null, 2)}

You MUST respond with a valid JSON object ONLY. Do not write any markdown wrappers (like \`\`\`json) or additional text. The JSON object must match this schema exactly:
{
  "score": number (an integer between 20 and 100 representing the ATS optimization level),
  "improvements": string[] (a list of 3-6 actionable suggestions to improve the resume content, keywords, metrics or structure),
  "buzzwordsFound": string[] (list of any generic or overused buzzwords found in the resume like "team-player", "detail-oriented", "synergy", "hardworking", "think outside the box", "go-getter", etc.),
  "actionVerbsRecommended": string[] (list of 5-8 strong action verbs recommended to start experience bullet points, such as "engineered", "orchestrated", "spearheaded", "accelerated", etc.)
}`
                    }
                ]
            }
        ]
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const MAX_RETRIES = 2;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.status === 429 && attempt < MAX_RETRIES) {
            // Rate limited — wait and retry with exponential backoff
            const delay = (attempt + 1) * 2000; // 2s, 4s
            console.warn(`Gemini API rate limited (429). Retrying in ${delay}ms... (attempt ${attempt + 1}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
        }

        if (!response.ok) {
            const errorBody = await response.text().catch(() => "Unable to read error body");
            if (response.status === 400 || response.status === 403) {
                throw new Error(`Gemini API key is invalid or unauthorized (${response.status}). Check your GEMINI_API_KEY in .env`);
            }
            throw new Error(`Gemini API error: Status ${response.status} — ${errorBody.substring(0, 200)}`);
        }

        const data = await response.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            throw new Error("Invalid response from Gemini API");
        }

        // Strip markdown code block brackets if present
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(text);
    }

    throw new Error("Gemini API rate limit exceeded after retries. Please try again later.");
};

const getResumeContentHash = (resume) => {
    const dataToHash = {
        profileInfo: {
            fullName: resume.profileInfo?.fullName || "",
            designation: resume.profileInfo?.designation || "",
            summary: resume.profileInfo?.summary || ""
        },
        contactInfo: resume.contactInfo || {},
        workExperience: (resume.workExperience || []).map(exp => ({
            company: exp.company || "",
            role: exp.role || "",
            startDate: exp.startDate || "",
            endDate: exp.endDate || "",
            description: exp.description || ""
        })),
        education: (resume.education || []).map(edu => ({
            degree: edu.degree || "",
            institution: edu.institution || "",
            startDate: edu.startDate || "",
            endDate: edu.endDate || ""
        })),
        skills: (resume.skills || []).map(s => ({
            name: s.name || "",
            progress: s.progress || 0
        })),
        projects: (resume.projects || []).map(p => ({
            title: p.title || "",
            description: p.description || "",
            github: p.github || "",
            liveDemo: p.liveDemo || ""
        })),
        certifications: (resume.certifications || []).map(c => ({
            title: c.title || "",
            issuer: c.issuer || "",
            year: c.year || ""
        })),
        languages: (resume.languages || []).map(l => ({
            name: l.name || "",
            progress: l.progress || 0
        })),
        interests: resume.interests || []
    };

    return crypto.createHash('sha256').update(JSON.stringify(dataToHash)).digest('hex');
};

const getAtsScore = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        const currentHash = getResumeContentHash(resume);

        // Check if there is a cached ATS score with matching content hash
        if (resume.atsScoreCache && resume.atsScoreCache.contentHash === currentHash) {
            console.log("Returning cached ATS score (content hash matched)");
            return res.json(resume.atsScoreCache);
        }

        // Try to perform AI ATS scoring first
        try {
            const aiScoreData = await callGeminiAts(resume);
            const scoreResult = {
                score: aiScoreData.score,
                improvements: aiScoreData.improvements,
                buzzwordsFound: aiScoreData.buzzwordsFound,
                actionVerbsRecommended: aiScoreData.actionVerbsRecommended,
                isAiScored: true,
                contentHash: currentHash,
                updatedAt: new Date()
            };

            // Save to cache in DB
            resume.atsScoreCache = scoreResult;
            await resume.save();

            return res.json(scoreResult);
        } catch (aiError) {
            console.warn("AI ATS check failed, falling back to heuristics:", aiError.message);
        }

        // Heuristics Fallback Setup
        let score = 55; // base score
        const improvements = [];
        const buzzwordsFound = [];
        const verbsFound = [];

        const buzzwordsList = ["detail-oriented", "synergy", "team-player", "self-motivated", "dynamic", "hardworking", "go-getter", "think outside the box"];
        const actionVerbsList = ["engineered", "orchestrated", "architected", "streamlined", "implemented", "developed", "managed", "designed", "reduced", "increased"];

        // Combine text blocks for matching
        const textBlocks = [];
        if (resume.profileInfo?.summary) textBlocks.push(resume.profileInfo.summary);
        
        resume.workExperience.forEach(exp => {
            if (exp.description) textBlocks.push(exp.description);
            if (exp.role) textBlocks.push(exp.role);
        });
        resume.projects.forEach(proj => {
            if (proj.description) textBlocks.push(proj.description);
        });

        const fullText = textBlocks.join(" ").toLowerCase();

        // Check buzzwords
        buzzwordsList.forEach(word => {
            if (fullText.includes(word)) {
                buzzwordsFound.push(word);
                score -= 3;
            }
        });

        // Check action verbs
        actionVerbsList.forEach(verb => {
            if (fullText.includes(verb)) {
                verbsFound.push(verb);
                score += 4;
            }
        });

        // Section Completeness Checks
        if (resume.profileInfo?.fullName) score += 5;
        else improvements.push("Add your full name to the profile section.");

        if (resume.profileInfo?.summary) {
            score += 5;
            if (resume.profileInfo.summary.length < 50) {
                improvements.push("Expand your Professional Summary to at least 2-3 sentences to capture recruiter interest.");
            }
        } else {
            improvements.push("Add a Professional Summary section summarizing your highlights.");
        }

        if (resume.contactInfo?.email && resume.contactInfo?.phone) score += 5;
        else improvements.push("Ensure both phone number and email are filled in the Contact Details.");

        if (resume.contactInfo?.linkedin) score += 3;
        else improvements.push("Add your LinkedIn profile URL for online professional presence.");

        if (resume.workExperience.length > 0) {
            score += 10;
            let hasDesc = false;
            resume.workExperience.forEach((exp, idx) => {
                if (exp.description && exp.description.trim().length > 10) {
                    hasDesc = true;
                }
            });
            if (!hasDesc) {
                improvements.push("Add bulleted description details to your Work Experience roles.");
                score -= 10;
            }
        } else {
            improvements.push("Add Work Experience or internship roles to showcase your practical history.");
        }

        if (resume.education.length > 0) {
            score += 5;
        } else {
            improvements.push("Add your Education qualifications.");
        }

        if (resume.skills.length > 0) {
            score += 5;
            if (resume.skills.length < 5) {
                improvements.push("List at least 5 technical/soft skills to pass ATS keyword match screenings.");
            }
        } else {
            improvements.push("Add skills tags to describe your technical expertise.");
        }

        if (resume.projects.length > 0) {
            score += 5;
        } else {
            improvements.push("Add personal or academic projects to demonstrate practical capabilities.");
        }

        // Cap score
        score = Math.min(Math.max(score, 15), 100);

        const heuristicResult = {
            score,
            improvements,
            buzzwordsFound,
            actionVerbsFound: verbsFound,
            actionVerbsRecommended: actionVerbsList.filter(v => !verbsFound.includes(v)),
            isAiScored: false,
            contentHash: currentHash,
            updatedAt: new Date()
        };

        // Save heuristic results to cache in DB
        resume.atsScoreCache = heuristicResult;
        await resume.save();

        return res.json(heuristicResult);

    } catch (error) {
        console.error("ATS Audit Error:", error);
        res.status(500).json({ message: "Failed to perform ATS audit", error: error.message });
    }
};

module.exports = {
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume,
    parsePdfResume,
    getAtsScore,
};