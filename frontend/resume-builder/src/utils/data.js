import TEMPLATE_ONE_IMG from "../assets/template-one.png";
import TEMPLATE_TWO_IMG from "../assets/template-two.png";
import TEMPLATE_THREE_IMG from "../assets/template-three.png";
import TEMPLATE_FOUR_IMG from "../assets/template-four.png";

export const resumeTemplates = [
  {
    id: "00",
    thumbnailImg: TEMPLATE_ONE_IMG,
    colorPaletteCode: "themeOne",
  },
  {
    id: "01",
    thumbnailImg: TEMPLATE_ONE_IMG,
    colorPaletteCode: "themeOne",
  },
  {
    id: "02",
    thumbnailImg: TEMPLATE_TWO_IMG,
    colorPaletteCode: "themeTwo",
  },
  {
    id: "03",
    thumbnailImg: TEMPLATE_THREE_IMG,
    colorPaletteCode: "themeThree",
  },
  {
    id: "04",
    thumbnailImg: TEMPLATE_FOUR_IMG,
    colorPaletteCode: "themeOne",
  },
  {
    id: "05",
    thumbnailImg: TEMPLATE_ONE_IMG,
    colorPaletteCode: "themeTwo",
  },
  {
    id: "06",
    thumbnailImg: TEMPLATE_TWO_IMG,
    colorPaletteCode: "themeThree",
  },
];

export const themeColorPalette = {
  themeOne: [
    ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#00B8DB", "#4A5565"],

    ["#E9FBF8", "#B4EFE7", "#93E2DA", "#2AC9A0", "#3D4C5A"],
    ["#F5FAFF", "#E0DBFF", "#C9C2F8", "#8579D1", "#4B4B5C"],
    ["#F0FAFF", "#D6F0FF", "#AFDEFF", "#3399FF", "#445361"],
    ["#FFF5F7", "#FFE0EC", "#FAC6D4", "#F6729C", "#5A5A5A"],
    ["#F9FAFB", "#E4E7EB", "#CBD5E0", "#7F9CFS", "#2D3748"],

    ["#F4FFFD", "#D3FDF2", "#B0E9D4", "#34C790", "#384C48"],
    ["#FFF7F0", "#FFE6D9", "#FFD2BA", "#FF9561", "#4C4743"],
    ["#F9FCFF", "#E3F0F9", "#C0DDEE", "#6CA6CF", "#46545E"],
    ["#FFFDF6", "#FFF4D7", "#FFEA70", "#FFD000", "#2B3A42"],
    ["#EFFCFF", "#C8F0FF", "#99E0FF", "#007BA7", "#2B3A42"],
    
    ["#F7F7F7", "#E4E4E4", "#CFCFCF", "#4A4A4A", "#222222"],
    ["#E3F2FD", "#90CAF9", "#A8D2F4", "#1E88E5", "#0D47A1"],
  ],
};

export const DUMMY_RESUME_DATA = {
  profileInfo: {
    profileImg: null,
    profilePreviewUrl: "",
    fullName: "Harshit",
    designation: "Senior Software Engineer",
    summary:
      "Passionate and results-driven developer with 6+ years of exprience.",
  },
  contactInfo: {
    email: "harshit@example.com",
    phone: "+1234567890",
    location: "123 Anywhere, Any City, Any Country",
    linkedin: "https://linkedin.com/in/harshit",
    github: "https://github.com/harshit",
    website: "https://harshit.com",
  },
  workExperience: [
    {
      company: "Tech Solutions",
      role: "Senior Frontend Engineer",
      startDate: "2022-03",
      endDate: "2025-04",
      description:
        "Leading the frontend team to build scalable enterprise applications using React.",
    },
    {
      company: "Coding Dev",
      role: "Full Stack Developer",
      startDate: "2020-01",
      endDate: "2022-02",
      description:
        "Worked on cross-functional teams developing full-stack solutions with React.",
    },
    {
      company: "Startup Company",
      role: "Junior Web Developer",
      startDate: "2018-06",
      endDate: "2019-12",
      description:
        "Built responsive websites for startups and small businesses. Maintained legacy codebases.",
    },
  ],
  education: [
    {
      degree: "B.Tech",
      institution: "ABC University",
      startDate: "2023-08",
      endDate: "2027-06",
    },
    {
      degree: "12th Grade",
      institution: "ABC University",
      startDate: "2021-08",
      endDate: "2022-05",
    },
    {
      degree: "High School",
      institution: "ABC School",
      startDate: "2019-06",
      endDate: "2020-05",
    },
  ],
  skills: [
    { name: "JavaScript", progress: 95 },
    { name: "React", progress: 90 },
    { name: "Node.js", progress: 85 },
    { name: "TypeScript", progress: 80 },
    { name: "MongoDB", progress: 75 },
  ],

  projects: [
    {
      title: "Project Manager App",
      description:
        "A task and team management app built with MERN stack. Includes user roles, real-time updates, and authentication.",
      github: "https://github.com/harshit/project-manager-app",
    },
    {
      title: "E-Commerce Platform",
      description:
        "An e-commerce site built with Next.js and Stripe integration. Supports cart, checkout, and payment workflows.",
      liveDemo: "https://ecommerce-demo.harshit.com",
    },
    {
      title: "Blog CMS",
      description:
        "A custom CMS for blogging using Express and React. Includes WYSIWYG editor, authentication, and admin dashboard.",
      github: "https://github.com/harshit/blog-cms",
      liveDemo: "https://blogcms.harshit.dev",
    },
  ],
  certifications: [
    {
      title: "Full Stack Web Developer",
      issuer: "Udemy",
      year: "2025",
    },
    {
      title: "React Advanced Certification",
      issuer: "Coursera",
      year: "2024",
    },
  ],

  languages: [
    { name: "English", progress: 100 },
    { name: "Spanish", progress: 30 },
    { name: "French", progress: 40 },
  ],

  interests: ["Reading", "Open Source Contribution", "Hiking"],
};
