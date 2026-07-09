import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { LuCirclePlus, LuUpload } from 'react-icons/lu';
import moment from 'moment';
import ResumeSummaryCard from '../../components/Cards/ResumeSummaryCard';
import Modal from '../../components/Modal';
import CreateResumeForm from './CreateResumeForm';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allResumes, setAllResumes] = useState(null);
  const dashboardFileRef = useRef(null);

  const handlePdfImportAndCreate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    const loadToast = toast.loading("Uploading and parsing PDF resume...");
    try {
      const parseRes = await axiosInstance.post(API_PATHS.RESUME.PARSE_PDF, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const parsed = parseRes.data.resumeData;

      const createRes = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title: file.name.replace(".pdf", "") || "Imported Resume",
        template: { theme: "01", colorPalette: [] },
        profileInfo: parsed.profileInfo,
        contactInfo: parsed.contactInfo,
        workExperience: parsed.workExperience,
        education: parsed.education,
        skills: parsed.skills,
        projects: parsed.projects,
        certifications: parsed.certifications,
        languages: parsed.languages,
        interests: parsed.interests,
      });

      toast.success("PDF resume parsed and created successfully!");
      navigate(`/resume/${createRes.data?._id}`);
    } catch (err) {
      console.error("PDF import error:", err);
      toast.error("Failed to parse and create resume from PDF.");
    } finally {
      toast.dismiss(loadToast);
    }
  };

  const fetchAllResumes = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      setAllResumes(response.data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  useEffect(() => {
    fetchAllResumes();
  } , []);

  return <DashboardLayout>
    <div className='grid grid-cols-1 md:grid-cols-4 gap-6 pt-1 pb-6 px-4 md:px-0'>
      <div 
        className='h-[350px] flex flex-col gap-5 items-center justify-center bg-white/80 dark:bg-[#1C2330]/80 backdrop-blur-md rounded-2xl border-2 border-dashed border-[#9C8D7F]/50 dark:border-[#9C8D7F]/30 hover:border-[#9C8D7F] dark:hover:border-[#CDBFA5] hover:bg-[#CDBFA5]/5 dark:hover:bg-[#CDBFA5]/5 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300'
        onClick={() => setOpenCreateModal(true)}
      >
        <div className='w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#9C8D7F] to-[#CDBFA5] rounded-2xl shadow-lg'>
          <LuCirclePlus className='text-3xl text-white' />
        </div>

        <h3 className='font-semibold text-[#2C3440] dark:text-gray-100 text-lg'>Add New Resume</h3>
      </div>

      <div 
        className='h-[350px] flex flex-col gap-5 items-center justify-center bg-white/80 dark:bg-[#1C2330]/80 backdrop-blur-md rounded-2xl border-2 border-dashed border-[#2C3440]/30 dark:border-slate-700 hover:border-[#2C3440] dark:hover:border-gray-300 hover:bg-[#2C3440]/5 dark:hover:bg-slate-700/10 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300'
        onClick={() => dashboardFileRef.current?.click()}
      >
        <div className='w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#2C3440] to-[#434C5E] rounded-2xl shadow-lg'>
          <LuUpload className='text-3xl text-white' />
        </div>

        <h3 className='font-semibold text-[#2C3440] dark:text-gray-100 text-lg'>Import PDF Resume</h3>
        <input
          type="file"
          ref={dashboardFileRef}
          onChange={handlePdfImportAndCreate}
          accept=".pdf"
          className="hidden"
        />
      </div>

      {allResumes === null ? (
        // Loading skeleton
        <>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-[350px] bg-white/60 dark:bg-[#1C2330]/60 backdrop-blur-md rounded-2xl border-2 border-[#CDBFA5]/20 dark:border-[#9C8D7F]/20 shadow-md animate-pulse'
            >
              <div className='h-[250px] bg-[#CDBFA5]/10 dark:bg-slate-800/40 rounded-t-2xl' />
              <div className='p-4 space-y-3'>
                <div className='h-4 bg-[#CDBFA5]/20 dark:bg-slate-700/40 rounded w-3/4' />
                <div className='h-3 bg-[#CDBFA5]/15 dark:bg-slate-700/30 rounded w-1/2' />
              </div>
            </div>
          ))}
        </>
      ) : (
        allResumes.map((resume) => (
          <ResumeSummaryCard
            key={resume?._id}
            imgUrl={resume?.thumbnailLink || null}
            title={resume.title}
            lastUpdated={
              resume?.updatedAt
                ? moment(resume.updatedAt).format("DD MMM YYYY") 
                : ""
            }
            onSelect={()=>navigate(`/resume/${resume?._id}`)}
          />
        ))
      )}
    </div>

    <Modal
      isOpen={openCreateModal}
      onClose={() => {
        setOpenCreateModal(false);
      }}
      hideHeader
    >
      <div>
        <CreateResumeForm />
      </div>
    </Modal>
  </DashboardLayout>
}

export default Dashboard;
