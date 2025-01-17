"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image';
import emailjs from 'emailjs-com';
import abstractImage from '../../assets/abstract_33.png'; // Adjust the import path as necessary

const ScheduleCallPage: React.FC = () => {
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("10:00 AM");
  const router = useRouter();

  const handleConfirmSchedule = () => {
    if (scheduleDate && name && email) {
      const formattedDate = scheduleDate.toLocaleDateString();
      const message = `Name: ${name}\nEmail: ${email}\nDate: ${formattedDate}\nTime: ${timeSlot}`;

      // Save data locally
      localStorage.setItem('scheduleData', JSON.stringify({ name, email, date: formattedDate, time: timeSlot }));

      // Send email using EmailJS
      emailjs.send('service_a9v6goh', 'template_oxxnf3l', {
        name,
        email,
        date: formattedDate,
        time: timeSlot,
        message
      }, 'pizE2YG5sn9MmEXtS')
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
        alert(`You have scheduled a call for ${formattedDate} at ${timeSlot}!`);
      }, (err) => {
        console.error('Failed to send email. Error:', err);
        alert('Failed to send email. Please try again later.');
      });
    } else {
      alert("Please fill in all fields before confirming.");
    }
  };

  const handleBackClick = () => {
    router.push('/'); // Navigate back to the Hero component
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={abstractImage}
          alt="Abstract Background"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-20"
        />
      </div>
      <div className="text-center mb-8 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="text-orange-500">Smart</span>
          <span className="text-black"> Paths</span> 
        </h1>
        <p className="text-lg text-black">
          Schedule a call with our founders
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative z-10">
        <p className="text-black text-center mb-6">
          Choose a date and time that works best for you to connect with our founders.
        </p>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-4 border rounded-lg"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded-lg"
            required
          />
          <div className="flex justify-center mb-4">
            <DatePicker
              selected={scheduleDate}
              onChange={(date) => setScheduleDate(date)}
              inline
              minDate={new Date()}
              className="rounded-lg border-gray-300"
            />
          </div>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full p-2 mt-4 border rounded-lg"
          >
            <option value="10:00 AM">10:00 AM PST</option>
            <option value="11:00 AM">11:00 AM PST</option>
            <option value="12:00 PM">12:00 PM PST</option>
            <option value="1:00 PM">1:00 PM PST</option>
            <option value="2:00 PM">2:00 PM PST</option>
          </select>
        </div>
        <button
          onClick={handleConfirmSchedule}
          className="w-full bg-black text-white font-medium py-2 px-4 mt-6 rounded-lg hover:opacity-90 transition-opacity"
        >
          Confirm Schedule
        </button>
        <button
          onClick={handleBackClick}
          className="w-full bg-black text-white font-medium py-2 px-4 mt-4 rounded-lg hover:opacity-90 transition-opacity"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ScheduleCallPage;