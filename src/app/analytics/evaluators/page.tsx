"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaQuestionCircle,
  FaCog,
  FaBars,
  FaArrowLeft,
} from "react-icons/fa";
import EvaluationChart from "@/app/analytics/evaluators/evaluationchart";
import GradeChart from "@/app/analytics/evaluators/gradechart";
import CustomChart from "@/app/analytics/evaluators/overview_2";

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

  const handleBack = () => {
    router.back();
  };

  return (
    <aside
      className={`bg-gray-900 text-gray-400 ${
        isExpanded ? "w-48" : "w-16"
      } h-screen fixed flex flex-col transition-width duration-300`}
    >
      <div className="p-4 flex items-center justify-between">
        <h1
          className={`text-2xl text-white font-bold ${
            isExpanded ? "block" : "hidden"
          }`}
        >
          <span className="text-orange-500">Smart</span>
          <span className="text-white">Paths</span>
        </h1>
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
        >
          <FaBars />
        </button>
      </div>
      <nav className="flex-grow">
        <button
          onClick={() => handleNavigation("/dashboard")}
          className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer"
        >
          <FaHome />
          <span className={`${isExpanded ? "block" : "hidden"} ml-3`}>Home</span>
        </button>
        <button
          onClick={() => handleNavigation("/help")}
          className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer"
        >
          <FaQuestionCircle />
          <span
            className={`${isExpanded ? "block" : "hidden"} ml-3`}
          >
            Help Center
          </span>
        </button>
        <button
          onClick={() => handleNavigation("/settings")}
          className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer"
        >
          <FaCog />
          <span
            className={`${isExpanded ? "block" : "hidden"} ml-3`}
          >
            Settings
          </span>
        </button>
      </nav>
      <div className="px-4 py-4">
        <button
          onClick={handleBack}
          className="w-full flex items-center bg-gray-800 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700"
        >
          <FaArrowLeft className="mr-3" />
          <span className={`${isExpanded ? "block" : "hidden"}`}>Back</span>
        </button>
      </div>
    </aside>
  );
};

// Main Evaluators Page Component
const EvaluatorsPage: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      <main
        className={`flex-grow bg-white ${
          isSidebarExpanded ? "ml-48" : "ml-16"
        } p-6`}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Evaluators</h1>

        {/* Layout for Small Cards */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Left Small Cards */}
          <div className="flex flex-col space-y-4">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-sm font-bold">Small Card 1</h2>
              <p className="text-xs">Details</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-sm font-bold">Small Card 2</h2>
              <p className="text-xs">Details</p>
            </div>
          </div>

          {/* Center Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
            <h2 className="text-lg p-8 font-bold mb-4">It's all yours</h2>
            <div className="flex justify-around w-full">
              <span>Course</span>
              <span>Small Card 1</span>
              <span>Details</span>
            </div>
          </div>

          {/* Right Small Cards */}
          <div className="flex flex-col space-y-4">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-sm font-bold">Small Card 3</h2>
              <p className="text-xs">Details</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-sm font-bold">Small Card 4</h2>
              <p className="text-xs">Details</p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-center">
              Evaluation Details
            </h2>
            <EvaluationChart />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-center">Grade Details</h2>
            <GradeChart />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-center">
              Course Overview
            </h2>
            <CustomChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EvaluatorsPage;
