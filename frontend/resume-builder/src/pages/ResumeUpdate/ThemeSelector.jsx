import React, { useEffect, useRef, useState } from "react";
import {
  DUMMY_RESUME_DATA,
  resumeTemplates,
  themeColorPalette,
} from "../../utils/data";
import { LuCircleCheckBig } from "react-icons/lu";
import Tabs from "../../components/Tabs";
import TemplateCard from "../../components/Cards/TemplateCard";
import RenderResume from "../../components/ResumeTemplates/RenderResume";

const TAB_DATA = [{ label: "Templates" }, { label: "Color Palettes" }];

const ThemeSelector = ({
  selectedTheme,
  setSelectedTheme,
  resumeData,
  onClose,
}) => {
  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);

  const [tabValue, setTabValue] = useState("Templates");
  const [selectedColorPalette, setSelectedColorPalette] = useState({
    colors: selectedTheme?.colorPalette || ["#F3F4F6", "#3B82F6", "#DBEAFE", "#2563EB", "#1F2937"],
    index: -1,
  });
  const [selectedTemplate, setSelectedTemplate] = useState({
    theme: selectedTheme?.theme || "",
    index: -1,
  });
  const [customColors, setCustomColors] = useState(
    selectedTheme?.colorPalette?.length === 5 
      ? selectedTheme.colorPalette 
      : ["#F3F4F6", "#3B82F6", "#DBEAFE", "#2563EB", "#1F2937"]
  );

  const updateCustomColor = (idx, value) => {
    setCustomColors((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      setSelectedColorPalette({ colors: updated, index: 999 });
      return updated;
    });
  };

  const isCustomTheme = selectedTemplate?.theme?.startsWith("00");

  const tabData = selectedTemplate?.theme === "04"
    ? [{ label: "Templates" }]
    : isCustomTheme
    ? [{ label: "Templates" }, { label: "Color Palettes" }, { label: "Layout Design" }]
    : [{ label: "Templates" }, { label: "Color Palettes" }];

  useEffect(() => {
    if (selectedTemplate?.theme === "04" && tabValue === "Color Palettes") {
      setTabValue("Templates");
    }
    if (!isCustomTheme && tabValue === "Layout Design") {
      setTabValue("Templates");
    }
  }, [selectedTemplate?.theme, tabValue, isCustomTheme]);

  //Handle Theme Change
  const handleThemeSelection = () => {
    setSelectedTheme({
      colorPalette: selectedTemplate?.theme === "04" ? [] : selectedColorPalette?.colors,
      theme: selectedTemplate?.theme,
    });
    onClose();
  };

  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);

    return () => {
      window.removeEventListener("resize", updateBaseWidth);
    };
  }, []);

  return (
    <div className="container mx-auto px-2 md:px-0">
      <div className="flex items-center justify-between mb-5 mt-2">
        <Tabs tabs={tabData} activeTab={tabValue} setActiveTab={setTabValue} />

        <button
          className="btn-small-light"
          onClick={() => handleThemeSelection()}
        >
          <LuCircleCheckBig className="text-[16px]" /> Done
        </button>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-5 bg-transparent">
          <div className="grid grid-cols-2 gap-5 max-h-[80vh] overflow-scroll custom-scrollbar md:pr-5">
            {tabValue == "Templates" &&
              resumeTemplates.map((template, index) => (
                <TemplateCard
                  key={`templates_${index}`}
                  thumbnailImg={template.thumbnailImg}
                  isSelected={selectedTemplate?.theme === template.id}
                  onSelect={() =>
                    setSelectedTemplate({ theme: template.id, index })
                  }
                />
              ))}

              {tabValue === "Color Palettes" && 
              themeColorPalette.themeOne.map((colors, index) => (
                <ColorPalette
                  key={`palette_${index}`}
                  colors={colors}
                  isSelected={selectedColorPalette?.index === index}
                  onSelect={() => setSelectedColorPalette({ colors, index })}
                />
              ))}

            {tabValue === "Color Palettes" && (
              <div className="col-span-2 border-t-2 border-slate-100 pt-4 mt-2">
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Create Custom Theme Colors
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {customColors.map((color, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">
                        {idx === 0 && "Bg"}
                        {idx === 1 && "Accent"}
                        {idx === 2 && "Light"}
                        {idx === 3 && "Dark"}
                        {idx === 4 && "Text"}
                      </span>
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => updateCustomColor(idx, e.target.value)}
                        className="w-8 h-8 cursor-pointer rounded-lg border-2 border-slate-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tabValue === "Layout Design" && (
              <div className="col-span-2 space-y-3">
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Custom Layout Style
                </h4>
                
                {[
                  { id: "00-single", label: "Single Column Standard", desc: "Classic vertical sections stacking." },
                  { id: "00-left", label: "Two Column Sidebar Left", desc: "Profile & skills on left column." },
                  { id: "00-right", label: "Two Column Sidebar Right", desc: "Profile & skills on right column." },
                ].map((layout) => (
                  <div
                    key={layout.id}
                    onClick={() => setSelectedTemplate({ theme: layout.id, index: 99 })}
                    className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 text-left ${
                      selectedTemplate?.theme === layout.id
                        ? "border-[#2C3440] bg-[#CDBFA5]/5 font-bold shadow"
                        : "border-slate-100 bg-white hover:border-[#9C8D7F]"
                    }`}
                  >
                    <span className="text-xs text-slate-800 font-bold block">{layout.label}</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{layout.desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div
          className="col-span-12 md:col-span-7 bg-slate-50 border-2 border-[#CDBFA5]/20 rounded-2xl p-4 h-[70vh] overflow-y-auto overflow-x-hidden custom-scrollbar flex justify-center items-start"
          ref={resumeRef}
        >
          <div
            style={{
              width: `${baseWidth > 32 ? baseWidth - 32 : 1}px`,
              height: `${baseWidth > 32 ? (297 * (baseWidth - 32)) / 210 : 1}px`,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <RenderResume
                templateId={selectedTemplate?.theme || ""}
                resumeData={ DUMMY_RESUME_DATA || resumeData }
                containerWidth={baseWidth > 32 ? baseWidth - 32 : baseWidth}
                colorPalette={selectedColorPalette?.colors || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;

const ColorPalette = ({ colors, isSelected, onSelect }) => {
    return (
        <div
          className={`h-24 bg-[#CDBFA5]/5 flex rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
            isSelected 
              ? "border-[#2C3440] shadow-md scale-[1.02]" 
              : "border-[#CDBFA5]/20 hover:border-[#9C8D7F]"  
          }`}
          onClick={onSelect}
        >
            {colors.map((color, index) => (
                <div
                  key={`color_${index}`}
                  className="flex-1 h-full"
                  style={{ backgroundColor: colors[index] }}
                />
            ))}
        </div>
    )
}