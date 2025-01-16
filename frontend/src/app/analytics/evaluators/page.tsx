"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import EvaluationChart from "@/app/analytics/evaluators/evaluationchart";
import GradeChart from "@/app/analytics/evaluators/gradechart";
import CustomChart from "@/app/analytics/evaluators/overview_2";
import Sidebar from "./Sidebar";

const EvaluatorsPage: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleProfileClick = () => {
    // Handle profile click
  };

  const handleBackClick = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <div className="flex h-screen relative">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} onProfileClick={handleProfileClick} />
      <main
        className={`flex-grow bg-white ${
          isSidebarExpanded ? "ml-64" : "ml-20"
        } p-6 filter blur-sm`}
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

      {/* Overlay with "Coming Soon" Message */}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">Coming Soon</h2>
          <p className="text-lg text-bold text-gray-700">on March 17th, 2025</p>
          <button
            onClick={handleBackClick}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluatorsPage;