import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { resumeTemplates } from '../../utils/data';

const CreateResumeForm = () => {
  const [title, setTitle] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("01");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  //Handle Create Resume
  const handleCreateResume = async (e) => {
    e.preventDefault();

    if (!title || !title.trim()) {
      setError("Please enter a resume title");
      return;
    }

    setError("");

    //Create Resume API Call
    try {
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title,
        template: { theme: selectedTemplateId, colorPalette: [] },
      });

      if (response.data?._id) {
        navigate(`/resume/${response.data._id}`);
      }
    } catch (error) {
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to create resume. Please try again.");
      }
    }
  };

  return (
    <div className='w-[95vw] md:w-[70vh] p-7 flex flex-col justify-center bg-white dark:bg-[#1C2330] rounded-2xl transition-colors'>
      <h3 className='text-lg font-semibold text-[#2C3440] dark:text-gray-100'>Create New Resume</h3>
      <p className='text-xs text-slate-500 mt-[5px] mb-6'>
        Enter a title and select a template style from the library to begin.
      </p>

      <form onSubmit={handleCreateResume} className="space-y-5">
        <Input
          value={title}
          onChange={({target}) => setTitle(target.value)}
          label="Resume Title"
          placeholder="Eg: Harshit's Resume"
          type="text"
        />

        <div>
          <label className="text-xs font-semibold text-[#2C3440] dark:text-slate-200 block mb-2.5">
            Select Style Template
          </label>
          <div className="grid grid-cols-4 gap-3">
            {resumeTemplates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplateId(tpl.id)}
                className={`border-2 rounded-xl p-1 cursor-pointer transition-all duration-300 ${
                  selectedTemplateId === tpl.id
                    ? "border-[#2C3440] dark:border-[#CDBFA5] bg-[#CDBFA5]/5 scale-105 shadow-md"
                    : "border-slate-100 dark:border-slate-800 hover:border-[#9C8D7F]"
                }`}
              >
                <img
                  src={tpl.thumbnailImg}
                  alt={`Template ${tpl.id}`}
                  className="h-16 w-full object-cover rounded-lg"
                />
                <span className="text-[9px] font-bold text-center block mt-1.5 text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  {tpl.id === "00" && "Customize Yourself"}
                  {tpl.id === "01" && "Technical Exec"}
                  {tpl.id === "02" && "Sleek Minimal"}
                  {tpl.id === "03" && "Contemporary"}
                  {tpl.id === "04" && "Traditional Corp"}
                  {tpl.id === "05" && "Exec Innovative"}
                  {tpl.id === "06" && "Classic Academic"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

        <button type='submit' className='btn-primary w-full py-3'>
          Create Resume
        </button>
      </form>
    </div>
  );
};

export default CreateResumeForm;
