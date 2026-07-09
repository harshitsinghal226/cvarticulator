import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LuSparkles, 
  LuFileText, 
  LuDownload, 
  LuGauge, 
  LuUpload, 
  LuEye, 
  LuArrowRight, 
  LuCheck, 
  LuLayers, 
  LuPalette,
  LuShieldCheck
} from "react-icons/lu";

import HERO_IMG from "../assets/hero-img.png";
import TEMPLATE_ONE_IMG from "../assets/template-one.png";
import TEMPLATE_TWO_IMG from "../assets/template-two.png";
import TEMPLATE_THREE_IMG from "../assets/template-three.png";
import TEMPLATE_FOUR_IMG from "../assets/template-four.png";

import SignUp from "./Auth/SignUp";
import Login from "./Auth/Login";
import ForgotPassword from "./Auth/ForgotPassword";
import Modal from "../components/Modal";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";
import axiosInstance from "../utils/axiosInstance";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  useEffect(() => {
    // Warm-up call to wake the backend on Render free tier
    axiosInstance.get("/").catch(() => {});

    if (location.state?.openLogin) {
      setOpenAuthModal(true);
      setCurrentPage("login");
      // Clear location state to prevent reopening on page reload/back navigation
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Set up Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const hiddenElements = document.querySelectorAll(".scroll-hidden");
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  const templatesList = [
    { name: "Modern Minimalist", img: TEMPLATE_ONE_IMG, tag: "Popular" },
    { name: "Executive Professional", img: TEMPLATE_TWO_IMG, tag: "ATS-Tested" },
    { name: "Creative Designer", img: TEMPLATE_THREE_IMG, tag: "Unique" },
    { name: "Technical Engineer", img: TEMPLATE_FOUR_IMG, tag: "Clean" },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#F5F3F0] via-[#E8E4DC] to-[#CDBFA5]/30 flex flex-col font-display selection:bg-[#9C8D7F]/30 selection:text-[#2C3440]">
      
      {/* 1. Header / Navigation */}
      <header className="sticky top-0 z-40 w-full bg-[#F5F3F0]/80 backdrop-blur-md border-b border-[#CDBFA5]/30 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2C3440] to-[#9C8D7F] flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">CV</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#2C3440] to-[#434C5E] bg-clip-text text-transparent">
              CVArticulate
            </span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <a href="#features" className="text-sm text-[#434C5E] hover:text-[#2C3440] transition-colors hidden md:inline-block nav-link-hover py-1">Features</a>
            <a href="#how-it-works" className="text-sm text-[#434C5E] hover:text-[#2C3440] transition-colors hidden md:inline-block nav-link-hover py-1">How It Works</a>
            <a href="#templates" className="text-sm text-[#434C5E] hover:text-[#2C3440] transition-colors hidden md:inline-block nav-link-hover py-1">Templates</a>
            
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="bg-gradient-to-r from-[#2C3440] to-[#434C5E] hover:from-[#9C8D7F] hover:to-[#CDBFA5] text-sm font-semibold text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer"
                onClick={() => setOpenAuthModal(true)}
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="container mx-auto px-6 pt-16 pb-20 flex flex-col lg:flex-row items-center gap-16">
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#9C8D7F]/10 border border-[#9C8D7F]/20 text-[#9C8D7F] text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-up">
            <LuSparkles className="text-sm" /> AI-Powered Resume Builder
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-[#2C3440] tracking-tight animate-fade-in-up">
            Articulate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9C8D7F] via-[#CDBFA5] to-[#9C8D7F] bg-[length:200%_200%] animate-text-shine">
              Your Professional Success
            </span>
          </h1>
          
          <p className="text-lg text-[#434C5E] mb-8 leading-relaxed max-w-xl animate-fade-in-up">
            Transform your complex career history into a structured, highly compelling story. Stand out to top recruiters with ATS-optimized resumes crafted in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-8 animate-fade-in-up">
            <button
              className="bg-gradient-to-r from-[#2C3440] to-[#434C5E] text-base font-semibold text-white px-10 py-4 rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer animate-pulse-glow flex items-center justify-center gap-2"
              onClick={handleCTA}
            >
              Get Started Free <LuArrowRight className="text-lg" />
            </button>
            <a
              href="#templates"
              className="border-2 border-[#CDBFA5] text-[#2C3440] bg-white/40 hover:bg-white/80 hover:border-[#9C8D7F] text-base font-semibold px-8 py-4 rounded-xl transition-all duration-300 text-center flex items-center justify-center gap-2"
            >
              Browse Templates
            </a>
          </div>

          <div className="flex items-center gap-6 text-sm text-[#434C5E]/85 font-medium animate-fade-in-up">
            <span className="flex items-center gap-1.5"><LuCheck className="text-[#9C8D7F]" /> No Credit Card</span>
            <span className="flex items-center gap-1.5"><LuCheck className="text-[#9C8D7F]" /> ATS-Friendly</span>
            <span className="flex items-center gap-1.5"><LuCheck className="text-[#9C8D7F]" /> PDF Download</span>
          </div>
        </div>

        <div className="w-full lg:w-1/2 relative flex justify-center items-center">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#9C8D7F] to-[#CDBFA5] rounded-3xl opacity-20 blur-3xl"></div>
          
          {/* Overlapping templates card showcase */}
          <div className="relative w-full max-w-md h-[400px] sm:h-[480px]">
            <div className="absolute top-0 right-0 w-[60%] z-10 animate-float shadow-2xl border-4 border-white rounded-2xl overflow-hidden transition-all duration-300 hover:z-30 hover:scale-105">
              <img src={TEMPLATE_ONE_IMG} alt="Template 1" className="w-full h-auto object-cover" />
            </div>
            
            <div className="absolute bottom-4 left-0 w-[58%] z-20 animate-float-delayed shadow-2xl border-4 border-white rounded-2xl overflow-hidden transition-all duration-300 hover:z-30 hover:scale-105">
              <img src={TEMPLATE_TWO_IMG} alt="Template 2" className="w-full h-auto object-cover" />
            </div>

            <div className="absolute top-[20%] left-[10%] w-[50%] z-0 animate-float-slow shadow-xl border-4 border-white/80 rounded-2xl overflow-hidden opacity-90 transition-all duration-300 hover:z-30 hover:scale-105 hover:opacity-100">
              <img src={TEMPLATE_THREE_IMG} alt="Template 3" className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats / Social Proof Bar */}
      <section className="bg-[#2C3440] text-white py-12 shadow-inner">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-1">
            <h4 className="text-4xl font-extrabold text-[#CDBFA5]">7+</h4>
            <p className="text-slate-300 font-medium text-sm">Professional Design Templates</p>
          </div>
          <div className="space-y-1 border-y md:border-y-0 md:border-x border-slate-600/50 py-6 md:py-0">
            <h4 className="text-4xl font-extrabold text-[#CDBFA5]">100%</h4>
            <p className="text-slate-300 font-medium text-sm">ATS System Compatibility</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-4xl font-extrabold text-[#CDBFA5]">&lt; 5 Min</h4>
            <p className="text-slate-300 font-medium text-sm">Average Resume Build Time</p>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white/40 border-y border-[#CDBFA5]/25">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 scroll-hidden">
            <h2 className="text-4xl font-bold text-[#2C3440] mb-4">Create Your Resume in 3 Easy Steps</h2>
            <p className="text-lg text-[#434C5E]">Our simplified interactive interface ensures you hit all the marks that recruiters care about.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            {/* Steps line connector for large devices */}
            <div className="hidden lg:block absolute top-[50px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#9C8D7F]/20 via-[#CDBFA5] to-[#9C8D7F]/20 -z-10"></div>

            {/* Step 1 */}
            <div className="bg-white/80 border border-[#CDBFA5]/30 p-8 rounded-2xl shadow-lg relative flex flex-col items-center text-center hover:scale-[1.03] transition-all duration-300 scroll-hidden">
              <div className="w-14 h-14 bg-gradient-to-br from-[#2C3440] to-[#434C5E] text-white font-extrabold text-xl rounded-full flex items-center justify-center shadow-lg -mt-14 mb-6">1</div>
              <h3 className="text-xl font-bold mb-3 text-[#2C3440]">Sign Up / Sign In</h3>
              <p className="text-[#434C5E] text-sm leading-relaxed">Create a secure profile to save multiple resume drafts, customize layouts, and update them anytime as your career grows.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/80 border border-[#CDBFA5]/30 p-8 rounded-2xl shadow-lg relative flex flex-col items-center text-center hover:scale-[1.03] transition-all duration-300 scroll-hidden">
              <div className="w-14 h-14 bg-gradient-to-br from-[#9C8D7F] to-[#CDBFA5] text-white font-extrabold text-xl rounded-full flex items-center justify-center shadow-lg -mt-14 mb-6">2</div>
              <h3 className="text-xl font-bold mb-3 text-[#2C3440]">Build & Import</h3>
              <p className="text-[#434C5E] text-sm leading-relaxed">Autofill by uploading an existing PDF resume, or enter details step-by-step through our clean, field-guided form panels.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/80 border border-[#CDBFA5]/30 p-8 rounded-2xl shadow-lg relative flex flex-col items-center text-center hover:scale-[1.03] transition-all duration-300 scroll-hidden">
              <div className="w-14 h-14 bg-gradient-to-br from-[#2C3440] to-[#9C8D7F] text-white font-extrabold text-xl rounded-full flex items-center justify-center shadow-lg -mt-14 mb-6">3</div>
              <h3 className="text-xl font-bold mb-3 text-[#2C3440]">Export PDF</h3>
              <p className="text-[#434C5E] text-sm leading-relaxed">Choose a sleek theme color palette, select one of the professional ATS-optimized template outputs, and download instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Template Showcase Gallery */}
      <section id="templates" className="py-24 container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 scroll-hidden">
          <h2 className="text-4xl font-bold text-[#2C3440] mb-4">A Template for Every Industry</h2>
          <p className="text-lg text-[#434C5E]">Approved by hiring managers, built with structural hierarchy, and fully compatible with screen readers.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {templatesList.map((tpl, i) => (
            <div key={i} className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-[#CDBFA5]/30 hover:shadow-2xl hover:scale-[1.04] transition-all duration-300 flex flex-col scroll-hidden">
              <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden border-b border-gray-100">
                <img src={tpl.img} alt={tpl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-[#2C3440] text-[#CDBFA5] text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow">
                  {tpl.tag}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                <h3 className="font-bold text-[#2C3440] text-base group-hover:text-[#9C8D7F] transition-colors">{tpl.name}</h3>
                <button 
                  onClick={handleCTA}
                  className="mt-4 text-xs font-bold text-[#9C8D7F] group-hover:text-[#2C3440] flex items-center gap-1.5 transition-colors"
                >
                  Use Template <LuArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Features Grid Section */}
      <section id="features" className="py-24 bg-white/40 border-t border-[#CDBFA5]/25">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 scroll-hidden">
            <h2 className="text-4xl font-bold text-[#2C3440] mb-4">Features Designed for Results</h2>
            <p className="text-lg text-[#434C5E]">Everything you need to showcase your talent, experiences, and qualifications professionally.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-[#CDBFA5]/30 hover:shadow-xl hover:scale-[1.02] hover:border-[#9C8D7F] transition-all duration-300 scroll-hidden flex flex-col items-start">
              <div className="w-12 h-12 bg-[#9C8D7F]/15 rounded-xl mb-6 flex items-center justify-center text-2xl text-[#9C8D7F]">
                <LuPalette />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2C3440]">Live Customizations</h3>
              <p className="text-[#434C5E] text-sm leading-relaxed">
                Update details and immediately view formatting. Instantly change color schemes and section font layouts to match your targeted company.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-[#CDBFA5]/30 hover:shadow-xl hover:scale-[1.02] hover:border-[#9C8D7F] transition-all duration-300 scroll-hidden flex flex-col items-start">
              <div className="w-12 h-12 bg-[#2C3440]/10 rounded-xl mb-6 flex items-center justify-center text-2xl text-[#2C3440]">
                <LuLayers />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2C3440]">ATS-Ready Templates</h3>
              <p className="text-[#434C5E] text-sm leading-relaxed">
                Choose from templates engineered to pass Application Tracking Systems (ATS) seamlessly, guaranteeing recruiters actually read your hard work.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-[#CDBFA5]/30 hover:shadow-xl hover:scale-[1.02] hover:border-[#9C8D7F] transition-all duration-300 scroll-hidden flex flex-col items-start">
              <div className="w-12 h-12 bg-[#9C8D7F]/15 rounded-xl mb-6 flex items-center justify-center text-2xl text-[#9C8D7F]">
                <LuDownload />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2C3440]">One-Click PDF Export</h3>
              <p className="text-[#434C5E] text-sm leading-relaxed">
                Generate highly formatted, standard A4 dimension PDF documents ready for applications, without structural distortion or printing alignment bugs.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-[#CDBFA5]/30 hover:shadow-xl hover:scale-[1.02] hover:border-[#9C8D7F] transition-all duration-300 scroll-hidden flex flex-col items-start">
              <div className="w-12 h-12 bg-[#2C3440]/10 rounded-xl mb-6 flex items-center justify-center text-2xl text-[#2C3440]">
                <LuUpload />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2C3440]">PDF Resume Import</h3>
              <p className="text-[#434C5E] text-sm leading-relaxed">
                Already have an old resume? Upload your PDF. Our intelligent parsing backend reads and fills out your profile sections instantly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-[#CDBFA5]/30 hover:shadow-xl hover:scale-[1.02] hover:border-[#9C8D7F] transition-all duration-300 scroll-hidden flex flex-col items-start">
              <div className="w-12 h-12 bg-[#9C8D7F]/15 rounded-xl mb-6 flex items-center justify-center text-2xl text-[#9C8D7F]">
                <LuGauge />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2C3440]">ATS Optimization Score</h3>
              <p className="text-[#434C5E] text-sm leading-relaxed">
                Get an objective assessment score on how well your contact data, educational histories, work highlights, and skills are aligned to match recruiters' automated filters.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-[#CDBFA5]/30 hover:shadow-xl hover:scale-[1.02] hover:border-[#9C8D7F] transition-all duration-300 scroll-hidden flex flex-col items-start">
              <div className="w-12 h-12 bg-[#2C3440]/10 rounded-xl mb-6 flex items-center justify-center text-2xl text-[#2C3440]">
                <LuShieldCheck />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2C3440]">Secure Draft Management</h3>
              <p className="text-[#434C5E] text-sm leading-relaxed">
                Keep infinite iterations of your professional resumes safely stored. Edit custom versions targeted for different jobs anytime, from anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA Banner */}
      <section className="bg-gradient-to-br from-[#2C3440] via-[#353E4D] to-[#434C5E] text-white py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#9C8D7F]/5 pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10 max-w-3xl scroll-hidden">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to Build Your Professional Story?</h2>
          <p className="text-lg text-slate-200 mb-8 max-w-xl mx-auto">
            Take the frustration out of resume writing. Join thousands of candidates who landed dream job interviews using CVArticulate.
          </p>
          <button
            className="bg-gradient-to-r from-[#9C8D7F] to-[#CDBFA5] text-[#2C3440] hover:text-[#2C3440] text-base font-bold px-12 py-4 rounded-xl shadow-2xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer animate-pulse-glow"
            onClick={handleCTA}
          >
            Create My Resume Now
          </button>
        </div>
      </section>

      {/* 8. Enhanced Footer */}
      <footer className="w-full bg-[#1e232b] text-slate-400 pt-16 pb-8 border-t border-slate-800">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9C8D7F] to-[#CDBFA5] flex items-center justify-center shadow">
                <span className="text-[#2C3440] font-bold text-sm">CV</span>
              </div>
              <span className="text-xl font-bold text-white tracking-wide">CVArticulate</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Professional resume solutions to help job seekers design clear, structured, and recruiter-friendly applications.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#templates" className="hover:text-white transition-colors">Templates</a></li>
              <li><button onClick={handleCTA} className="hover:text-white transition-colors cursor-pointer text-left">Resume Builder</button></li>
              <li><button onClick={handleCTA} className="hover:text-white transition-colors cursor-pointer text-left">PDF Import</button></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GDPR Compliance</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Get in Touch</h4>
            <p className="text-sm text-slate-500 mb-2">Have questions? We are here to help you shine.</p>
            <a href="mailto:harshitsinghal226@gmail.com" className="text-sm text-[#CDBFA5] hover:underline">harshitsinghal226@gmail.com</a>
          </div>
        </div>

        <div className="container mx-auto px-6 pt-8 border-t border-slate-800 text-center text-xs text-slate-600 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} CVArticulate. All rights reserved.</p>
          <p className="font-medium text-slate-500">
            Made by <span className="text-slate-300 font-semibold">Harshit Singhal</span> in 2026
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
          {currentPage === "forgot-password" && (
            <ForgotPassword setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;

