import React, { useEffect, useRef, useState } from "react";
import { formatYearMonth } from "../../utils/helper";
import {
  LuMapPinHouse,
  LuMail,
  LuPhone,
  LuUser,
  LuRss,
  LuGithub,
  LuLinkedin,
} from "react-icons/lu";

const DEFAULT_THEME = ["#F3F4F6", "#3B82F6", "#DBEAFE", "#2563EB", "#1F2937"];

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

const SectionTitle = ({ text, accentColor }) => {
  return (
    <div className="w-full border-b-2 border-slate-200 pb-1 mb-3 mt-4" style={{ borderColor: accentColor }}>
      <h3 className="text-xs font-black uppercase tracking-wider text-slate-800" style={{ color: accentColor }}>
        {text}
      </h3>
    </div>
  );
};

const TemplateCustom = ({ resumeData, colorPalette, fontSize, containerWidth, onSectionClick, layoutType = "single" }) => {
  const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;

  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const actualBaseWidth = resumeRef.current.offsetWidth;
    setBaseWidth(actualBaseWidth);
    setScale(containerWidth / baseWidth);
  }, [containerWidth]);

  // Sub-components for segments
  const HeaderBlock = () => (
    <div className="border-b border-slate-100 pb-4 mb-4">
      <ClickableSection sectionKey="profile-info" onSectionClick={onSectionClick}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold uppercase tracking-wide" style={{ color: themeColors[3] }}>
              {resumeData.profileInfo.fullName || "Your Name"}
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">
              {resumeData.profileInfo.designation}
            </p>
          </div>
          {resumeData.profileInfo.profilePreviewUrl && (
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
              <img src={resumeData.profileInfo.profilePreviewUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </ClickableSection>

      <ClickableSection sectionKey="contact-info" onSectionClick={onSectionClick}>
        <div className="mt-3 text-[10px] text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
          {resumeData.contactInfo.location && <span>📍 {resumeData.contactInfo.location}</span>}
          {resumeData.contactInfo.email && <span>✉️ {resumeData.contactInfo.email}</span>}
          {resumeData.contactInfo.phone && <span>📞 {resumeData.contactInfo.phone}</span>}
          {resumeData.contactInfo.linkedin && (
            <span>🔗 {resumeData.contactInfo.linkedin.replace("https://", "")}</span>
          )}
          {resumeData.contactInfo.github && (
            <span>💻 {resumeData.contactInfo.github.replace("https://", "")}</span>
          )}
        </div>
      </ClickableSection>
    </div>
  );

  const SummaryBlock = () => (
    resumeData.profileInfo.summary ? (
      <ClickableSection sectionKey="profile-info" onSectionClick={onSectionClick}>
        <div className="mb-4">
          <SectionTitle text="Summary" accentColor={themeColors[1]} />
          <p className="text-[11px] leading-relaxed text-slate-600">
            {resumeData.profileInfo.summary}
          </p>
        </div>
      </ClickableSection>
    ) : null
  );

  const EducationBlock = () => (
    resumeData.education.length > 0 ? (
      <ClickableSection sectionKey="education-info" onSectionClick={onSectionClick}>
        <div className="mb-4">
          <SectionTitle text="Education" accentColor={themeColors[1]} />
          <div className="flex flex-col gap-3">
            {resumeData.education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start text-[11px]">
                <div>
                  <span className="font-bold text-slate-800">{edu.institution}</span>
                  <span className="text-slate-500 italic block mt-0.5">{edu.degree}</span>
                </div>
                <span className="text-[9px] font-bold text-slate-400 font-sans whitespace-nowrap">
                  {formatYearMonth(edu.startDate)} – {formatYearMonth(edu.endDate)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ClickableSection>
    ) : null
  );

  const ExperienceBlock = () => (
    resumeData.workExperience.length > 0 ? (
      <ClickableSection sectionKey="work-experience" onSectionClick={onSectionClick}>
        <div className="mb-4">
          <SectionTitle text="Experience" accentColor={themeColors[1]} />
          <div className="flex flex-col gap-4">
            {resumeData.workExperience.map((exp, idx) => (
              <div key={idx} className="flex flex-col text-[11px]">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-800 text-[12px]">{exp.company}</h4>
                  <span className="text-[9px] font-bold text-slate-400 font-sans whitespace-nowrap">
                    {formatYearMonth(exp.startDate)} – {formatYearMonth(exp.endDate)}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold italic mt-0.5">{exp.role}</span>
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
    ) : null
  );

  const ProjectsBlock = () => (
    resumeData.projects.length > 0 ? (
      <ClickableSection sectionKey="projects" onSectionClick={onSectionClick}>
        <div className="mb-4">
          <SectionTitle text="Projects" accentColor={themeColors[1]} />
          <div className="flex flex-col gap-4">
            {resumeData.projects.map((proj, idx) => (
              <div key={idx} className="flex flex-col text-[11px]">
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
    ) : null
  );

  const SkillsBlock = () => (
    resumeData.skills.length > 0 ? (
      <ClickableSection sectionKey="skills" onSectionClick={onSectionClick}>
        <div className="mb-4">
          <SectionTitle text="Skills & Core Competencies" accentColor={themeColors[1]} />
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[9px] font-bold px-2.5 py-1 rounded-md text-slate-800 border border-slate-200"
                style={{ backgroundColor: themeColors[0], borderColor: themeColors[2] }}
              >
                {skill.name} ({skill.progress}%)
              </span>
            ))}
          </div>
        </div>
      </ClickableSection>
    ) : null
  );

  const CertificationsBlock = () => (
    resumeData.certifications.length > 0 ? (
      <ClickableSection sectionKey="certifications" onSectionClick={onSectionClick}>
        <div className="mb-4">
          <SectionTitle text="Certifications" accentColor={themeColors[1]} />
          <div className="grid grid-cols-2 gap-3 text-[10px]">
            {resumeData.certifications.map((cert, idx) => (
              <div key={idx} className="p-2 border border-slate-100 rounded-lg flex flex-col justify-between">
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
    ) : null
  );

  // Layout Renderings
  if (layoutType === "left") {
    // Sidebar on Left
    return (
      <div
        ref={resumeRef}
        className={`bg-white grid grid-cols-12 resume-font-${fontSize || "medium"}`}
        style={{
          transform: containerWidth > 0 ? `scale(${scale})` : "none",
          transformOrigin: "top left",
          width: containerWidth > 0 ? `${baseWidth}px` : "auto",
          minHeight: "297mm",
          color: themeColors[4],
        }}
      >
        <div className="col-span-4 p-5 bg-slate-50 border-r border-slate-100 flex flex-col gap-4" style={{ backgroundColor: themeColors[0] }}>
          <HeaderBlock />
          <SkillsBlock />
          <EducationBlock />
        </div>
        <div className="col-span-8 p-5 flex flex-col gap-4">
          <SummaryBlock />
          <ExperienceBlock />
          <ProjectsBlock />
          <CertificationsBlock />
        </div>
      </div>
    );
  }

  if (layoutType === "right") {
    // Sidebar on Right
    return (
      <div
        ref={resumeRef}
        className={`bg-white grid grid-cols-12 resume-font-${fontSize || "medium"}`}
        style={{
          transform: containerWidth > 0 ? `scale(${scale})` : "none",
          transformOrigin: "top left",
          width: containerWidth > 0 ? `${baseWidth}px` : "auto",
          minHeight: "297mm",
          color: themeColors[4],
        }}
      >
        <div className="col-span-8 p-5 flex flex-col gap-4">
          <HeaderBlock />
          <SummaryBlock />
          <ExperienceBlock />
          <ProjectsBlock />
          <CertificationsBlock />
        </div>
        <div className="col-span-4 p-5 bg-slate-50 border-l border-slate-100 flex flex-col gap-4" style={{ backgroundColor: themeColors[0] }}>
          <SkillsBlock />
          <EducationBlock />
        </div>
      </div>
    );
  }

  // Single Column default layout
  return (
    <div
      ref={resumeRef}
      className={`p-8 bg-white flex flex-col gap-4 resume-font-${fontSize || "medium"}`}
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto",
        minHeight: "297mm",
        color: themeColors[4],
      }}
    >
      <HeaderBlock />
      <SummaryBlock />
      <ExperienceBlock />
      <ProjectsBlock />
      <EducationBlock />
      <SkillsBlock />
      <CertificationsBlock />
    </div>
  );
};

export default TemplateCustom;
