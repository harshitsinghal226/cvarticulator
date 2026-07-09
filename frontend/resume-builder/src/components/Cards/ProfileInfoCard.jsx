import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };
  
  return (
    user && (
      <div className="flex items-center">
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt={user.name || "User Avatar"}
            className="w-11 h-11 bg-gray-300 object-cover rounded-full mr-3 shadow-md"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-[#2C3440] to-[#434C5E] dark:from-[#9C8D7F] dark:to-[#CDBFA5] text-white dark:text-[#2C3440] font-black rounded-full mr-3 shadow-md text-sm border-2 border-[#CDBFA5]/40">
            {getInitials(user.name)}
          </div>
        )}
        <div>
          <div className="text-[14px] font-bold text-[#2C3440] dark:text-gray-150 leading-3 mb-1">
            {user.name || ""}
          </div>
          <button
            className="text-amber-750 dark:text-[#CDBFA5] text-[11px] font-bold uppercase tracking-wider cursor-pointer hover:underline"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileInfoCard;
