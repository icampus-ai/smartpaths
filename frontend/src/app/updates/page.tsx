"use client";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaCodeBranch } from "react-icons/fa";
import Header from "../../sections/Header"; // Adjust the import path as necessary
import Image from 'next/image';
import abstractImage from '../../assets/abstract_10.png'; // Adjust the import path as necessary

const updates = [
  {
    version: "1.0",
    date: "2023-01-15",
    features: [
      "Initial release with core functionality.",
      "User authentication and basic dashboards.",
      "Support for evaluation templates.",
    ],
  },
  {
    version: "1.1",
    date: "2023-03-10",
    features: [
      "Added advanced analytics for evaluators.",
      "Enhanced security features.",
      "Improved UI for better user experience.",
    ],
  },
  {
    version: "1.2",
    date: "2023-06-05",
    features: [
      "Introduced integrations with third-party tools.",
      "Support for exporting evaluation reports.",
      "Bug fixes and performance improvements.",
    ],
  },
  {
    version: "2.0",
    date: "2023-09-20",
    features: [
      "Major UI/UX overhaul for modern design.",
      "Introduction of AI-powered evaluation assistance.",
      "Customizable evaluation workflows.",
    ],
  },
];

const UpdatesPage: React.FC = () => {
  const [openVersion, setOpenVersion] = useState<string | null>(null);

  const toggleVersion = (version: string) => {
    setOpenVersion(openVersion === version ? null : version);
  };

  return (
    <>
      <Header />
      <section className="relative min-h-screen bg-white py-20 px-6">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={abstractImage}
            alt="Abstract Background"
            layout="fill"
            objectFit="cover"
            className="opacity-20"
          />
        </div>
        <div className="container mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl text-center font-bold bg-gradient-to-b from-black to-gray-700 text-transparent bg-clip-text">
            <span className="text-orange-500">Smart</span>
            <span className="text-black">Paths Software Updates</span>
          </h1>
          <p className="text-center text-lg text-black mt-4">
            Explore the evolution of SmartPaths.
          </p>
          <div className="mt-12 space-y-6 relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>

            {updates.map((update, index) => (
              <div key={update.version} className="relative pl-16">
                {/* Icon */}
                <div className="absolute left-4 top-4 w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full shadow">
                  <FaCodeBranch size={16} />
                </div>
                {/* Header */}
                <button
                  className="flex justify-between items-center w-full bg-gray-100 text-gray-800 shadow-md rounded-lg p-4"
                  onClick={() => toggleVersion(update.version)}
                >
                  <div>
                    <h2 className="text-xl font-bold">
                      Version {update.version}
                    </h2>
                    <p className="text-sm text-gray-600">{update.date}</p>
                  </div>
                  <span>
                    {openVersion === update.version ? (
                      <FaChevronUp size={20} />
                    ) : (
                      <FaChevronDown size={20} />
                    )}
                  </span>
                </button>
                {/* Content */}
                {openVersion === update.version && (
                  <div className="mt-4 bg-white shadow rounded-lg p-4 text-gray-700">
                    <ul className="space-y-2 list-disc list-inside">
                      {update.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default UpdatesPage;