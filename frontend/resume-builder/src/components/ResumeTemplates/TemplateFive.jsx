import React, { useEffect, useRef, useState } from "react";
import {
  LuMapPinHouse,
  LuMail,
  LuPhone,
  LuUser,
  LuRss,
  LuGithub,
  LuLinkedin,
} from "react-icons/lu";
import { formatYearMonth } from "../../utils/helper";

const DEFAULT_THEME = ["#F3F4F6", "#3B82F6", "#DBEAFE", "#2563EB", "#1F2937"];

const ClickableSection = ({ children, sectionKey, onSectionClick }) => {
  if (!onSectionClick) return children;
  return (
    <div
      onClick={() => onSectionClick(sectionKey)}
      className="group relative cursor-pointer rounded-lg transition-all duration-300 hover:bg-[#2C3440]/5 hover:ring-2 hover:ring-[#9C8D7F]/40 p-1.5 -m-1.5 animate-pulse-subtle"
    >
      <span className="absolute -top-2.5 -right-1 hidden group-hover:flex items-center gap-1 bg-[#2C3440] text-white text-[9px] px-1.5 py-0.5 rounded shadow-md z-10 font-sans font-medium uppercase tracking-wider scale-90">
        Edit
      </span>
      {children}
    </div>
  );
};

const SectionHeading = ({ title, accentColor }) => {
  return (
    <div className="border-b-[1.5px] border-slate-200 pb-1 mb-3 mt-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800" style={{ color: accentColor }}>
        {title}
      </h3>
    </div>
  );
};

const TemplateFive = ({ resumeData, colorPalette, fontSize, containerWidth, onSectionClick }) => {
  const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;

  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const actualBaseWidth = resumeRef.current.offsetWidth;
    setBaseWidth(actualBaseWidth);
    setScale(containerWidth / baseWidth);
  }, [containerWidth]);

  return (
    <div
      ref={resumeRef}
      className={`bg-white font-sans text-slate-800 grid grid-cols-12 resume-font-${fontSize || "medium"}`}
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto",
        minHeight: "297mm",
        color: themeColors[4],
      }}
    >
      {/* Sidebar (Left Column) - 4 cols */}
      <div className="col-span-4 p-6 bg-slate-50 flex flex-col gap-5 border-r border-slate-100" style={{ backgroundColor: themeColors[0] }}>
        {/* Profile Image */}
        <ClickableSection sectionKey="profile-info" onSectionClick={onSectionClick}>
          <div className="flex flex-col items-center text-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden bg-white mb-3"
            >
              {resumeData.profileInfo.profilePreviewUrl ? (
                <img
                  src={resumeData.profileInfo.profilePreviewUrl}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              ) : (
                <LuUser className="text-4xl text-slate-300" />
              )}
            </div>
            <h2 className="text-md font-bold text-slate-800 leading-tight">
              {resumeData.profileInfo.fullName || "Your Name"}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {resumeData.profileInfo.designation}
            </p>
          </div>
        </ClickableSection>

        {/* Contact Info */}
        <ClickableSection sectionKey="contact-info" onSectionClick={onSectionClick}>
          <div className="flex flex-col gap-3 text-[10px] text-slate-600 mt-2">
            {resumeData.contactInfo.email && (
              <div className="flex items-center gap-2">
                <LuMail className="text-slate-400 text-[12px]" />
                <span className="truncate">{resumeData.contactInfo.email}</span>
              </div>
            )}
            {resumeData.contactInfo.phone && (
              <div className="flex items-center gap-2">
                <LuPhone className="text-slate-400 text-[12px]" />
                <span>{resumeData.contactInfo.phone}</span>
              </div>
            )}
            {resumeData.contactInfo.location && (
              <div className="flex items-center gap-2">
                <LuMapPinHouse className="text-slate-400 text-[12px]" />
                <span>{resumeData.contactInfo.location}</span>
              </div>
            )}
            {resumeData.contactInfo.linkedin && (
              <div className="flex items-center gap-2">
                <LuLinkedin className="text-slate-400 text-[12px]" />
                <span className="truncate">{resumeData.contactInfo.linkedin.replace("https://", "")}</span>
              </div>
            )}
            {resumeData.contactInfo.github && (
              <div className="flex items-center gap-2">
                <LuGithub className="text-slate-400 text-[12px]" />
                <span className="truncate">{resumeData.contactInfo.github.replace("https://", "")}</span>
              </div>
            )}
            {resumeData.contactInfo.website && (
              <div className="flex items-center gap-2">
                <LuRss className="text-slate-400 text-[12px]" />
                <span className="truncate">{resumeData.contactInfo.website}</span>
              </div>
            )}
          </div>
        </ClickableSection>

        {/* Education */}
        {resumeData.education.length > 0 && (
          <div>
            <ClickableSection sectionKey="education-info" onSectionClick={onSectionClick}>
              <div>
                <SectionHeading title="Education" accentColor={themeColors[3]} />
                <div className="flex flex-col gap-3">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="flex flex-col text-[10px]">
                      <span className="font-bold text-slate-800">{edu.institution}</span>
                      <span className="text-slate-600 italic mt-0.5">{edu.degree}</span>
                      <span className="text-slate-400 font-sans mt-0.5">
                        {formatYearMonth(edu.startDate)} – {formatYearMonth(edu.endDate)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ClickableSection>
          </div>
        )}

        {/* Skills with Progress Bars */}
        {resumeData.skills.length > 0 && (
          <div>
            <ClickableSection sectionKey="skills" onSectionClick={onSectionClick}>
              <div>
                <SectionHeading title="Skills" accentColor={themeColors[3]} />
                <div className="flex flex-col gap-2.5">
                  {resumeData.skills.map((skill, index) => (
                    <div key={index} className="flex flex-col text-[10px]">
                      <div className="flex justify-between font-semibold text-slate-700">
                        <span>{skill.name}</span>
                        <span>{skill.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${skill.progress}%`,
                            backgroundColor: themeColors[3] || "#3B82F6",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ClickableSection>
          </div>
        )}
      </div>

      {/* Main Content Area (Right Column) - 8 cols */}
      <div className="col-span-8 p-6 flex flex-col gap-5">
        {/* Professional Summary */}
        {resumeData.profileInfo.summary && (
          <ClickableSection sectionKey="profile-info" onSectionClick={onSectionClick}>
            <div>
              <SectionHeading title="Professional Profile" accentColor={themeColors[3]} />
              <p className="text-[11px] leading-relaxed text-slate-600">
                {resumeData.profileInfo.summary}
              </p>
            </div>
          </ClickableSection>
        )}

        {/* Work Experience */}
        {resumeData.workExperience.length > 0 && (
          <ClickableSection sectionKey="work-experience" onSectionClick={onSectionClick}>
            <div>
              <SectionHeading title="Work Experience" accentColor={themeColors[3]} />
              <div className="flex flex-col gap-4">
                {resumeData.workExperience.map((exp, index) => (
                  <div key={index} className="flex flex-col text-[11px]">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-800 text-[12px]">{exp.company}</h4>
                      <span className="text-[9px] font-semibold text-slate-400 font-sans">
                        {formatYearMonth(exp.startDate)} – {formatYearMonth(exp.endDate)}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium italic mt-0.5">{exp.role}</span>
                    {exp.description && (
                      <p className="text-slate-600 leading-relaxed mt-1.5 pl-3 border-l-2 border-slate-100">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ClickableSection>
        )}

        {/* Projects */}
        {resumeData.projects.length > 0 && (
          <ClickableSection sectionKey="projects" onSectionClick={onSectionClick}>
            <div>
              <SectionHeading title="Key Projects" accentColor={themeColors[3]} />
              <div className="flex flex-col gap-4">
                {resumeData.projects.map((proj, index) => (
                  <div key={index} className="flex flex-col text-[11px]">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-800">{proj.title}</h4>
                      <div className="flex gap-2 text-[9px] text-slate-400 font-sans">
                        {proj.github && <a href={proj.github} className="hover:underline">GitHub</a>}
                        {proj.liveDemo && <a href={proj.liveDemo} className="hover:underline">Demo</a>}
                      </div>
                    </div>
                    {proj.description && (
                      <p className="text-slate-600 leading-relaxed mt-1">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ClickableSection>
        )}

        {/* Certifications */}
        {resumeData.certifications.length > 0 && (
          <ClickableSection sectionKey="certifications" onSectionClick={onSectionClick}>
            <div>
              <SectionHeading title="Certifications" accentColor={themeColors[3]} />
              <div className="grid grid-cols-2 gap-3 text-[10px]">
                {resumeData.certifications.map((cert, index) => (
                  <div key={index} className="p-2 border border-slate-100 rounded-lg flex flex-col justify-between">
                    <span className="font-semibold text-slate-800 leading-tight">{cert.title}</span>
                    <div className="flex justify-between text-slate-400 mt-1">
                      <span>{cert.issuer}</span>
                      <span>{cert.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ClickableSection>
        )}
      </div>
    </div>
  );
};

export default TemplateFive;
