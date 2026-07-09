import React, { useEffect, useRef, useState } from "react";
import {
  LuMapPinHouse,
  LuMail,
  LuPhone,
  LuRss,
  LuGithub,
  LuUser,
} from "react-icons/lu";
import { RiLinkedinLine } from "react-icons/ri";
import ContactInfo from "../ResumeSections/ContactInfo";
import EducationInfo from "../ResumeSections/EducationInfo";
import { formatYearMonth } from "../../utils/helper";
import LanguageSection from "../ResumeSections/LanguageSection";
import WorkExperience from "../ResumeSections/WorkExperience";
import ProjectInfo from "../ResumeSections/ProjectInfo";
import SkillSection from "../ResumeSections/SkillSection";
import CertificationInfo from "../ResumeSections/CertificationInfo";

const DEFAULT_THEME = ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#00B8DB", "#4A5565"];

const Title = ({ text, color }) => {
  return (
    <div className="relative w-fit mb-2.5">
      <span
        className="absolute bottom-0 left-0 w-full h-2"
        style={{ backgroundColor: color }}
      ></span>
      <h2 className={`relative text-sm font-bold`}>{text}</h2>
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

const TemplateTwo = ({ resumeData, colorPalette, fontSize, containerWidth, onSectionClick }) => {
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

  return (
    <div
      ref={resumeRef}
      className={`p-3 bg-white resume-font-${fontSize || "medium"}`}
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto",
        minHeight: "297mm",
      }}
    >
      <div className="px-10 pt-10 pb-5">
        <div className="flex items-start gap-5 mb-5">
          <ClickableSection sectionKey="profile-info" onSectionClick={onSectionClick}>
            <div className="flex gap-5 items-start">
              <div
                className="w-[140px] h-[140px] max-w-[140px] max-h-[140px] rounded-2xl flex items-center justify-center"
                style={{backgroundColor: themeColors[1] }}
              >
                {resumeData.profileInfo.profilePreviewUrl ? (
                  <img
                    src={resumeData.profileInfo.profilePreviewUrl}
                    className="w-[140px] h-[140px] rounded-2xl"
                    alt="Profile"
                  />
                ) : (
                  <div
                    className="w-[110px] h-[110px] flex items-center justify-center text-6xl rounded-full"
                    style={{ color: themeColors[4] }}
                  >
                    <LuUser />
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#2C3440]">
                  {resumeData.profileInfo.fullName}
                </h2>
                <p className="text-sm font-semibold text-[#434C5E] mt-0.5">
                  {resumeData.profileInfo.designation}
                </p>
              </div>
            </div>
          </ClickableSection>
        </div>

        <div className="border-t-2 border-b-2 border-gray-200/50 py-4 mb-5">
          <ClickableSection sectionKey="contact-info" onSectionClick={onSectionClick}>
            <div className="grid grid-cols-12 gap-y-3 gap-x-5">
              <div className="col-span-6">
                <ContactInfo
                  icon={<LuMapPinHouse />}
                  iconBG={themeColors[2]}
                  value={resumeData.contactInfo.location}
                />
              </div>

              <div className="col-span-6">
                <ContactInfo
                  icon={<LuMail />}
                  iconBG={themeColors[2]}
                  value={resumeData.contactInfo.email}
                />
              </div>

              <div className="col-span-6">
                <ContactInfo
                  icon={<LuPhone />}
                  iconBG={themeColors[2]}
                  value={resumeData.contactInfo.phone}
                />
              </div>

              {resumeData.contactInfo.linkedin && (
                <div className="col-span-6">
                  <ContactInfo
                    icon={<RiLinkedinLine />}
                    iconBG={themeColors[2]}
                    value={resumeData.contactInfo.linkedin}
                  />
                </div>
              )}

              {resumeData.contactInfo.github && (
                <div className="col-span-6">
                  <ContactInfo
                    icon={<LuGithub />}
                    iconBG={themeColors[2]}
                    value={resumeData.contactInfo.github}
                  />
                </div>
              )}

              <div className="col-span-6">
                <ContactInfo
                  icon={<LuRss />}
                  iconBG={themeColors[2]}
                  value={resumeData.contactInfo.website}
                />
              </div>
            </div>
          </ClickableSection>
        </div>
      </div>

      <div className="mx-10 pb-5">
        {resumeData.profileInfo.summary && (
          <ClickableSection sectionKey="profile-info" onSectionClick={onSectionClick}>
            <div>
              <Title text="Professional Summary" color={themeColors[1]} />
              <p className="text-sm font-medium">
                {resumeData.profileInfo.summary}
              </p>
            </div>
          </ClickableSection>
        )}

        {resumeData.workExperience.length > 0 && (
          <div className="mt-4">
            <ClickableSection sectionKey="work-experience" onSectionClick={onSectionClick}>
              <Title text="Work Experience" color={themeColors[1]} />
              {resumeData.workExperience.map((data, index) => (
                <WorkExperience
                  key={`work_${index}`}
                  company={data.company}
                  role={data.role}
                  duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
                  durationColor={themeColors[4]}
                  description={data.description}
                />
              ))}
            </ClickableSection>
          </div>
        )}

        {resumeData.projects.length > 0 && (
          <div className="mt-4">
            <ClickableSection sectionKey="projects" onSectionClick={onSectionClick}>
              <Title text="Projects" color={themeColors[1]} />
              {resumeData.projects.map((project, index) => (
                <ProjectInfo
                  key={`project_${index}`}
                  title={project.title}
                  description={project.description}
                  githubLink={project.github}
                  liveDemoUrl={project.liveDemo}
                  bgColor={themeColors[2]}
                />
              ))}
            </ClickableSection>
          </div>
        )}

        {resumeData.education.length > 0 && (
          <div className="mt-5">
            <ClickableSection sectionKey="education-info" onSectionClick={onSectionClick}>
              <Title text="Education" color={themeColors[1]} />
              <div className="grid grid-cols-2 gap-3">
                {resumeData.education.map((data, index) => (
                  <EducationInfo
                    key={`education_${index}`}
                    degree={data.degree}
                    institution={data.institution}
                    duration={`${formatYearMonth(data.startDate)}-${formatYearMonth(data.endDate)}`}
                  />
                ))}
              </div>
            </ClickableSection>
          </div>
        )}

        {resumeData.certifications.length > 0 && (
          <div className="mt-4">
            <ClickableSection sectionKey="certifications" onSectionClick={onSectionClick}>
              <Title text="Certifications" color={themeColors[1]} />
              <div className="grid grid-cols-1 gap-6">
                {resumeData.certifications.map((data, index) => (
                  <CertificationInfo
                    key={`cert_${index}`}
                    title={data.title}
                    issuer={data.issuer}
                    year={data.year}
                    bgColor={themeColors[2]}
                  />
                ))}
              </div>
            </ClickableSection>
          </div>
        )}

        {resumeData.skills.length > 0 && (
          <div className="mt-4">
            <ClickableSection sectionKey="skills" onSectionClick={onSectionClick}>
              <Title text="Skills" color={themeColors[1]} />
              <SkillSection
                skills={resumeData.skills}
                accentColor={themeColors[3]}
                bgColor={themeColors[2]}
              />
            </ClickableSection>
          </div>
        )}

        <div className="grid grid-cols-2 gap-10 mt-4">
          {resumeData.languages.length > 0 && (
            <div className="">
              <ClickableSection sectionKey="additionalInfo" onSectionClick={onSectionClick}>
                <Title text="Languages" color={themeColors[1]} />
                <LanguageSection
                  languages={resumeData.languages}
                  accentColor={themeColors[3]}
                  bgColor={themeColors[2]}
                />
              </ClickableSection>
            </div>
          )}

          {resumeData.interests.length > 0 && resumeData.interests[0] !== "" && (
            <div className="">
              <ClickableSection sectionKey="additionalInfo" onSectionClick={onSectionClick}>
                <Title text="Interests" color={themeColors[1]} />

                <div className="flex items-center flex-wrap gap-3 mt-4">
                  {resumeData.interests.map((interest, index) => {
                    if (!interest) return null;
                    return (
                      <div
                        key={`interest_${index}`}
                        className="text-[10px] font-medium py-1 px-3 rounded-lg"
                        style={{ backgroundColor: themeColors[2] }}
                      >
                        {interest}
                      </div>
                    );
                  })}
                </div>
              </ClickableSection>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateTwo;
