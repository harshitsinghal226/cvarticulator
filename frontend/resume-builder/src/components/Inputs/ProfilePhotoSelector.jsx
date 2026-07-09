import React, { useRef, useState } from 'react'
import {LuUser, LuUpload, LuTrash } from 'react-icons/lu'

const ProfilePhotoSelector = ({image, setImage, preview, setPreview}) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            //Update the image state
            setImage(file);

            //Generate preview URL from the file
            const preview = URL.createObjectURL(file);
            if(setPreview) {
                setPreview(preview)
            }
            setPreviewUrl(preview);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);

        if(setPreview) {
            setPreview(null);
        }
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

  return (
    <div className='flex justify-center mb-6'>
      <input
        type='file'
        accept='image/*'
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
      />

      {!image ? (
        <div 
          className='w-20 h-20 flex items-center justify-center bg-[#CDBFA5]/20 hover:bg-[#CDBFA5]/30 rounded-full relative border border-[#CDBFA5]/40 transition-colors cursor-pointer'
          onClick={onChooseFile}
        >
            <LuUser className='text-4xl text-[#9C8D7F]' />

            <button
                type='button'
                className='w-8 h-8 flex items-center justify-center bg-gradient-to-r from-[#2C3440] to-[#434C5E] text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer hover:shadow-md hover:scale-105 transition-all'
                onClick={(e) => {
                  e.stopPropagation();
                  onChooseFile();
                }}
            >
                <LuUpload />
            </button>
        </div>
      ) : (
        <div className='relative'>
            <img
                src={previewUrl || preview}
                alt='Profile Preview'
                className='w-20 h-20 rounded-full object-cover'
            />

            <button
                type='button'
                className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
                onClick={handleRemoveImage}
            >
                <LuTrash />
            </button>
        </div>
      )}
    </div>
  )
}

export default ProfilePhotoSelector
