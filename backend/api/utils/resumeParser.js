/**
 * Parses raw text extracted from a resume PDF/TXT file and structures it into the resume JSON schema format.
 */
const parseRawTextToResume = (text) => {
  if (!text) return null;

  const result = {
    profileInfo: {
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
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    interests: [],
  };

  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return result;

  // 1. Parse Name (usually the first line or second line of text)
  if (lines[0] && lines[0].length < 50) {
    result.profileInfo.fullName = lines[0];
  } else if (lines[1] && lines[1].length < 50) {
    result.profileInfo.fullName = lines[1];
  }

  // 2. Parse Contact details from first 15 lines
  const contactText = lines.slice(0, 15).join(" ");

  // Email
  const emailMatch = contactText.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) result.contactInfo.email = emailMatch[0];

  // Phone
  const phoneMatch = contactText.match(/(\+?\d[\d\s-]{8,14}\d)/);
  if (phoneMatch) result.contactInfo.phone = phoneMatch[0];

  // LinkedIn
  const liMatch = contactText.match(/linkedin\.com\/in\/[\w-]+/i);
  if (liMatch) result.contactInfo.linkedin = "https://" + liMatch[0];

  // GitHub
  const ghMatch = contactText.match(/github\.com\/[\w-]+/i);
  if (ghMatch) result.contactInfo.github = "https://" + ghMatch[0];

  // Location search in top lines
  const locationKeywords = ["Agra", "Delhi", "Mumbai", "Bangalore", "Sonepat", "Sonipat", "Haryana", "India", "USA", "UK"];
  for (let line of lines.slice(0, 12)) {
    const cleanLine = line.replace(/[^a-zA-Z\s,]/g, "").trim();
    for (let word of locationKeywords) {
      if (cleanLine.includes(word) && cleanLine.length < 60) {
        result.contactInfo.location = cleanLine;
        break;
      }
    }
    if (result.contactInfo.location) break;
  }

  // 3. Segment into Sections
  let currentSection = "";
  let sectionLines = {};

  const SECTION_KEYWORDS = {
    summary: ["summary", "professional summary", "objective", "about me", "profile"],
    experience: ["experience", "work experience", "professional experience", "employment", "history"],
    education: ["education", "academic", "academic details", "qualifications", "schooling"],
    skills: ["skills", "technical skills", "competencies", "technologies", "skillset"],
    projects: ["projects", "key projects", "personal projects", "academic projects", "coursework projects"],
    certifications: ["certifications", "licenses", "courses", "certificates"],
  };

  lines.forEach((line) => {
    const lowerLine = line.toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();
    let foundSection = false;

    for (let sec in SECTION_KEYWORDS) {
      const matched = SECTION_KEYWORDS[sec].some(keyword => {
        return lowerLine === keyword || 
               (lowerLine.includes(keyword) && lowerLine.length < keyword.length + 15);
      });

      if (matched) {
        currentSection = sec;
        if (!sectionLines[sec]) sectionLines[sec] = [];
        foundSection = true;
        break;
      }
    }

    if (!foundSection && currentSection) {
      sectionLines[currentSection].push(line);
    }
  });

  // Helper: extract dates
  const extractDates = (str) => {
    const dateRegex = /((?:[A-Za-z]+\s+\d{4})|(?:\d{4}))\s*(?:--|–|-|to)\s*((?:[A-Za-z]+\s+\d{4})|(?:\d{4})|Present|Current)/i;
    const match = str.match(dateRegex);
    return match ? { start: match[1].trim(), end: match[2].trim() } : null;
  };

  // --- 4. Process Sections ---
  // Summary
  if (sectionLines.summary && sectionLines.summary.length > 0) {
    result.profileInfo.summary = sectionLines.summary.slice(0, 5).join(" ");
  }

  // Education
  if (sectionLines.education) {
    let currentEdu = null;
    sectionLines.education.forEach(line => {
      const dates = extractDates(line);
      const isDegree = line.toLowerCase().includes("btech") || line.toLowerCase().includes("b.tech") || line.toLowerCase().includes("bachelor") || line.toLowerCase().includes("degree") || line.toLowerCase().includes("school") || line.toLowerCase().includes("secondary") || line.toLowerCase().includes("class");

      if (dates || isDegree) {
        if (currentEdu) result.education.push(currentEdu);
        currentEdu = {
          institution: dates 
            ? line.replace(dates.start, "").replace(dates.end, "").replace(/--|–|-/g, "").replace(/\(\s*\)/g, "").replace(/\[\s*\]/g, "").trim().replace(/[,:;()\-]+$/, "").trim() 
            : line,
          degree: isDegree ? line : "Degree / Certificate",
          startDate: dates ? dates.start : "",
          endDate: dates ? dates.end : "",
        };
      } else if (currentEdu) {
        if (line.includes("CGPA") || line.includes("Percentage") || line.includes("Score") || line.includes("GPA")) {
          currentEdu.degree += " - " + line;
        } else if (currentEdu.institution.length < 80) {
          currentEdu.institution += " " + line;
        }
      }
    });
    if (currentEdu) result.education.push(currentEdu);
  }

  // Work Experience
  if (sectionLines.experience) {
    let currentWork = null;
    sectionLines.experience.forEach(line => {
      const dates = extractDates(line);
      if (dates) {
        if (currentWork) result.workExperience.push(currentWork);
        currentWork = {
          company: line.replace(dates.start, "").replace(dates.end, "").replace(/--|–|-/g, "").replace(/\(\s*\)/g, "").replace(/\[\s*\]/g, "").trim().replace(/[,:;()\-]+$/, "").trim(),
          role: "Developer / Intern",
          startDate: dates.start,
          endDate: dates.end,
          description: "",
        };
      } else if (currentWork) {
        if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
          currentWork.description += (currentWork.description ? " " : "") + line.replace(/^[•*\-]\s*/, "");
        } else if (currentWork.role === "Developer / Intern") {
          currentWork.role = line;
        } else if (currentWork.description.length < 600) {
          currentWork.description += " " + line;
        }
      }
    });
    if (currentWork) result.workExperience.push(currentWork);
  }

  // Projects
  if (sectionLines.projects) {
    let currentProj = null;
    sectionLines.projects.forEach(line => {
      const isHeader = line.length < 80 && !line.startsWith("•") && !line.startsWith("-") && !line.startsWith("*") && !line.includes("React") && !line.includes("Node");
      if (isHeader) {
        if (currentProj) result.projects.push(currentProj);
        currentProj = {
          title: line,
          description: "",
          github: "",
          liveDemo: "",
        };
      } else if (currentProj) {
        if (line.includes("http") || line.includes("github.com")) {
          const linkMatch = line.match(/https?:\/\/[^\s|]+/g);
          if (linkMatch) {
            if (line.toLowerCase().includes("github")) {
              currentProj.github = linkMatch[0];
            } else {
              currentProj.liveDemo = linkMatch[0];
            }
          }
        } else {
          currentProj.description += (currentProj.description ? " " : "") + line.replace(/^[•*\-]\s*/, "");
        }
      }
    });
    if (currentProj) result.projects.push(currentProj);
  }

  // Skills
  if (sectionLines.skills) {
    sectionLines.skills.forEach(line => {
      // Split by commas or pipes
      const items = line.split(/[|,]/).map(s => s.trim()).filter(s => s.length > 2);
      items.forEach(skillName => {
        if (skillName && skillName.length < 40 && !skillName.includes("\\") && !skillName.includes("Skills")) {
          result.skills.push({ name: skillName, progress: 85 });
        }
      });
    });
  }

  // Certifications
  if (sectionLines.certifications) {
    sectionLines.certifications.forEach(line => {
      const dates = extractDates(line);
      if (line.length > 5 && !line.startsWith("•")) {
        result.certifications.push({
          title: line.replace(/[0-9]/g, "").trim(),
          issuer: "Online Certification",
          year: dates ? dates.end : "2025",
        });
      }
    });
  }

  return result;
};

module.exports = {
  parseRawTextToResume,
};
