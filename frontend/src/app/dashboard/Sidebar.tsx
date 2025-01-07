"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Home as HomeIcon, PieChart, LogOut, Menu, Camera, BarChart2, UserCheck, Settings } from "lucide-react";

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setImageUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <aside className={`bg-black text-white ${isExpanded ? "w-64" : "w-20"} h-screen fixed flex flex-col transition-all duration-300 shadow-2xl p-4`}>
      <div className="flex items-center justify-center mb-4">
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          <Menu className="text-2xl text-orange-500 mx-auto" />
        </button>
      </div>
      {isExpanded && (
        <div className="flex flex-col items-center justify-center mt-6">
          <label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <div
              className="bg-gray-700 border-2 border-dashed border-gray-500 rounded-full w-28 h-28 flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {imageUrl ? null : <Camera className="text-2xl text-orange-500 mx-auto" />}
            </div>
          </label>
          <span className="text-white mt-4 font-semibold text-lg">Prateek</span>
          <span className="text-gray-400">prateek@example.com</span>
        </div>
      )}
      <ul className="mt-10 space-y-6">
        <li className="flex items-center gap-4 cursor-pointer hover:text-blue-400 transition-all" onClick={() => handleNavigation("/dashboard")}>
          <HomeIcon className="text-xl text-orange-500" />
          {isExpanded && <span className="font-medium text-lg">Home</span>}
        </li>
        <li className="flex items-center gap-4 cursor-pointer hover:text-blue-400 transition-all" onClick={() => handleNavigation("/profile")}>
          <UserCheck className="text-xl text-orange-500" />
          {isExpanded && <span className="font-medium text-lg">Profile</span>}
        </li>
        <li className="flex items-center gap-4 cursor-pointer hover:text-blue-400 transition-all" onClick={() => handleNavigation("/analytics")}>
          <BarChart2 className="text-xl text-orange-500" />
          {isExpanded && <span className="font-medium text-lg">Analytics</span>}
        </li>
        <li className="flex items-center gap-4 cursor-pointer hover:text-blue-400 transition-all" onClick={() => handleNavigation("/settings")}>
          <Settings className="text-xl text-orange-500" />
          {isExpanded && <span className="font-medium text-lg">Settings</span>}
        </li>
        <li className="flex items-center gap-4 cursor-pointer hover:text-blue-400 transition-all" onClick={() => handleNavigation("/signup")}>
          <LogOut className="text-xl text-orange-500" />
          {isExpanded && <span className="font-medium text-lg">Logout</span>}
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;