import React from "react";

const TemplateCard = ({ thumbnailImg, isSelected, onSelect }) => {
  return (
    <div
      className={`h-auto md:h-[300px] flex flex-col items-center justify-center bg-white rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected
          ? "border-[#2C3440] shadow-lg scale-[1.02]"
          : "border-[#CDBFA5]/20 hover:border-[#9C8D7F] hover:shadow-md hover:scale-[1.01]"
      }`}
      onClick={onSelect}
    >
        {thumbnailImg ? (
            <img src={thumbnailImg} alt="Template Thumbnail" className="w-full h-full object-cover rounded-lg" />
        ) : (
            <div className="text-slate-400 text-xs">No Thumbnail</div>
        )}
    </div>
  )
};

export default TemplateCard;
