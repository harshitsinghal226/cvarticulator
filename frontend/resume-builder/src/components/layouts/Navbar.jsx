import React, { useContext } from "react";
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { LuSun, LuMoon } from "react-icons/lu";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="h-16 bg-white/80 dark:bg-[#1A1F26]/80 backdrop-blur-xl border-b-2 border-[#CDBFA5]/30 dark:border-[#9C8D7F]/20 shadow-lg py-2.5 px-4 md:px-0 sticky top-0 z-30 transition-colors">
      <div className="container mx-auto flex items-center justify-between gap-5">
        <Link to="/dashboard">
          <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#2C3440] to-[#434C5E] dark:from-[#9C8D7F] dark:to-[#CDBFA5] bg-clip-text text-transparent leading-5 hover:scale-105 transition-transform duration-300">
            CVArticulate
          </h2>
        </Link>

        <div className="flex items-center gap-4">
          <ProfileInfoCard />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
