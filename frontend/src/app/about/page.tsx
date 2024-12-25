"use client";

import React from 'react';
import { Header } from '../../sections/Header';
import Image from 'next/image';
import abstractImage1 from '../../assets/abstract_3.png'; // Import the first image
import abstractImage2 from '../../assets/abstract_15.png'; // Import the second image

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
          <div className="relative flex items-center">
            <div className="w-1/3 hidden md:block">
              <Image
                src={abstractImage2}
                alt="Abstract Image"
                width={300}
                height={300}
                className="opacity-80"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h1 className="text-5xl md:text-4xl font-extrabold tracking-tighter bg-gradient-to-b from-gray-900 to-gray-600 text-transparent bg-clip-text">
                <span className="text-orange-500">About</span> Us
              </h1>
              <p className="text-2xl text-gray-600 tracking-tight mt-6 max-w-3xl mx-auto">
                Discover SmartPaths and how we are shaping the future of education with innovative academic workflows.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10 mt-16">
          <div className="relative flex items-center flex-col-reverse md:flex-row">
            <div className="w-full md:w-2/3">
              <h2 className="text-5xl md:text-4xl font-extrabold tracking-tighter bg-gradient-to-b from-gray-900 to-gray-600 text-transparent bg-clip-text">
                <span className="text-orange-500">Our</span> Story
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto mt-8 text-center md:text-left">
                SmartPaths began with a mission to revolutionize academic workflows. What started as a small idea to simplify evaluations has now grown into a platform empowering educators and institutions globally.
              </p>
            </div>
            <div className="w-1/3 hidden md:block">
              <Image
                src={abstractImage2}
                alt="Abstract Image"
                width={300}
                height={300}
                className="opacity-80"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10 mt-16">
          <div className="relative flex items-center">
            <div className="w-1/3 hidden md:block">
              <Image
                src={abstractImage2}
                alt="Abstract Image"
                width={300}
                height={300}
                className="opacity-80"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-5xl md:text-4xl font-extrabold tracking-tighter bg-gradient-to-b from-gray-900 to-gray-600 text-transparent bg-clip-text">
                <span className="text-orange-500">Our</span> Vision
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto mt-8 text-center md:text-left">
                At SmartPaths, we envision a world where academic workflows are seamless, efficient, and unbiased, enabling educators and institutions to focus on fostering growth and learning.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10 mt-16">
          <h2 className="text-5xl md:text-4xl font-extrabold tracking-tighter bg-gradient-to-b from-gray-900 to-gray-600 text-transparent bg-clip-text text-center">
            <span className="text-orange-500">Meet the</span> Founders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            <div className="flex flex-col md:flex-row items-center bg-gray-50 shadow-lg rounded-lg p-8 transition-transform hover:scale-105">
              <Image
                src="/prateek.jpg"
                alt="Dr. Prateek Shantharama"
                className="w-40 h-40 rounded-full mb-6 md:mb-0 md:mr-8 border-4 border-gray-200"
                width={160}
                height={160}
                style={{ width: 'auto', height: 'auto' }}
              />
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold text-gray-800 uppercase">Dr. Prateek Shantharama</h3>
                <p className="text-gray-500 italic mb-4">Founder, President & CTO</p>
                <p className="text-gray-700 leading-relaxed">
                  A seasoned educator with over 20 years of experience. Dr. Prateek's passion for innovation drives SmartPaths.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center bg-gray-50 shadow-lg rounded-lg p-8 transition-transform hover:scale-105">
              <Image
                src="/vivek.jpg"
                alt="Vivek Srinivas"
                className="w-40 h-40 rounded-full mb-6 md:mb-0 md:mr-8 border-4 border-gray-200"
                width={160}
                height={160}
                style={{ width: 'auto', height: 'auto' }}
              />
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold text-gray-800 uppercase">Vivek Srinivas</h3>
                <p className="text-gray-500 italic mb-4">Founder & CEO</p>
                <p className="text-gray-700 leading-relaxed">
                  A visionary leader with expertise in educational technology, shaping SmartPaths' innovative direction.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center bg-gray-50 shadow-lg rounded-lg p-8 transition-transform hover:scale-105">
              <Image
                src="/disha.jpg"
                alt="Disha Suresh"
                className="w-40 h-40 rounded-full mb-6 md:mb-0 md:mr-8 border-4 border-gray-200"
                width={160}
                height={160}
                style={{ width: 'auto', height: 'auto' }}
              />
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold text-gray-800 uppercase">Disha Suresh</h3>
                <p className="text-gray-500 italic mb-4">Co-Founder, Software Lead</p>
                <p className="text-gray-700 leading-relaxed">
                  An expert in software development, ensuring seamless technical operations at SmartPaths.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center bg-gray-50 shadow-lg rounded-lg p-8 transition-transform hover:scale-105">
              <Image
                src="/bhargavi.jpg"
                alt="Bhargavi Sreenivasamurthy"
                className="w-40 h-40 rounded-full mb-6 md:mb-0 md:mr-8 border-4 border-gray-200"
                width={160}
                height={160}
                style={{ width: 'auto', height: 'auto' }}
              />
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold text-gray-800 uppercase">Bhargavi Sreenivasamurthy</h3>
                <p className="text-gray-500 italic mb-4">Co-Founder, COO</p>
                <p className="text-gray-700 leading-relaxed">
                  A strategic planner driving organizational growth and ensuring SmartPaths thrives in a competitive landscape.
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