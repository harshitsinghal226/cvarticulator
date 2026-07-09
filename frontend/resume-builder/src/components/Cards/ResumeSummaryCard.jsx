import React, { useEffect, useState, useContext } from 'react'
import { getLightColorFromImage } from '../../utils/helper';
import { ThemeContext } from '../../context/ThemeContext';

const ResumeSummaryCard = ({ imgUrl, title, lastUpdated, onSelect }) => {
    const { theme } = useContext(ThemeContext);
    const [bgColor, setBgColor] = useState("#ffffff");

    useEffect(() => {
        if(imgUrl) {
            getLightColorFromImage(imgUrl)
                .then((color) => {
                setBgColor(color);
                })
                .catch(() => {
                setBgColor("#ffffff");
                });
        }
    }, [imgUrl]);

    return (
    <div 
        className='h-[350px] flex flex-col items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl border-2 border-[#CDBFA5]/30 shadow-lg hover:shadow-2xl hover:border-[#9C8D7F] hover:scale-105 overflow-hidden cursor-pointer transition-all duration-300'
        style={{backgroundColor: bgColor}}
        onClick={onSelect}    
    >
        <div className='w-full p-3 flex-1 flex items-center justify-center'>
        {imgUrl ? (
            <img
                src={imgUrl}
                alt={title}
                className='w-full h-full object-contain rounded-lg'
            />
        ) : (
            <div className='w-full h-full bg-gradient-to-br from-[#F5F3F0] to-[#CDBFA5]/20 rounded-lg flex items-center justify-center'>
                <span className='text-[#9C8D7F] text-sm'>No Preview</span>
            </div>
        )}
        </div>

        <div className='w-full bg-white/90 backdrop-blur-sm px-4 py-3 border-t-2 border-[#CDBFA5]/20 transition-colors'>
        <h5 className='text-sm font-semibold truncate overflow-hidden whitespace-nowrap text-[#2C3440]'>{title}</h5>
        <p className='text-xs font-medium text-[#434C5E] mt-0.5'>
            Last Updated: {lastUpdated}
        </p>
        </div>
    </div>
    )
};

export default ResumeSummaryCard;
