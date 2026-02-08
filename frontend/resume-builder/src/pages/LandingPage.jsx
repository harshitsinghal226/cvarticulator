import React, { useState, useContext } from "react";

import HERO_IMG from "../assets/hero-img.png";
import { useNavigate } from "react-router-dom";
import SignUp from "./Auth/SignUp";
import Login from "./Auth/Login";
import Modal from "../components/Modal";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";
import { useEffect } from "react";
import axios from "axios";

const LandingPage = () => {
  const {user} = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`${process.env.VITE_BACKEND_URL}`);
  }, []);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if(!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#F5F3F0] via-[#E8E4DC] to-[#CDBFA5]/30 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1">
        {/* Header */}
        <header className="flex justify-between items-center mb-16 bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 shadow-lg border border-[#CDBFA5]/30">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#2C3440] to-[#434C5E] bg-clip-text text-transparent">
            CVArticulate
          </div>
          {user ? <ProfileInfoCard /> : <button
            className="bg-gradient-to-r from-[#9C8D7F] to-[#CDBFA5] text-sm font-semibold text-white px-7 py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setOpenAuthModal(true)}
          >
            Login / Sign Up
          </button>}
        </header>

        {/* Hero Content */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-[#2C3440]">
              Articulate {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9C8D7F] via-[#CDBFA5] to-[#9C8D7F] bg-[length:200%_200%] animate-text-shine">
                Your Success
              </span>
            </h1>
            <p className="text-lg text-[#434C5E] mb-8 leading-relaxed">
              Transform your career history into a compelling story. Our intelligent builder helps you craft professional, high-impact resumes in minutes.
            </p>
            <button
              className="bg-gradient-to-r from-[#2C3440] to-[#434C5E] text-sm font-semibold text-white px-10 py-4 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={handleCTA}
            >
              Get Started
            </button>
          </div>
          <div className="w-full md:w-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#9C8D7F] to-[#CDBFA5] rounded-3xl opacity-20 blur-2xl"></div>
              <img
                src={HERO_IMG}
                alt="Hero Image"
                className="relative w-full rounded-2xl shadow-2xl border-4 border-white/50"
              />
            </div>
          </div>
        </div>

        <section className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#2C3440]">
            Features that Make You Shine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border-2 border-[#CDBFA5]/30 hover:shadow-2xl hover:scale-105 hover:border-[#9C8D7F] transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#9C8D7F] to-[#CDBFA5] rounded-xl mb-4 flex items-center justify-center">
                <span className="text-2xl">✏️</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2C3440]">Easy Editing</h3>
              <p className="text-[#434C5E] leading-relaxed">
                Update your resume sections with live preview and instant
                formatting.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border-2 border-[#CDBFA5]/30 hover:shadow-2xl hover:scale-105 hover:border-[#9C8D7F] transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2C3440] to-[#434C5E] rounded-xl mb-4 flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2C3440]">
                Professional Templates
              </h3>
              <p className="text-[#434C5E] leading-relaxed">
                Choose from a variety of modern and ATS-friendly resume
                templates.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border-2 border-[#CDBFA5]/30 hover:shadow-2xl hover:scale-105 hover:border-[#9C8D7F] transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#9C8D7F] to-[#CDBFA5] rounded-xl mb-4 flex items-center justify-center">
                <span className="text-2xl">⬇️</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2C3440]">One-Click Download</h3>
              <p className="text-[#434C5E] leading-relaxed">
                Download your resume as a PDF with just one click.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="w-full text-sm bg-white/60 backdrop-blur-md text-[#434C5E] text-center py-4 border-t-2 border-[#CDBFA5]/30 mt-auto">
        <p className="font-medium">Made by <span className="text-[#2C3440] font-semibold">Harshit Singhal</span> in 2026</p>
      </footer>

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
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;
