import { formatYearMonth } from "./helper.js";

/**
 * Generates clean LaTeX code based on the resume JSON data model.
 */
export const generateLatexCode = (resumeData) => {
  if (!resumeData) return "";

  const {
    profileInfo,
    contactInfo,
    workExperience,
    education,
    skills,
    projects,
    certifications,
    languages,
    interests,
  } = resumeData;

  let latex = `%-------------------------
% Resume in Latex
% Author : CVArticulate Generated
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage[utf8]{inputenc}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.0in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small\\textbf{#1} & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\renewcommand{\\labelitemii}{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${profileInfo?.fullName || "Your Name"}} \\\\ \\vspace{1.5pt}
    \\small\\textbf{${profileInfo?.designation || ""}} \\\\ \\vspace{1.5pt}
    \\small ${contactInfo?.phone || ""} $|$ \\href{mailto:${contactInfo?.email || ""}}{${contactInfo?.email || ""}} $|$ 
    ${contactInfo?.location || ""}
    ${contactInfo?.linkedin ? ` $|$ \\href{${contactInfo.linkedin}}{LinkedIn}` : ""}
    ${contactInfo?.github ? ` $|$ \\href{${contactInfo.github}}{GitHub}` : ""}
    ${contactInfo?.website ? ` $|$ \\href{${contactInfo.website}}{Website}` : ""}
\\end{center}

`;

  if (profileInfo?.summary) {
    latex += `%-----------SUMMARY-----------
\\section{Professional Summary}
\\small{${profileInfo.summary}}
\\vspace{5pt}

`;
  }

  const activeWork = (workExperience || []).filter(
    (w) => (w.company || "").trim() || (w.role || "").trim(),
  );
  if (activeWork.length > 0) {
    latex += `%-----------EXPERIENCE-----------
\\section{Experience}
  \\begin{itemize}[leftmargin=0.15in, label={}]
`;
    activeWork.forEach((w) => {
      latex += `    \\resumeSubheading
      {${w.company}}{${formatYearMonth(w.startDate)} -- ${formatYearMonth(w.endDate)}}
      {${w.role}}{}
      ${w.description ? `\\resumeItem{${w.description}}` : ""}
`;
    });
    latex += `  \\end{itemize}

`;
  }

  const activeEdu = (education || []).filter(
    (e) => (e.institution || "").trim() || (e.degree || "").trim(),
  );
  if (activeEdu.length > 0) {
    latex += `%-----------EDUCATION-----------
\\section{Education}
  \\begin{itemize}[leftmargin=0.15in, label={}]
`;
    activeEdu.forEach((e) => {
      latex += `    \\resumeSubheading
      {${e.institution}}{${formatYearMonth(e.startDate)} -- ${formatYearMonth(e.endDate)}}
      {${e.degree}}{}
`;
    });
    latex += `  \\end{itemize}

`;
  }

  const activeProj = (projects || []).filter((p) => (p.title || "").trim());
  if (activeProj.length > 0) {
    latex += `%-----------PROJECTS-----------
\\section{Projects}
  \\begin{itemize}[leftmargin=0.15in, label={}]
`;
    activeProj.forEach((p) => {
      latex += `    \\resumeProjectHeading
      {\\textbf{${p.title}} $|$ \\emph{${p.description || ""}}}{}
`;
    });
    latex += `  \\end{itemize}

`;
  }

  const activeSkills = (skills || []).filter((s) => (s.name || "").trim());
  if (activeSkills.length > 0) {
    latex += `%-----------SKILLS-----------
\\section{Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Technologies}{: ${activeSkills.map((s) => s.name).join(", ")}}
    }}
 \\end{itemize}
`;
  }

  latex += `\\end{document}`;

  return latex;
};

/**
 * Strips LaTeX command markup to return clean text.
 */
const cleanLatexText = (str) => {
  if (!str) return "";
  return str
    .replace(/\\underline{([^}]+)}/g, "$1")
    .replace(/\\textbf{([^}]+)}/g, "$1")
    .replace(/\\textit{([^}]+)}/g, "$1")
    .replace(/\\emph{([^}]+)}/g, "$1")
    .replace(/\\href{[^}]+}{([^}]+)}/g, "$1")
    .replace(/\\begin{itemize}(\[[^\]]*\])?/g, "")
    .replace(/\\end{itemize}/g, "")
    .replace(/\\begin/g, "")
    .replace(/\\end/g, "")
    .replace(/\\item/g, "")
    .replace(/\\hfill/g, "")
    .replace(/hfill/gi, "")
    .replace(/enditemize/gi, "")
    .replace(/beginitemize/gi, "")
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/[\{\}]/g, "")
    .replace(/\\&/g, "&")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Parses any standard academic/professional resume LaTeX code into the structured JSON resume format.
 */
export const parseLatexToResume = (latex) => {
  if (!latex) return null;

  // Remove comment lines to avoid regex matching fake phone numbers/emails in comments
  const cleanLatexSource = latex
    .split("\n")
    .filter((line) => !line.trim().startsWith("%"))
    .join("\n");

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

  // --- 1. PARSE NAME & DESIGNATION ---
  const nameMatch =
    cleanLatexSource.match(/\\textbf{\\Huge\s+(?:\\scshape\s+)?([^}]+)}/) ||
    cleanLatexSource.match(/\\textbf{\\Huge\s+([^}]+)}/) ||
    cleanLatexSource.match(/\\Huge\s+\\scshape\s*([^\\}]+)/) ||
    cleanLatexSource.match(/\\Huge\s+([^\\}\n]+)/) ||
    cleanLatexSource.match(/\\textbf{([^}]+)}\s*\\\\\s*\\vspace/);
  if (nameMatch) {
    result.profileInfo.fullName = cleanLatexText(nameMatch[1]);
  }

  // Find designation in header or defaults
  const designationMatch =
    cleanLatexSource.match(/\\small\\textbf{([^}]+)}/) ||
    cleanLatexSource.match(/\\small\s+\\textit{([^}]+)}/) ||
    cleanLatexSource.match(/\\textit{([^}]+)}\s*\\hfill/);
  if (designationMatch) {
    result.profileInfo.designation = cleanLatexText(designationMatch[1]);
  }

  // --- 2. PARSE CONTACT INFO ---
  const emailMatch = cleanLatexSource.match(/\\href{mailto:([^}]+)}/);
  if (emailMatch) result.contactInfo.email = emailMatch[1].trim();

  const linkedinMatch =
    cleanLatexSource.match(
      /\\href{(https?:\/\/(?:www\.)?linkedin\.com\/[^}]+)}/i,
    ) || cleanLatexSource.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i);
  if (linkedinMatch) {
    result.contactInfo.linkedin = linkedinMatch[1] || linkedinMatch[0];
  }

  const githubMatch =
    cleanLatexSource.match(
      /\\href{(https?:\/\/(?:www\.)?github\.com\/[^}]+)}/i,
    ) || cleanLatexSource.match(/github\.com\/([a-zA-Z0-9-]+)/i);
  if (githubMatch) {
    result.contactInfo.github = githubMatch[1] || githubMatch[0];
  }

  // Match phone: require digits to avoid matching line separators
  const phoneMatch = cleanLatexSource.match(/(\+?\d[\d\s-]{8,14}\d)/);
  if (phoneMatch) {
    result.contactInfo.phone = phoneMatch[1].trim();
  }

  // Match location
  const locationMatch = cleanLatexSource.match(
    /\\hfill\s*([A-Za-z\s,]+)\s*\\\\/,
  );
  if (locationMatch) {
    result.contactInfo.location = locationMatch[1].trim();
  } else {
    // Look for location keywords in header lines
    const headerLines = cleanLatexSource.split(/\n/);
    for (let line of headerLines) {
      if (
        line.includes("Agra") ||
        line.includes("Delhi") ||
        line.includes("Haryana") ||
        line.includes("India") ||
        line.includes("Sonipat")
      ) {
        const cleaned = cleanLatexText(line).split("|");
        for (let pt of cleaned) {
          if (
            pt.includes("Agra") ||
            pt.includes("Delhi") ||
            pt.includes("Haryana") ||
            pt.includes("India") ||
            pt.includes("Sonipat")
          ) {
            result.contactInfo.location = pt.trim();
            break;
          }
        }
      }
    }
  }

  // --- 3. PARSE SUMMARY ---
  const summaryBlockMatch = cleanLatexSource.match(
    /\\section{(?:Professional\s+)?Summary}(.*?)(?:\\section|\\end{document})/is,
  );
  if (summaryBlockMatch) {
    const summaryText = summaryBlockMatch[1];
    const itemMatch = summaryText.match(/\\item\s+([^\\]+)/s) || [
      null,
      summaryText,
    ];
    result.profileInfo.summary = cleanLatexText(itemMatch[1]);
  }

  // Helper: Extract and clean dates
  const extractDates = (text) => {
    const dateRegex =
      /((?:[A-Za-z]+\s+\d{4})|(?:\d{4}))\s*(?:--|–|-)\s*((?:[A-Za-z]+\s+\d{4})|(?:\d{4})|Present|Current)/i;
    const match = text.match(dateRegex);
    if (match) {
      return {
        start: cleanLatexText(match[1]),
        end: cleanLatexText(match[2]),
      };
    }
    return { start: "", end: "" };
  };

  // Helper: Extract bullets
  const extractBullets = (text) => {
    const bullets = [];
    const itemMatches = text.matchAll(/\\item\s+([^\\]+)/gs);
    for (const match of itemMatches) {
      const cleaned = cleanLatexText(match[1]);
      if (cleaned) bullets.push(cleaned);
    }
    return bullets.join(" ");
  };

  // --- 4. PARSE WORK EXPERIENCE ---
  const expSectionMatch = cleanLatexSource.match(
    /\\section{Experience}(.*?)(?:\\section|\\end{document})/is,
  );
  if (expSectionMatch) {
    const expContent = expSectionMatch[1];
    const items = expContent.split(/\\item\s+(?=\\textbf)/s);
    if (items.length > 1) {
      items.shift();
      items.forEach((item) => {
        const companyMatch = item.match(/\\textbf{([^}]+)}/);
        const roleMatch = item.match(/\\textit{([^}]+)}/);
        const dates = extractDates(item);
        const description = extractBullets(item);

        if (companyMatch) {
          result.workExperience.push({
            company: cleanLatexText(companyMatch[1]),
            role: roleMatch ? cleanLatexText(roleMatch[1]) : "",
            startDate: dates.start,
            endDate: dates.end,
            description: description,
          });
        }
      });
    } else {
      const subheadings = expContent.split(/\\resumeSubheading/);
      subheadings.shift();
      subheadings.forEach((sub) => {
        const parts = sub.match(
          /^\s*{([^}]+)}\s*{([^}]+)}\s*{([^}]+)}\s*{([^}]*)}\s*(?:\\resumeItem{([^}]+)})?/s,
        );
        if (parts) {
          const dates = parts[2].split(/\s*(?:--|–|-)\s*/);
          result.workExperience.push({
            company: cleanLatexText(parts[1]),
            role: cleanLatexText(parts[3]),
            startDate: dates[0] || "",
            endDate: dates[1] || "",
            description: parts[5] ? cleanLatexText(parts[5]) : "",
          });
        }
      });
    }
  }

  // --- 5. PARSE EDUCATION ---
  const eduSectionMatch = cleanLatexSource.match(
    /\\section{Education}(.*?)(?:\\section|\\end{document})/is,
  );
  if (eduSectionMatch) {
    const eduContent = eduSectionMatch[1];
    const items = eduContent.split(/\\item\s+(?=\\textbf)/s);
    if (items.length > 1) {
      items.shift();
      items.forEach((item) => {
        const institutionMatch = item.match(/\\textbf{([^}]+)}/);
        const degreeMatch = item.match(/\\textit{([^}]+)}/);
        const dates = extractDates(item);

        if (institutionMatch) {
          result.education.push({
            institution: cleanLatexText(institutionMatch[1]),
            degree: degreeMatch ? cleanLatexText(degreeMatch[1]) : "",
            startDate: dates.start,
            endDate: dates.end,
          });
        }
      });
    } else {
      const subheadings = eduContent.split(/\\resumeSubheading/);
      subheadings.shift();
      subheadings.forEach((sub) => {
        const parts = sub.match(
          /^\s*{([^}]+)}\s*{([^}]+)}\s*{([^}]+)}\s*{([^}]*)}/s,
        );
        if (parts) {
          const dates = parts[2].split(/\s*(?:--|–|-)\s*/);
          result.education.push({
            institution: cleanLatexText(parts[1]),
            degree: cleanLatexText(parts[3]),
            startDate: dates[0] || "",
            endDate: dates[1] || "",
          });
        }
      });
    }
  }

  // --- 6. PARSE PROJECTS ---
  const projSectionMatch = cleanLatexSource.match(
    /\\section{Projects}(.*?)(?:\\section|\\end{document})/is,
  );
  if (projSectionMatch) {
    const projContent = projSectionMatch[1];
    const items = projContent.split(/\\item\s+(?=\\textbf)/s);
    if (items.length > 1) {
      items.shift();
      items.forEach((item) => {
        const titleMatch = item.match(/\\textbf{([^}]+)}/);
        const links = item.match(/\\href{([^}]+)}{GitHub[^}]*}/i);
        const liveLinks = item.match(/\\href{([^}]+)}{Live Demo[^}]*}/i);
        const description = extractBullets(item);

        if (titleMatch) {
          result.projects.push({
            title: cleanLatexText(titleMatch[1]),
            description: description,
            github: links ? links[1] : "",
            liveDemo: liveLinks ? liveLinks[1] : "",
          });
        }
      });
    } else {
      const headings = projContent.split(/\\resumeProjectHeading/);
      headings.shift();
      headings.forEach((head) => {
        const parts = head.match(
          /^\s*{\\textbf{([^}]+)}\s*\$\|\$\s*\\emph{([^}]+)}/s,
        );
        if (parts) {
          result.projects.push({
            title: cleanLatexText(parts[1]),
            description: cleanLatexText(parts[2]),
            github: "",
            liveDemo: "",
          });
        }
      });
    }
  }

  // --- 7. PARSE SKILLS ---
  const skillsSectionMatch = cleanLatexSource.match(
    /\\section{(?:Technical\s+)?Skills}(.*?)(?:\\section|\\end{document})/is,
  );
  if (skillsSectionMatch) {
    const skillsContent = skillsSectionMatch[1];
    // Support optional colons inside or outside braces
    const skillsGroupMatches = skillsContent.matchAll(
      /\\textbf{([^}:]+):?}\s*:?\s*([^\\]+)/g,
    );
    for (const match of skillsGroupMatches) {
      const groupName = cleanLatexText(match[1]);
      const list = cleanLatexText(match[2]).split(/,\s*/);
      list.forEach((skillName) => {
        if (skillName) {
          result.skills.push({
            name: `${groupName}: ${skillName}`,
            progress: 100,
          });
        }
      });
    }

    if (result.skills.length === 0) {
      const items = skillsContent.matchAll(/\\item\s+([^\\]+)/gs);
      for (const match of items) {
        const cleaned = cleanLatexText(match[1]);
        if (cleaned) {
          cleaned.split(/,\s*/).forEach((name) => {
            if (name) result.skills.push({ name, progress: 100 });
          });
        }
      }
    }
  }

  // --- 8. PARSE CERTIFICATIONS ---
  const certSectionMatch = cleanLatexSource.match(
    /\\section{Certifications}(.*?)(?:\\section|\\end{document})/is,
  );
  if (certSectionMatch) {
    const certContent = certSectionMatch[1];
    const matches = [
      ...certContent.matchAll(
        /\\textbf{([^}]+)}(.*?)(?:\\textbf|\\end{itemize}|$)/gs,
      ),
    ];
    matches.forEach((m) => {
      const title = m[1];
      const rest = m[2];
      const issuerMatch =
        rest.match(/\\textit{([^}]+)}/) ||
        rest.match(/--\s*Percentage:\s*([^\\]+)/) ||
        rest.match(/Percentage:\s*([^\\]+)/);
      const dates = extractDates(rest);

      if (title) {
        result.certifications.push({
          title: cleanLatexText(title),
          issuer: issuerMatch
            ? cleanLatexText(issuerMatch[1] || issuerMatch[0])
            : "",
          year: dates.start || dates.end || "",
        });
      }
    });
  }

  // --- 9. PARSE INTERESTS / ACHIEVEMENTS ---
  const achievementsMatch = cleanLatexSource.match(
    /\\section{Achievements}(.*?)(?:\\section|\\end{document})/is,
  );
  if (achievementsMatch) {
    const achievementsContent = achievementsMatch[1];
    const items = achievementsContent.split(/\\item\s+/s);
    items.shift();
    items.forEach((item) => {
      const cleaned = cleanLatexText(item);
      if (cleaned) result.interests.push(cleaned);
    });
  }

  return result;
};
