import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuCircleAlert,
  LuDownload,
  LuPalette,
  LuSave,
  LuTrash2,
  LuCode,
  LuUpload,
  LuType,
} from "react-icons/lu";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import TitleInput from "../../components/Inputs/TitleInput";
import { useReactToPrint } from "react-to-print";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import StepProgress from "../../components/StepProgress";
import { generateLatexCode, parseLatexToResume } from "../../utils/latexHelper";
import ProfileInfoForm from "./Forms/ProfileInfoForm";
import ContactInfoForm from "./Forms/ContactInfoForm";
import WorkExperienceForm from "./Forms/WorkExperienceForm";
import EducationDetailsForm from "./Forms/EducationDetailsForm";
import SkillsInfoForm from "./Forms/SkillsInfoForm";
import ProjectsDetailForm from "./Forms/ProjectsDetailForm";
import CertificationInfoForm from "./Forms/CertificationInfoForm";
import AdditionalInfoForm from "./Forms/AdditionalInfoForm";
import RenderResume from "../../components/ResumeTemplates/RenderResume";
import { captureElementAsImage, dataURLtoFile, fixTailwindColors } from "../../utils/helper";
import ThemeSelector from "./ThemeSelector";
import Modal from "../../components/Modal";

const EditResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const resumeRef = useRef(null);
  const resumeDownloadRef = useRef(null);
  const resumeCaptureRef = useRef(null);

  const [baseWidth, setBaseWidth] = useState(800);

  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [openLatexModal, setOpenLatexModal] = useState(false);
  const [openAtsModal, setOpenAtsModal] = useState(false);
  const [openFontSliders, setOpenFontSliders] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [atsData, setAtsData] = useState(null);
  const [loadingAts, setLoadingAts] = useState(false);
  const [latexText, setLatexText] = useState("");
  const fileInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState("profile-info");
  const [progress, setProgress] = useState(0);
  const [resumeData, setResumeData] = useState({
    title: "",
    thumbnailLink: "",
    profileInfo: {
      profileImg: null,
      profilePreviewUrl: "",
      fullName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "",
      colorPalette: "",
      fontSize: "medium",
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
        startDate: "", // e.g. "2022-01"
        endDate: "", // e.g. "2023-12"
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
        progress: 0, // percentage value(0-100)
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
        progress: 0, // percentage value(0-100)
      },
    ],
    interests: [""],
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (openLatexModal) {
      setLatexText(generateLatexCode(resumeData));
    }
  }, [openLatexModal, resumeData]);

  // Validate Inputs
  const validateAndNext = (e) => {
    if (currentPage === "additionalInfo") {
      setOpenPreviewModal(true);
      return;
    }
    setErrorMsg("");
    goToNextStep();
  };

  // Function to navigate to the next page
  const goToNextStep = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];

    if (currentPage === "additionalInfo") setOpenPreviewModal(true);

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex !== -1 && currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentPage(pages[nextIndex]);

      // Set progress as percentage
      const percent = Math.round((nextIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Function to navigate to the previous page
  const goBack = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];

    if (currentPage === "profile-info") navigate("/dashboard");

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentPage(pages[prevIndex]);

      //Update progress
      const percent = Math.round((prevIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderForm = () => {
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm
            profileData={resumeData?.profileInfo}
            updateSection={(key, value) => {
              updateSection("profileInfo", key, value);
            }}
            onNext={validateAndNext}
            onPresetApply={handlePresetApply}
          />
        );

      case "contact-info":
        return (
          <ContactInfoForm
            contactInfo={resumeData?.contactInfo}
            updateSection={(key, value) => {
              updateSection("contactInfo", key, value);
            }}
          />
        );

      case "work-experience":
        return (
          <WorkExperienceForm
            workExperience={resumeData?.workExperience}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("workExperience", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
            removeArrayItem={(index) =>
              removeArrayItem("workExperience", index)
            }
          />
        );

      case "education-info":
        return (
          <EducationDetailsForm
            educationInfo={resumeData?.education}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("education", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("education", newItem)}
            removeArrayItem={(index) => removeArrayItem("education", index)}
          />
        );

      case "skills":
        return (
          <SkillsInfoForm
            skillsInfo={resumeData?.skills}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("skills", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("skills", newItem)}
            removeArrayItem={(index) => removeArrayItem("skills", index)}
          />
        );

      case "projects":
        return (
          <ProjectsDetailForm
            projectInfo={resumeData?.projects}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("projects", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("projects", newItem)}
            removeArrayItem={(index) => removeArrayItem("projects", index)}
          />
        );

      case "certifications":
        return (
          <CertificationInfoForm
            certifications={resumeData?.certifications}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("certifications", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("certifications", newItem)}
            removeArrayItem={(index) =>
              removeArrayItem("certifications", index)
            }
          />
        );

      case "additionalInfo":
        return (
          <AdditionalInfoForm
            languages={resumeData.languages}
            interests={resumeData.interests}
            updateArrayItem={(section, index, key, value) => {
              updateArrayItem(section, index, key, value);
            }}
            addArrayItem={(section, newItem) => addArrayItem(section, newItem)}
            removeArrayItem={(section, index) =>
              removeArrayItem(section, index)
            }
          />
        );

      default:
        return null;
    }
  };

  //Update simple nested object (like profileInfo, contactInfo, etc.)
  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // Update array item (like workExperience[0], skills[1], etc.)
  const updateArrayItem = (section, index, key, value) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];

      if (key === null) {
        updatedArray[index] = value; // for simple strings like in 'interests
      } else {
        updatedArray[index] = {
          ...updatedArray[index],
          [key]: value,
        };
      }

      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  // Add item to array
  const addArrayItem = (section, newItem) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  // Remove item from array
  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];
      updatedArray.splice(index, 1);
      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  const handlePresetApply = (key) => {
    const PRESETS = {
      technical: {
        designation: "Software Engineer / Developer",
        summary: "Result-driven Software Engineer with expertise in building scalable web applications and algorithms. Proficient in modern frontend frameworks and robust backend microservices, with a track record of high-quality code delivery.",
        skills: [
          { name: "React.js", progress: 95 },
          { name: "Node.js", progress: 90 },
          { name: "JavaScript", progress: 95 },
          { name: "HTML & CSS", progress: 90 },
          { name: "Data Structures & Algorithms", progress: 85 }
        ]
      },
      medical: {
        designation: "Registered Nurse / Healthcare Provider",
        summary: "Compassionate Healthcare Specialist dedicated to providing high-quality patient care, diagnostics, and clinical documentation. Experienced in fast-paced medical environments, specialized treatments, and clinical standards.",
        skills: [
          { name: "Patient Assessment", progress: 95 },
          { name: "Emergency Care", progress: 90 },
          { name: "Clinical Documentation", progress: 95 },
          { name: "Healthcare Regulations", progress: 90 },
          { name: "Therapeutic Communication", progress: 95 }
        ]
      },
      creative: {
        designation: "UI/UX & Graphic Designer",
        summary: "Creative Graphic Designer specializing in brand identity, web interfaces, and user experience concepts. Skilled at translating brand visions into visually stunning layouts, interactive prototypes, and vector illustrations.",
        skills: [
          { name: "Adobe Photoshop", progress: 95 },
          { name: "Figma (UI/UX)", progress: 90 },
          { name: "Typography & Layouts", progress: 95 },
          { name: "Vector Illustration", progress: 90 },
          { name: "Branding Design", progress: 90 }
        ]
      },
      sales: {
        designation: "Sales & Business Development Lead",
        summary: "High-performing Sales professional focused on revenue growth, client relationship building, and strategic negotiations. Proven experience in driving revenue pipelines, customer satisfaction, and product demos.",
        skills: [
          { name: "Negotiation & Sales Pitch", progress: 95 },
          { name: "CRM (Salesforce)", progress: 90 },
          { name: "Market Analysis", progress: 95 },
          { name: "Lead Generation", progress: 90 },
          { name: "Relationship Management", progress: 95 }
        ]
      },
      academic: {
        designation: "Academic Researcher & Lecturer",
        summary: "Diligent Academic Researcher specializing in advanced data modeling, literature reviews, and curriculum instruction. Proven record of publications, seminar organization, and student mentoring.",
        skills: [
          { name: "Scientific Writing", progress: 95 },
          { name: "Data Analysis (Python/R)", progress: 90 },
          { name: "Curriculum Design", progress: 90 },
          { name: "Research Methodology", progress: 95 },
          { name: "Public Speaking", progress: 90 }
        ]
      }
    };

    const val = PRESETS[key];
    if (val) {
      setResumeData(prev => ({
        ...prev,
        profileInfo: {
          ...prev.profileInfo,
          designation: val.designation,
          summary: val.summary,
        },
        skills: val.skills
      }));
      toast.success(`Applied ${key} profession preset template!`);
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    const loadToast = toast.loading("Extracting and parsing PDF resume...");
    try {
      const res = await axiosInstance.post(API_PATHS.RESUME.PARSE_PDF, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const parsed = res.data.resumeData;
      setResumeData((prev) => ({
        ...prev,
        profileInfo: { ...prev.profileInfo, ...parsed.profileInfo },
        contactInfo: { ...prev.contactInfo, ...parsed.contactInfo },
        workExperience: parsed.workExperience || [],
        education: parsed.education || [],
        skills: parsed.skills || [],
        projects: parsed.projects || [],
        certifications: parsed.certifications || [],
      }));

      toast.success("PDF resume parsed and loaded successfully!");
    } catch (err) {
      console.error("PDF upload error:", err);
      toast.error("Failed to parse PDF resume.");
    } finally {
      toast.dismiss(loadToast);
    }
  };

  const fetchAtsScore = async () => {
    try {
      setAtsData(null);
      setLoadingAts(true);
      setOpenAtsModal(true); // Open the modal instantly!

      // Quick save current resume text data so the ATS analyzer runs on the latest edits
      await axiosInstance.put(
        API_PATHS.RESUME.UPDATE(resumeId),
        {
          ...resumeData,
          thumbnailLink: resumeData.thumbnailLink || "",
          profileInfo: {
            ...resumeData.profileInfo,
            profilePreviewUrl: resumeData.profileInfo.profilePreviewUrl || "",
          },
        }
      );

      const res = await axiosInstance.get(API_PATHS.RESUME.GET_ATS_SCORE(resumeId));
      setAtsData(res.data);
    } catch (err) {
      console.error("ATS audit error:", err);
      toast.error("Failed to fetch ATS audit scoring.");
      setOpenAtsModal(false);
    } finally {
      setLoadingAts(false);
    }
  };

  // Fetch resume info by ID
  const fetchResumeDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.RESUME.GET_BY_ID(resumeId),
      );

      if (response.data && response.data.profileInfo) {
        const resumeInfo = response.data;

        setResumeData((prevState) => ({
          ...prevState,
          title: resumeInfo?.title || "Untitled",
          template: resumeInfo?.template || prevState?.template,
          profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
          contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo,
          workExperience:
            resumeInfo?.workExperience || prevState?.workExperience,
          education: resumeInfo?.education || prevState?.education,
          skills: resumeInfo?.skills || prevState?.skills,
          projects: resumeInfo?.projects || prevState?.projects,
          certifications:
            resumeInfo?.certifications || prevState?.certifications,
          languages: resumeInfo?.languages || prevState?.languages,
          interests: resumeInfo?.interests || prevState?.interests,
        }));
      }
    } catch (error) {
      console.error("Error fetching resume details:", error);
    }
  };

  //upload thumbnail and resume profile img
  const uploadResumeImages = async () => {
    try {
      setIsLoading(true);

      if (resumeCaptureRef.current) {
        fixTailwindColors(resumeCaptureRef.current);
      }
      const imageDataUrl = await captureElementAsImage(resumeCaptureRef.current || resumeRef.current);

      // Convert base64 to file
      const thumbnailFile = dataURLtoFile(
        imageDataUrl,
        `resume-${resumeId}.png`
      );

      const profileImageFile = resumeData?.profileInfo?.profileImg || null;

      const formData = new FormData();
      if(profileImageFile) formData.append("profileImg", profileImageFile);
      if(thumbnailFile) formData.append("thumbnail", thumbnailFile);

      const uploadResponse = await axiosInstance.put(
        API_PATHS.RESUME.UPLOAD_IMAGES(resumeId),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const { thumbnailLink, profilePreviewUrl } = uploadResponse.data;

      console.log("RESUME_DATA__", resumeData);

      // Call the second API to update other resume data
      await updateResumeDetails(thumbnailLink, profilePreviewUrl);

      toast.success("Resume updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error uploading resume images:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsLoading(false);
    }
  };

  const updateResumeDetails = async (thumbnailLink, profilePreviewUrl) => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.put(
        API_PATHS.RESUME.UPDATE(resumeId),
        {
          ...resumeData,
          thumbnailLink: thumbnailLink || "",
          profileInfo: {
            ...resumeData.profileInfo,
            profilePreviewUrl: profilePreviewUrl || "",
          },
        }
      );
    } catch (error) {
      console.error("Error capturing image", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete resume
  const handleDeleteResume = async () => {
    setOpenDeleteModal(false);
    const loadToast = toast.loading("Deleting resume...");
    try {
      setIsLoading(true);
      const response = await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId));
      toast.success("Resume deleted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error(error.response?.data?.message || "Failed to delete resume. Please try again.");
    } finally {
      setIsLoading(false);
      toast.dismiss(loadToast);
    }
  };

  // Download resume
  const reactToPrintFn = useReactToPrint({
    contentRef: resumeDownloadRef,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 0;
      }
      @media print {
        html, body {
          margin: 0;
          padding: 0;
          width: 210mm;
          height: 297mm;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }
    `,
    documentTitle: resumeData.title || "Resume",
  });

  // Helper to parse custom font sizes
  const getFontSizeObject = (sizeVal) => {
    try {
      if (sizeVal && sizeVal.startsWith("{")) {
        return JSON.parse(sizeVal);
      }
    } catch (e) {
      console.error("Failed to parse font sizes:", e);
    }
    if (sizeVal === "small") return { name: 20, heading: 13, body: 11 };
    if (sizeVal === "large") return { name: 28, heading: 17, body: 15 };
    return { name: 24, heading: 15, body: 13 }; // Default medium
  };

  const fontSizes = getFontSizeObject(resumeData?.template?.fontSize);

  const updateCustomFontSize = (type, value) => {
    const updated = {
      ...fontSizes,
      [type]: value
    };
    setResumeData(prev => ({
      ...prev,
      template: {
        ...prev.template,
        fontSize: JSON.stringify(updated)
      }
    }));
  };

  // Function to update baseWidth based on the resume container size
  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);

    if (resumeId) {
      fetchResumeDetailsById();
    }

    return () => {
      window.removeEventListener("resize", updateBaseWidth);
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="relative z-30 flex items-center justify-between gap-5 panel-card py-4 px-6 mb-6">
          <TitleInput
            title={resumeData.title}
            setTitle={(value) =>
              setResumeData((prevState) => ({
                ...prevState,
                title: value,
              }))
            }
          />

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                className="btn-small-light flex items-center gap-2 cursor-pointer"
                onClick={() => setOpenFontSliders(!openFontSliders)}
              >
                <LuType className="text-[16px]" />
                <span className="hidden md:block">Text Sizing</span>
              </button>
              
              {openFontSliders && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-40 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Adjust Font Sizes</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                        <span>Name / Title</span>
                        <span>{fontSizes.name}px</span>
                      </div>
                      <input
                        type="range"
                        min="16"
                        max="40"
                        value={fontSizes.name}
                        onChange={(e) => updateCustomFontSize("name", parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#9C8D7F]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        <span>Headings</span>
                        <span>{fontSizes.heading}px</span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="28"
                        value={fontSizes.heading}
                        onChange={(e) => updateCustomFontSize("heading", parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#9C8D7F]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        <span>Body Text</span>
                        <span>{fontSizes.body}px</span>
                      </div>
                      <input
                        type="range"
                        min="9"
                        max="20"
                        value={fontSizes.body}
                        onChange={(e) => updateCustomFontSize("body", parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#9C8D7F]"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setResumeData(prev => ({
                          ...prev,
                          template: {
                            ...prev.template,
                            fontSize: "medium"
                          }
                        }));
                        setOpenFontSliders(false);
                        toast.success("Reset to default sizing");
                      }}
                      className="text-[10px] font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wide cursor-pointer"
                    >
                      Reset Defaults
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="btn-small-light bg-gradient-to-r from-[#9C8D7F]/10 to-[#CDBFA5]/15 border-[#CDBFA5]/60 hover:from-[#9C8D7F]/20 hover:to-[#CDBFA5]/25 hover:border-[#9C8D7F]"
              onClick={fetchAtsScore}
              disabled={loadingAts}
            >
              <LuCircleAlert className="text-[16px] text-[#9C8D7F] animate-pulse" />
              <span className="hidden md:block text-[#2C3440] font-semibold">AI ATS Check</span>
            </button>

            <button
              className="btn-small-light"
              onClick={() => setOpenThemeSelector(true)}
            >
              <LuPalette className="text-[16px]" />
              <span className="hidden md:block">Templates & Design</span>
            </button>

            <button
              className="btn-small-light"
              onClick={() => setOpenLatexModal(true)}
            >
              <LuCode className="text-[16px]" />
              <span className="hidden md:block">LaTeX Code</span>
            </button>

            <button className="btn-small-light" onClick={() => setOpenDeleteModal(true)}>
              <LuTrash2 className="text-[16px]" />
              <span className="hidden md:block">Delete</span>
            </button>

            <button
              className="btn-small-light"
              onClick={() => setOpenPreviewModal(true)}
            >
              <LuDownload className="text-[16px]" />
              <span className="hidden md:block">Preview & Download</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="panel-card overflow-hidden flex flex-col">
            <StepProgress progress={progress} />

            {/* Top Section Nav Tabs */}
            <div className="flex border-b border-slate-200 overflow-x-auto custom-scrollbar bg-slate-50/50">
              {[
                { id: "profile-info", label: "Profile" },
                { id: "contact-info", label: "Contact" },
                { id: "work-experience", label: "Experience" },
                { id: "education-info", label: "Education" },
                { id: "skills", label: "Skills" },
                { id: "projects", label: "Projects" },
                { id: "certifications", label: "Certifications" },
                { id: "additionalInfo", label: "Additional" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentPage(tab.id)}
                  className={`flex-1 min-w-[90px] py-3 text-xs font-bold text-center border-b-2 whitespace-nowrap transition-all duration-200 ${
                    currentPage === tab.id
                      ? "border-[#2C3440] text-[#2C3440] bg-white shadow-sm"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 p-2">
              {renderForm()}
            </div>

            <div className="mx-5">
              {errorMsg && (
                <div className="flex items-center gap-2 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 my-2 rounded-lg shadow-sm">
                  <LuCircleAlert className="text-md" /> {errorMsg}
                </div>
              )}

              <div className="flex items-end justify-end gap-3 mt-3 mb-5">
                <button
                  className="btn-small-light"
                  onClick={goBack}
                  disabled={isLoading}
                >
                  <LuArrowLeft className="text-[16px]" />
                  Back
                </button>
                <button
                  className="btn-small-light"
                  onClick={uploadResumeImages}
                  disabled={isLoading}
                >
                  <LuSave className="text-[16px]" />
                  {isLoading ? "Updating..." : "Save & Exit"}
                </button>
                <button
                  className="btn-small"
                  onClick={validateAndNext}
                  disabled={isLoading}
                >
                  {currentPage === "additionalInfo" && (
                    <LuDownload className="text-[16px]" />
                  )}

                  {currentPage === "additionalInfo"
                    ? "Preview & Download"
                    : "Next"}
                  {currentPage !== "additionalInfo" && (
                    <LuArrowLeft className="text-[16px] rotate-180" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div 
            ref={resumeRef} 
            className="md:sticky md:top-24 h-[calc(100vh-140px)] overflow-y-auto overflow-x-hidden custom-scrollbar preview-panel flex justify-center items-start"
          >
            <div 
              ref={resumeCaptureRef}
              style={{ 
                width: `${baseWidth > 32 ? baseWidth - 32 : 1}px`, 
                minHeight: `${baseWidth > 32 ? (297 * (baseWidth - 32)) / 210 : 1}px`,
                overflow: 'visible',
                position: 'relative',
                "--resume-font-name": `${fontSizes.name}px`,
                "--resume-font-heading": `${fontSizes.heading}px`,
                "--resume-font-body": `${fontSizes.body}px`,
              }}
            >
              {/* Resume Template */}
              <RenderResume
                templateId={resumeData?.template?.theme || ""}
                resumeData={resumeData}
                colorPalette={resumeData?.template?.colorPalette || ""}
                fontSize={resumeData?.template?.fontSize || "medium"}
                containerWidth={baseWidth > 32 ? baseWidth - 32 : baseWidth}
                onSectionClick={(sectionKey) => {
                  setCurrentPage(sectionKey);
                  const pages = [
                    "profile-info",
                    "contact-info",
                    "work-experience",
                    "education-info",
                    "skills",
                    "projects",
                    "certifications",
                    "additionalInfo",
                  ];
                  const idx = pages.indexOf(sectionKey);
                  if (idx !== -1) {
                    setProgress(Math.round((idx / (pages.length - 1)) * 100));
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openThemeSelector}
        onClose={() => setOpenThemeSelector(false)}
        title="Change Theme"
      >
        <div className="w-[90vw] h-[80vh]">
          <ThemeSelector
            selectedTheme={resumeData?.template}
            setSelectedTheme={(value) => {
              setResumeData((prevState) => ({
                ...prevState,
                template: value || prevState.template,
              }));
            }}
            resumeData={resumeData}
            onClose={() => setOpenThemeSelector(false)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={openPreviewModal}
        onClose={() => setOpenPreviewModal(false)}
        title={resumeData.title}
        showActionBtn
        actionBtnText="Download"
        actionBtnIcon={<LuDownload className="text-[16px]" />}
        onActionClick={() => reactToPrintFn()}
      >
        <div className="w-full h-[75vh] overflow-auto bg-gray-100 p-4 flex items-start justify-center">
          <div 
            ref={resumeDownloadRef} 
            style={{ 
              width: "210mm", 
              minHeight: "297mm", 
              backgroundColor: "white",
              "--resume-font-name": `${fontSizes.name}px`,
              "--resume-font-heading": `${fontSizes.heading}px`,
              "--resume-font-body": `${fontSizes.body}px`,
            }}
          >
            <RenderResume
              templateId={resumeData?.template?.theme || ""}
              resumeData={resumeData}
              colorPalette={resumeData?.template?.colorPalette || ""}
              fontSize={resumeData?.template?.fontSize || "medium"}
              containerWidth={793}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={openLatexModal}
        onClose={() => setOpenLatexModal(false)}
        title="LaTeX Code Editor & Generator"
      >
        <div className="w-[90vw] md:w-[700px] p-6 flex flex-col gap-4">
          <p className="text-xs text-slate-500">
            View, edit, and copy the LaTeX representation of your resume. You can also write/edit LaTeX code and click <strong>Import to Form</strong> to sync modifications back to the builder fields.
          </p>

          <textarea
            className="w-full h-[400px] p-4 font-mono text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#9C8D7F] resize-none"
            value={latexText}
            onChange={(e) => setLatexText(e.target.value)}
          />

          <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
            <div className="flex gap-2">
              <button
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-300"
                onClick={() => {
                  setLatexText(generateLatexCode(resumeData));
                  toast.success("LaTeX synced from form data");
                }}
              >
                Sync from Form
              </button>

              <button
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#9C8D7F] to-[#CDBFA5] text-white transition-all duration-300"
                onClick={() => {
                  try {
                    const parsedData = parseLatexToResume(latexText);
                    if (parsedData) {
                      setResumeData((prev) => ({
                        ...prev,
                        ...parsedData,
                        template: {
                          ...prev.template,
                          theme: "06", // Force standard academic LaTeX serif layout
                        },
                        profileInfo: {
                          ...prev.profileInfo,
                          ...parsedData.profileInfo,
                        },
                        contactInfo: {
                          ...prev.contactInfo,
                          ...parsedData.contactInfo,
                        },
                      }));
                      toast.success("LaTeX imported successfully into form!");
                      setOpenLatexModal(false);
                    } else {
                      toast.error("Failed to parse LaTeX. Invalid format.");
                    }
                  } catch (err) {
                    toast.error("Error parsing LaTeX code.");
                  }
                }}
              >
                Import to Form
              </button>
            </div>

            <div className="flex gap-2">
              <button
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all duration-300"
                onClick={() => {
                  navigator.clipboard.writeText(latexText);
                  toast.success("Copied to clipboard!");
                }}
              >
                Copy Code
              </button>

              <button
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2C3440] hover:bg-[#434C5E] text-white transition-all duration-300"
                onClick={() => setOpenLatexModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={openAtsModal}
        onClose={() => setOpenAtsModal(false)}
        title="AI ATS Resume Auditor & Scorecard"
      >
        <div className="w-[90vw] md:w-[650px] p-5 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar bg-white text-gray-800 transition-colors">
          {loadingAts ? (
            <div className="space-y-6">
              {/* Pulsing Status Bar */}
              <div className="flex items-center gap-3 justify-center py-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100/60 rounded-2xl shadow-sm">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                </span>
                <span className="text-[12px] font-bold text-amber-800 tracking-wide uppercase animate-pulse">
                  AI ATS Scanning in progress...
                </span>
              </div>

              {/* Scorecard Circular Ring Skeleton */}
              <div className="flex flex-col sm:flex-row items-center gap-5 bg-[#F5F3F0]/65 border border-[#CDBFA5]/25 rounded-2xl p-4 shadow-sm animate-pulse">
                <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-[6px] border-slate-200 bg-white/80 shadow-md">
                  <div className="w-12 h-12 rounded-full bg-slate-200/80 animate-pulse"></div>
                </div>
                <div className="flex-1 space-y-3 w-full">
                  <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-slate-100 rounded w-5/6 animate-pulse"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>

              {/* Action Checklist Skeleton */}
              <div className="space-y-3 animate-pulse">
                <div className="h-3.5 bg-slate-200 rounded w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-11 bg-slate-100 rounded-xl w-full animate-pulse"></div>
                  <div className="h-11 bg-slate-100 rounded-xl w-full animate-pulse"></div>
                  <div className="h-11 bg-slate-100 rounded-xl w-full animate-pulse"></div>
                </div>
              </div>

              {/* Buzzwords Skeleton */}
              <div className="space-y-3 animate-pulse">
                <div className="h-3.5 bg-slate-200 rounded w-1/4"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-8 bg-slate-100 rounded-full w-24 animate-pulse"></div>
                  <div className="h-8 bg-slate-100 rounded-full w-28 animate-pulse"></div>
                  <div className="h-8 bg-slate-100 rounded-full w-20 animate-pulse"></div>
                </div>
              </div>

              {/* Action Verbs Skeleton */}
              <div className="space-y-3 animate-pulse">
                <div className="h-3.5 bg-slate-200 rounded w-1/3"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-8 bg-slate-100 rounded-full w-28 animate-pulse"></div>
                  <div className="h-8 bg-slate-100 rounded-full w-24 animate-pulse"></div>
                  <div className="h-8 bg-slate-100 rounded-full w-32 animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : atsData ? (
            <div className="space-y-5">
              {/* Scorecard Circular Ring */}
              <div className="flex flex-col sm:flex-row items-center gap-5 bg-[#F5F3F0] border border-[#CDBFA5]/30 rounded-2xl p-4 shadow-sm">
                <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-[6px] border-[#CDBFA5]/40 bg-white shadow-md">
                  <span className="text-2xl font-black text-[#2C3440] font-sans">
                    {atsData.score}
                  </span>
                  <span className="text-[9px] text-[#9C8D7F] font-bold uppercase absolute bottom-2.5">Score</span>
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      {atsData.score >= 80 
                        ? "🔥 Excellent! Your resume is highly ATS-optimized." 
                        : atsData.score >= 60 
                        ? "💡 Good potential, but some optimizations are recommended."
                        : "⚠️ Action required to pass automated recruiters screenings."}
                    </h4>
                    {atsData.isAiScored && (
                      <span className="text-[8px] font-black uppercase bg-[#CDBFA5]/30 text-[#2C3440] px-2 py-0.5 rounded-full border border-[#CDBFA5]/50">
                        AI-Powered
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    ATS systems grade resumes based on keywords, section formatting, descriptions length, and clean structure.
                  </p>
                </div>
              </div>

              {/* Action Checklist */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  📋 Suggested Improvements Checklist
                </h5>
                {atsData.improvements.length > 0 ? (
                  <ul className="space-y-1.5">
                    {atsData.improvements.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-[11px] text-slate-600 bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl font-sans">
                        <span className="text-amber-500 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-100 p-3 rounded-xl font-semibold">
                    No critical improvements needed! Your sections are fully complete.
                  </div>
                )}
              </div>

              {/* Buzzwords */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  🚫 Buzzwords To Avoid
                </h5>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Avoid using generic clichés. Focus on performance-based, quantitative achievements instead.
                </p>
                {atsData.buzzwordsFound.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {atsData.buzzwordsFound.map((word, idx) => (
                      <span key={idx} className="text-[9px] text-red-700 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-full font-bold uppercase tracking-wide">
                        {word}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-100 p-3 rounded-xl font-semibold">
                    Clean! No generic buzzwords found in your content.
                  </div>
                )}
              </div>

              {/* Action Verbs */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  ⚡ Recommended Action Verbs
                </h5>
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                  Use strong action verbs at the start of your experience points to highlight personal impact:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {atsData.actionVerbsRecommended.map((verb, idx) => (
                    <span key={idx} className="text-[10px] text-[#2C3440] bg-[#CDBFA5]/25 border border-[#CDBFA5]/40 px-2.5 py-1.5 rounded-full font-semibold">
                      +{verb}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 font-medium">
              No audit report available. Please click "AI ATS Check" to analyze.
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2C3440] hover:bg-[#434C5E] text-white transition-all duration-300"
              onClick={() => setOpenAtsModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title="Permanently Delete Resume?"
      >
        <div className="p-6 max-w-sm">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            Are you sure you want to permanently delete <strong className="text-slate-800 dark:text-slate-200">"{resumeData.title || "this resume"}"</strong>? This action cannot be undone and will permanently remove all your data.
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-all duration-300"
              onClick={() => setOpenDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer shadow-md shadow-red-600/10 hover:shadow-red-600/20 transition-all duration-300"
              onClick={handleDeleteResume}
            >
              Permanently Delete
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default EditResume;
