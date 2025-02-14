"use client";

import React from 'react';
import { Header } from '../../sections/Header';
import Image from 'next/image';
import abstractImage1 from '../../assets/abstract_33.png'; // Import the first image
import abstractImage2 from '../../assets/abstract_15.png'; // Import the second image
import aboutImage from '../../assets/about.png'; // Import the about image
import missionImage from '../../assets/mission.png'; // Import the mission image

const About = () => {
  return (
    <>
      <Header />
      <section className="bg-white py-24 text-center relative">
        <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <Image
            src={abstractImage1}
            alt="Abstract Image"
            fill
            style={{ objectFit: 'cover' }}
            className="opacity-10"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-center mt-8">
            <span className="text-orange-500">Empowering</span> Educators Worldwide: The
            <span className="text-orange-500"> Smart</span>Paths Journey
          </h1>
          <div className="relative flex items-center mt-12">
            <div className="w-1/3 hidden md:block">
              <Image
                src={aboutImage}
                alt="About Image"
                width={600}
                height={600}
                className="opacity-80"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h1 className="text-5xl md:text-4xl font-extrabold tracking-tighter bg-gradient-to-b from-gray-900 to-gray-600 text-transparent bg-clip-text">
                <span className="text-orange-500">About</span> Us
              </h1>
              <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                <p className="text-2xl text-gray-600 tracking-tight max-w-3xl mx-auto">
                  Three young evaluators identified biases in the traditional manual evaluation process and recognized its inefficiency. To address this, SmartPaths was created, an AI - Agent solution designed to streamline and optimize manual academic workflows.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10 mt-2">
          <div className="relative flex items-center flex-col-reverse md:flex-row">
            <div className="w-full md:w-2/3">
              <h2 className="text-5xl md:text-4xl font-extrabold tracking-tighter bg-gradient-to-b from-gray-900 to-gray-600 text-transparent bg-clip-text">
                <span className="text-orange-500">Our</span> Story
              </h2>
              <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                <p className="text-2xl text-gray-600 tracking-tight max-w-3xl mx-auto">
                  SmartPaths began by simplifying evaluations. Now, it&apos;s a global platform empowering educators and institutions.
                </p>
              </div>
            </div>
            <div className="w-1/3 hidden md:block">
              <Image
                src={abstractImage2}
                alt="Abstract Image"
                width={600}
                height={600}
                className="opacity-80"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10 mt-2">
          <div className="relative flex items-center">
            <div className="w-1/3 hidden md:block">
              <Image
                src={missionImage}
                alt="Mission Image"
                width={300}
                height={300}
                className="opacity-80"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-5xl md:text-4xl font-extrabold tracking-tighter bg-gradient-to-b from-gray-900 to-gray-600 text-transparent bg-clip-text">
                <span className="text-orange-500">Our</span> Vision
              </h2>
              <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                <p className="text-2xl text-gray-600 tracking-tight max-w-3xl mx-auto">
                  At SmartPaths, we envision seamless, efficient, and unbiased workflows that let educators focus on growth and learning.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Updated "Meet the Founders" Section */}
        <div className="container mx-auto px-4 relative z-10 mt-14">
          <h2 className="text-5xl md:text-4xl font-extrabold tracking-tighter bg-gradient-to-b from-gray-900 to-gray-600 text-transparent bg-clip-text text-center">
            <span className="text-orange-500">Meet the</span> Founders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Founder 1 */}
            <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow bg-gradient-to-br from-white to-gray-50 p-6">
              <div className="absolute inset-0 bg-pattern opacity-10 pointer-events-none" />
              <div className="flex flex-col items-center relative z-10">
                <div className="w-32 h-32 mb-4 relative">
                  <Image
                    src="/prateek.jpg"
                    alt="Dr. Prateek Shantharama"
                    className="rounded-full object-cover border-4 border-white shadow-md"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 uppercase">
                  Dr. Prateek Shantharama
                </h3>
                <p className="text-gray-500 italic mb-4">Founder, President & CTO</p>
                <p className="text-gray-700 text-center leading-relaxed">
                  A seasoned educator with over 20 years of experience.
                  Dr. Prateek&apos;s passion for innovation drives SmartPaths.
                </p>
              </div>
            </div>

            {/* Founder 2 */}
            <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow bg-gradient-to-br from-white to-gray-50 p-6">
              <div className="absolute inset-0 bg-pattern opacity-10 pointer-events-none" />
              <div className="flex flex-col items-center relative z-10">
                <div className="w-32 h-32 mb-4 relative">
                  <Image
                    src="/vivek.jpg"
                    alt="Vivek Srinivas"
                    className="rounded-full object-cover border-4 border-white shadow-md"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 uppercase">
                  Vivek Srinivas
                </h3>
                <p className="text-gray-500 italic mb-4">Founder & CEO</p>
                <p className="text-gray-700 text-center leading-relaxed">
                  A visionary leader with expertise in educational technology,
                  shaping SmartPaths&apos; innovative direction.
                </p>
              </div>
            </div>

            {/* Founder 3 */}
            <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow bg-gradient-to-br from-white to-gray-50 p-6">
              <div className="absolute inset-0 bg-pattern opacity-10 pointer-events-none" />
              <div className="flex flex-col items-center relative z-10">
                <div className="w-32 h-32 mb-4 relative">
                  <Image
                    src="/bhargavi.jpg"
                    alt="Bhargavi Sreenivasamurthy"
                    className="rounded-full object-cover border-4 border-white shadow-md"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 uppercase">
                  Bhargavi Sreenivasamurthy
                </h3>
                <p className="text-gray-500 italic mb-4">Co-Founder, COO</p>
                <p className="text-gray-700 text-center leading-relaxed">
                  A strategic planner driving organizational growth and
                  ensuring SmartPaths thrives in a competitive landscape.
                </p>
              </div>
            </div>

            {/* Founder 4 */}
            <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow bg-gradient-to-br from-white to-gray-50 p-6">
              <div className="absolute inset-0 bg-pattern opacity-10 pointer-events-none" />
              <div className="flex flex-col items-center relative z-10">
                <div className="w-32 h-32 mb-4 relative">
                  <Image
                    src="/disha.jpg"
                    alt="Disha Suresh"
                    className="rounded-full object-cover border-4 border-white shadow-md"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 uppercase">
                  Disha Suresh
                </h3>
                <p className="text-gray-500 italic mb-4">Co-Founder, CPO</p>
                <p className="text-gray-700 text-center leading-relaxed">
                  A creative thinker with a focus on product development,
                  ensuring SmartPaths delivers innovative solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;