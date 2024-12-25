"use client";
import React from "react";
import ArrowIcon from '../assets/arrow-right.svg';
import cogImage from '../assets/cog.png';
import Image from 'next/image';
import { motion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';

export const Hero: React.FC = () => {
  const heroRef = useRef(null);
  const { scrollXProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const router = useRouter();

  const handleTryForFreeClick = () => {
    router.push('/signup');
  };

  const handleLearnMoreClick = () => {
    router.push('/features');
  };

  return (
    <section ref={heroRef} className="bg-gradient-to-b from-white to-gray-800 pt-16 pb-24 md:pt-20 md:pb-28">
      <div className="container mx-auto px-6 md:px-12">
        <div className="md:flex items-center">
          <div className="md:w-[478px]">
            <div className="btn btn-primary mb-4">Version 2.0 is here</div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-gray-700 text-transparent bg-clip-text mt-6">
              Welcome to the Future of Education
            </h1>
            <p className="text-xl text-[#010D3E] tracking-tight mt-6">
              Discover a smarter way to grade! Our AI-powered grading system delivers faster, fairer, and more insightful evaluations, empowering educators to focus on what truly matters—STUDENTS.
            </p>
            <div className="flex gap-4 items-center mt-8">
              <button className="btn btn-primary" onClick={handleTryForFreeClick}>Try for Free</button>
              <button className="btn btn-text flex items-center gap-2" onClick={handleLearnMoreClick}>
                <span>Learn more</span>
                <ArrowIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
            <motion.img
              src={cogImage.src}
              alt="Cog Image"
              className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6"
              animate={{
                translateX: [-30, 30],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};