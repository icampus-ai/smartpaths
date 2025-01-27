"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Home as HomeIcon, ChevronLeft, ChevronRight, User, BarChart2, UserCheck, Settings, LogOut } from "lucide-react";

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
  onProfileClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar, onProfileClick }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setImageUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleNavigation = (path: string) => {
    setActiveMenu(path);
    router.push(path);
  };

  return (
    <aside className={`bg-[#2B2B2B] text-white ${isExpanded ? "w-64" : "w-20"} h-screen fixed flex flex-col transition-all duration-300 shadow-2xl p-4`}>
      <div className={`flex items-center ${isExpanded ? "justify-center" : "justify-start"} mb-4`}>
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          {isExpanded ? (
            <ChevronLeft className="text-2xl text-[#FF6600]" />
          ) : (
            <ChevronRight className="text-2xl text-[#FF6600]" />
          )}
        </button>
      </div>
      {isExpanded && (
        <div className="flex flex-col items-center justify-center mt-6">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none", pointerEvents: "none" }}
            />
            <div
              className="w-28 h-28 flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "50%",
                backgroundColor: "#2B2B2B",
              }}
            >
              {!imageUrl && <User className="text-6xl text-[#FF6600]" />}
            </div>
          </label>
          <span className="text-white mt-4 font-semibold text-lg">User</span>
          <span className="text-gray-400">user@example.com</span>
        </div>
      )}
      <ul className="mt-10 space-y-6">
        <li
          className={`flex items-center gap-4 cursor-pointer hover:text-[#E0E0E0] transition-all ${activeMenu === "/dashboard" ? "scale-110" : ""}`}
          onClick={() => handleNavigation("/dashboard")}
        >
          <HomeIcon className="text-xl text-[#FF6600]" />
          {isExpanded && <span className="font-medium text-lg">Home</span>}
        </li>
        <li
          className={`flex items-center gap-4 cursor-pointer hover:text-[#E0E0E0] transition-all ${activeMenu === "/dashboard/profile" ? "scale-110" : ""}`}
          onClick={onProfileClick}
        >
          <UserCheck className="text-xl text-[#FF6600]" />
          {isExpanded && <span className="font-medium text-lg">Profile</span>}
        </li>
        <li
          className={`flex items-center gap-4 cursor-pointer hover:text-[#E0E0E0] transition-all ${activeMenu === "/analytics" ? "scale-110" : ""}`}
          onClick={() => handleNavigation("/analytics/evaluators")}
        >
          <BarChart2 className="text-xl text-[#FF6600]" />
          {isExpanded && <span className="font-medium text-lg">Analytics</span>}
        </li>
        <li
          className={`flex items-center gap-4 cursor-pointer hover:text-[#E0E0E0] transition-all ${activeMenu === "/usage" ? "scale-110" : ""}`}
          onClick={() => handleNavigation("/usage")}
        >
          <Settings className="text-xl text-[#FF6600]" />
          {isExpanded && <span className="font-medium text-lg">Usage</span>}
        </li>
        <li
          className={`flex items-center gap-4 cursor-pointer hover:text-[#E0E0E0] transition-all ${activeMenu === "/signup" ? "scale-110" : ""}`}
          onClick={() => handleNavigation("/signup")}
        >
          <LogOut className="text-xl text-[#FF6600]" />
          {isExpanded && <span className="font-medium text-lg">Logout</span>}
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;