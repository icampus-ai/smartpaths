"use client";

import React from "react";

interface Tier {
  name: string;
  monthlyLimit: number; // Monthly evaluation limit
  used: number;         // Number of evaluations used this month
}

const TiersPage: React.FC = () => {
  // Example static data. In a real project, you might fetch this from an API.
  const tiers: Tier[] = [
    { name: "Free", monthlyLimit: 10, used: 3 },
    { name: "Pay per Evaluation", monthlyLimit: 50, used: 20 },
  ];

  // Helper to calculate remaining evaluations.
  const getRemaining = (tier: Tier) => {
    return tier.monthlyLimit - tier.used;
  };

  // Helper to calculate usage percentage for a progress bar.
  const getUsagePercent = (tier: Tier) => {
    return (tier.used / tier.monthlyLimit) * 100;
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-orange-500">SmartPaths</h1>
          <h2 className="text-2xl font-semibold text-black mt-2">User Usage</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="bg-white rounded-lg shadow-md p-5 flex flex-col"
            >
              <h2 className="text-xl font-bold mb-4">{tier.name}</h2>

              {/* Usage Info */}
              <div className="mb-2 text-sm">
                <span className="font-medium">Monthly Limit:</span>{" "}
                {tier.monthlyLimit}
              </div>
              <div className="mb-2 text-sm">
                <span className="font-medium">Used:</span> {tier.used}
              </div>
              <div className="mb-4 text-sm">
                <span className="font-medium">Remaining:</span>{" "}
                {getRemaining(tier)}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                <div
                  className="bg-blue-600 h-2"
                  style={{ width: `${getUsagePercent(tier)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TiersPage;