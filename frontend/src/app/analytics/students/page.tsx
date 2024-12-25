"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaChartBar,
  FaUsers,
  FaEnvelope,
  FaBriefcase,
  FaQuestionCircle,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaArrowLeft,
} from "react-icons/fa";

// Sidebar Component
interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar }) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    // Perform any logout logic here, such as clearing tokens or user data
    router.push("/login");
  };

    const handleBack = () => {
        router.back();
    };

  return (
    <aside className={`bg-gray-900 text-gray-400 ${isExpanded ? "w-48" : "w-16"} h-screen fixed flex flex-col transition-width duration-300`}>
      <div className="p-4 flex items-center justify-between">
        <h1 className={`text-2xl text-white font-bold ${isExpanded ? "block" : "hidden"}`}>
          <span className="text-orange-500">Smart</span>
          <span className="text-white">Paths</span>
        </h1>
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          <FaBars />
        </button>
      </div>
      <nav className="flex-grow">
        <button onClick={() => handleNavigation('/')} className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer">
          <FaHome />
          <span className={`${isExpanded ? 'block' : 'hidden'} ml-3`}>Home</span>
        </button>
        <button onClick={() => handleNavigation('/help')} className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer">
          <FaQuestionCircle />
          <span className={`${isExpanded ? 'block' : 'hidden'} ml-3`}>Help Center</span>
        </button>
        <button onClick={() => handleNavigation('/settings')} className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer">
          <FaCog />
          <span className={`${isExpanded ? 'block' : 'hidden'} ml-3`}>Settings</span>
        </button>
      </nav>
      <div className="px-4 py-4">
        <button onClick={handleBack} className="w-full flex items-center bg-gray-800 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700">
          <FaArrowLeft className="mr-3" />
          <span className="block">Back</span>
        </button>
      </div>
    </aside>
  );
};

// Mocks Page Component
const studentsPage = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      <main className={`flex-grow bg-white ${isSidebarExpanded ? 'ml-48' : 'ml-16'} p-6`}>
        <h1 className="text-2xl font-bold mb-4">students Page</h1>
        <p className="text-black-400 text-sm">This is the students page content.</p>
        {/* Add your mocks page content here */}
      </main>
    </div>
  );
};

export default studentsPage;
