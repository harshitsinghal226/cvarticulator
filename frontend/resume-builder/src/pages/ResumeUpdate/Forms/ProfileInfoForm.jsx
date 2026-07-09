import React from 'react'
import ProfilePhotoSelector from '../../../components/Inputs/ProfilePhotoSelector';
import Input from '../../../components/Inputs/Input';

const ProfileInfoForm = ({profileData, updateSection, onPresetApply}) => {
  return (
    <div className='px-5 pt-5'>
        <div className="flex justify-between items-center mb-1">
          <h2 className='text-lg font-semibold text-gray-900'>
              Personal Information
          </h2>
          {onPresetApply && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Preset:</span>
              <select 
                onChange={(e) => {
                  if (e.target.value) onPresetApply(e.target.value);
                  e.target.value = ""; // Reset
                }}
                className="text-[10px] bg-transparent font-semibold text-slate-700 bg-white outline-none cursor-pointer"
              >
                <option value="">Choose Profession...</option>
                <option value="technical">Technical / Developer</option>
                <option value="medical">Medical / Healthcare</option>
                <option value="creative">Creative / Design</option>
                <option value="sales">Non-Tech / Sales</option>
                <option value="academic">Academic / Research</option>
              </select>
            </div>
          )}
        </div>

        <div className='mt-4'>
            <ProfilePhotoSelector
                image={profileData?.profileImg || profileData?.profilePreviewUrl}
                setImage={(value) => updateSection("profileImg", value)}
                preview={profileData?.profilePreviewUrl}
                setPreview={(value) => updateSection("profilePreviewUrl", value)}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input
                    value={profileData.fullName || ""}
                    onChange={({ target }) => updateSection("fullName", target.value)}
                    label="Full Name"
                    placeholder="Enter your full name"
                    type="text"
                />

                <Input
                    value={profileData.designation || ""}
                    onChange={({ target }) => 
                        updateSection("designation", target.value)
                    }
                    label="Designation"
                    placeholder="Enter your designation"
                    type="text"
                />

                <div className='col-span-2 mt-3'>
                    <label className='text-xs font-medium text-slate-600'>
                        Summary
                    </label>

                    <textarea
                        placeholder='Short Introduction'
                        className='form-input'
                        rows={4}
                        value={profileData.summary || ""}
                        onChange={({ target }) => updateSection("summary", target.value)}
                    />
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProfileInfoForm
