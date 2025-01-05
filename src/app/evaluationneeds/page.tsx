"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ScheduleCallPage: React.FC = () => {
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);

  const handleConfirmSchedule = () => {
    if (scheduleDate) {
      alert(`You have scheduled a call for ${scheduleDate.toLocaleDateString()}!`);
    } else {
      alert("Please select a date before confirming.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Schedule a Call
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Choose a date and time that works best for you to connect with our founders.
        </p>
        <div className="flex justify-center">
          <DatePicker
            selected={scheduleDate}
            onChange={(date) => setScheduleDate(date)}
            inline
            minDate={new Date()}
            className="rounded-lg border-gray-300"
          />
        </div>
        <button
          onClick={handleConfirmSchedule}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium py-2 px-4 mt-6 rounded-lg hover:opacity-90 transition-opacity"
        >
          Confirm Schedule
        </button>
      </div>
    </div>
  );
};

export default ScheduleCallPage;
