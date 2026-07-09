import React, { useEffect, useRef, useState } from "react";
import { formatYearMonth } from "../../utils/helper";

const DEFAULT_THEME = ["#000000", "#333333", "#E5E7EB", "#4B5563", "#111827"];

const SectionTitle = ({ text }) => {
  return (
    <div className="w-full border-b-[1.5px] border-slate-800 pb-0.5 mb-3 mt-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-sans">
        {text}
      </h2>
    </div>
  );
};

const ClickableSection = ({ children, sectionKey, onSectionClick }) => {
  if (!onSectionClick) return children;
  return (
    <div
      onClick={() => onSectionClick(sectionKey)}
      className="group relative cursor-pointer rounded-lg transition-all duration-300 hover:bg-[#2C3440]/5 hover:ring-2 hover:ring-[#9C8D7F]/40 p-1.5 -m-1.5"
    >
      <span className="absolute -top-2.5 -right-1 hidden group-hover:flex items-center gap-1 bg-[#2C3440] text-white text-[9px] px-1.5 py-0.5 rounded shadow-md z-10 font-sans font-medium uppercase tracking-wider scale-90">
        Edit
      </span>
      {children}
    </div>
  );
};

const TemplateFour = ({ resumeData, colorPalette, fontSize, containerWidth, onSectionClick }) => {
  const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;

  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800); // Default value
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // Calculate the scale factor based on the container width
    const actualBaseWidth = resumeRef.current.offsetWidth;
    setBaseWidth(actualBaseWidth); // Get the actual base width
    setScale(containerWidth / baseWidth);
  }, [containerWidth]);

  // Helper to format contacts list
  const contactItems = [
    resumeData.contactInfo.location,
    resumeData.contactInfo.email,
    resumeData.contactInfo.phone,
    resumeData.contactInfo.linkedin,
    resumeData.contactInfo.github,
    resumeData.contactInfo.website,
  ].filter(Boolean);

  return (
    <div
      ref={resumeRef}
      className={`p-8 bg-white font-serif text-slate-900 resume-font-${fontSize || "medium"}`}
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto",
        minHeight: "297mm",
        color: themeColors[4],
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center pb-4">
        <ClickableSection sectionKey="profile-info" onSectionClick={onSectionClick}>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tight" style={{ color: themeColors[0] }}>
              {resumeData.profileInfo.fullName}
            </h1>
            <p className="text-xs font-semibold tracking-wide text-slate-600 uppercase mt-0.5">
              {resumeData.profileInfo.designation}
            </p>
          </div>
        </ClickableSection>

        <div className="mt-2 text-[10px] text-slate-600 flex flex-wrap justify-center gap-x-2 gap-y-1 w-full max-w-2xl">
          <ClickableSection sectionKey="contact-info" onSectionClick={onSectionClick}>
            <div className="flex flex-wrap justify-center gap-x-2.5">
              {contactItems.map((item, index) => (
                <span key={index} className="whitespace-nowrap">
                  {item}
                  {index < contactItems.length - 1 && <span className="ml-2.5 text-slate-400">•</span>}
                </span>
              ))}
            </div>
          </ClickableSection>
        </div>
      </div>

      {/* Professional Summary */}
      {resumeData.profileInfo.summary && (
        <div className="mb-4 text-left">
          <ClickableSection sectionKey="profile-info" onSectionClick={onSectionClick}>
            <div>
              <SectionTitle text="Professional Summary" />
              <p className="text-[11px] leading-relaxed text-slate-700">
                {resumeData.profileInfo.summary}
              </p>
            </div>
          </ClickableSection>
        </div>
      )}

      {/* Work Experience */}
      {resumeData.workExperience.length > 0 && (
        <div className="mb-4">
          <ClickableSection sectionKey="work-experience" onSectionClick={onSectionClick}>
            <div>
              <SectionTitle text="Professional Experience" />
              <div className="flex flex-col gap-4">
                {resumeData.workExperience.map((exp, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex justify-between items-start">
                      <h4 className="text-[11px] font-bold text-slate-800">
                        {exp.company}
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {formatYearMonth(exp.startDate)} – {formatYearMonth(exp.endDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-0.5">
                      <span className="text-[10px] italic text-slate-600 font-sans">
                        {exp.role}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-[10px] mt-1.5 leading-relaxed text-slate-600 pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-slate-400">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ClickableSection>
        </div>
      )}

      {/* Projects */}
      {resumeData.projects.length > 0 && (
        <div className="mb-4">
          <ClickableSection sectionKey="projects" onSectionClick={onSectionClick}>
            <div>
              <SectionTitle text="Key Projects" />
              <div className="flex flex-col gap-4">
                {resumeData.projects.map((proj, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex justify-between items-start">
                      <h4 className="text-[11px] font-bold text-slate-800">
                        {proj.title}
                      </h4>
                      <div className="flex gap-2.5 text-[9px] font-semibold text-slate-500 font-sans">
                        {proj.github && (
                          <a href={proj.github} className="hover:underline">
                            GitHub
                          </a>
                        )}
                        {proj.liveDemo && (
                          <a href={proj.liveDemo} className="hover:underline">
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className="text-[10px] mt-1 leading-relaxed text-slate-600 pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-slate-400">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ClickableSection>
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div className="mb-4">
          <ClickableSection sectionKey="education-info" onSectionClick={onSectionClick}>
            <div>
              <SectionTitle text="Education" />
              <div className="flex flex-col gap-3">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-800">
                        {edu.institution}
                      </h4>
                      <span className="text-[10px] italic text-slate-600 font-sans block mt-0.5">
                        {edu.degree}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {formatYearMonth(edu.startDate)} – {formatYearMonth(edu.endDate)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ClickableSection>
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div className="mb-4">
          <ClickableSection sectionKey="skills" onSectionClick={onSectionClick}>
            <div>
              <SectionTitle text="Skills & Competencies" />
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-slate-700">
                {resumeData.skills.map((skill, index) => (
                  <span key={index}>
                    <span className="font-semibold text-slate-800">{skill.name}</span>
                    <span className="text-slate-400 font-sans text-[8px] ml-1">({skill.progress}%)</span>
                  </span>
                ))}
              </div>
            </div>
          </ClickableSection>
        </div>
      )}

      {/* Certifications */}
      {resumeData.certifications.length > 0 && (
        <div className="mb-4">
          <ClickableSection sectionKey="certifications" onSectionClick={onSectionClick}>
            <div>
              <SectionTitle text="Certifications" />
              <div className="grid grid-cols-2 gap-x-5 gap-y-1 text-[10px] text-slate-700">
                {resumeData.certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>
                      <span className="font-semibold text-slate-800">{cert.title}</span> – <span className="italic text-slate-600 font-sans">{cert.issuer}</span>
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400">{cert.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </ClickableSection>
        </div>
      )}

      {/* Languages & Interests */}
      <div className="grid grid-cols-2 gap-10 mt-4">
        {resumeData.languages.length > 0 && (
          <div>
            <ClickableSection sectionKey="additionalInfo" onSectionClick={onSectionClick}>
              <div>
                <SectionTitle text="Languages" />
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-700">
                  {resumeData.languages.map((lang, index) => (
                    <span key={index}>
                      <span className="font-semibold text-slate-800">{lang.name}</span>
                      <span className="text-slate-400 font-sans text-[8px] ml-1">({lang.progress}%)</span>
                    </span>
                  ))}
                </div>
              </div>
            </ClickableSection>
          </div>
        )}

        {resumeData.interests.length > 0 && (
          <div>
            <ClickableSection sectionKey="additionalInfo" onSectionClick={onSectionClick}>
              <div>
                <SectionTitle text="Interests" />
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-700">
                  {resumeData.interests.map((interest, index) => (
                    <span key={index} className="px-2.5 py-0.5 rounded bg-slate-100 text-[9px] font-medium text-slate-600 font-sans">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </ClickableSection>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateFour;
