import React from "react";
import TemplateOne from "./TemplateOne";
import TemplateTwo from "./TemplateTwo";
import TemplateThree from "./TemplateThree";
import TemplateFour from "./TemplateFour";
import TemplateFive from "./TemplateFive";
import TemplateSix from "./TemplateSix";
import TemplateCustom from "./TemplateCustom";

const cleanResumeData = (data) => {
  if (!data) return data;
  return {
    ...data,
    workExperience: (data.workExperience || []).filter(
      (item) => (item.company || "").trim() || (item.role || "").trim() || item.startDate || item.endDate || (item.description || "").trim()
    ),
    education: (data.education || []).filter(
      (item) => (item.degree || "").trim() || (item.institution || "").trim() || item.startDate || item.endDate
    ),
    skills: (data.skills || []).filter((item) => (item.name || "").trim()),
    projects: (data.projects || []).filter(
      (item) => (item.title || "").trim() || (item.description || "").trim() || (item.github || "").trim() || (item.liveDemo || "").trim()
    ),
    certifications: (data.certifications || []).filter(
      (item) => (item.title || "").trim() || (item.issuer || "").trim() || (item.year || "").trim()
    ),
    languages: (data.languages || []).filter((item) => (item.name || "").trim()),
    interests: (data.interests || []).filter((item) => typeof item === "string" && item.trim() !== ""),
  };
};

const RenderResume = ({
  templateId,
  resumeData,
  colorPalette,
  fontSize,
  containerWidth,
  onSectionClick,
}) => {
  const cleanedResumeData = cleanResumeData(resumeData);

  switch (templateId) {
    case "01":
      return (
        <TemplateOne
          resumeData={cleanedResumeData}
          colorPalette={colorPalette}
          fontSize={fontSize}
          containerWidth={containerWidth}
          onSectionClick={onSectionClick}
        />
      );
    case "02":
      return (
        <TemplateTwo
          resumeData={cleanedResumeData}
          colorPalette={colorPalette}
          fontSize={fontSize}
          containerWidth={containerWidth}
          onSectionClick={onSectionClick}
        />
      );
    case "03":
      return (
        <TemplateThree
          resumeData={cleanedResumeData}
          colorPalette={colorPalette}
          fontSize={fontSize}
          containerWidth={containerWidth}
          onSectionClick={onSectionClick}
        />
      );
    case "04":
      return (
        <TemplateFour
          resumeData={cleanedResumeData}
          colorPalette={colorPalette}
          fontSize={fontSize}
          containerWidth={containerWidth}
          onSectionClick={onSectionClick}
        />
      );
    case "05":
      return (
        <TemplateFive
          resumeData={cleanedResumeData}
          colorPalette={colorPalette}
          fontSize={fontSize}
          containerWidth={containerWidth}
          onSectionClick={onSectionClick}
        />
      );
    case "06":
      return (
        <TemplateSix
          resumeData={cleanedResumeData}
          colorPalette={colorPalette}
          fontSize={fontSize}
          containerWidth={containerWidth}
          onSectionClick={onSectionClick}
        />
      );
    case "00":
    case "00-single":
      return (
        <TemplateCustom
          resumeData={cleanedResumeData}
          colorPalette={colorPalette}
          fontSize={fontSize}
          containerWidth={containerWidth}
          onSectionClick={onSectionClick}
          layoutType="single"
        />
      );
    case "00-left":
      return (
        <TemplateCustom
          resumeData={cleanedResumeData}
          colorPalette={colorPalette}
          fontSize={fontSize}
          containerWidth={containerWidth}
          onSectionClick={onSectionClick}
          layoutType="left"
        />
      );
    case "00-right":
      return (
        <TemplateCustom
          resumeData={cleanedResumeData}
          colorPalette={colorPalette}
          fontSize={fontSize}
          containerWidth={containerWidth}
          onSectionClick={onSectionClick}
          layoutType="right"
        />
      );
    default:
      return (
        <TemplateOne
          resumeData={cleanedResumeData}
          colorPalette={colorPalette}
          fontSize={fontSize}
          containerWidth={containerWidth}
          onSectionClick={onSectionClick}
        />
      );
  }
};

export default RenderResume;
