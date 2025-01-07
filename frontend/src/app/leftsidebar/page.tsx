"use client";
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCamera, FaBars } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-gray-100 ${isExpanded ? 'w-60' : 'w-16'} h-screen p-4 flex flex-col items-center transition-width duration-300`}>
      <button onClick={toggleSidebar} className="mb-4 focus:outline-none">
        <FaBars className="w-6 h-6 text-gray-700" />
      </button>
      <div className="flex flex-col items-center mb-6">
        {image ? (
          <img src={image} alt="User" className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <FaUser className="w-16 h-16 text-gray-700" />
        )}
        {isExpanded && (
          <>
            <label className="mt-2 cursor-pointer flex flex-col items-center relative">
              <FaCamera className="w-6 h-6 text-gray-700" />
              <input
                type="file"
                accept="image/*"
                className="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer"
                onChange={handleImageUpload}
              />
            </label>
            <h2 className="text-xl font-bold mt-2">User Name</h2>
          </>
        )}
      </div>
      {isExpanded && (
        <div className="flex flex-col items-start w-full">
          <div className="flex items-center mb-4">
            <FaEnvelope className="w-6 h-6 text-gray-700 mr-2" />
            <span className="text-lg">user@example.com</span>
          </div>
          <div className="flex items-center mb-4">
            <FaPhone className="w-6 h-6 text-gray-700 mr-2" />
            <span className="text-lg">+1234567890</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;