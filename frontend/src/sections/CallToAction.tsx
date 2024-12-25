"use client";
import ArrowRight from "../assets/arrow-right.svg";
import handImage from "../assets/hand.png";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';

export const CallToAction = () => {
  const router = useRouter();

  const handleSignUpClick = () => {
    router.push('/signup');
  };

  const handleLearnMoreClick = () => {
    router.push('/features');
  };

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-800 py-40 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Heading Section */}
        <div className="relative text-center mb-10">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-gray-700 text-transparent bg-clip-text mt-2">
            Ready to Get Started?
          </h2>
          <p className="mt-5 text-lg text-black">
            Sign up for <span className="text-orange-500 font-bold text-black">Smart</span><span>Paths</span> today and streamline your evaluation process like never before.
          </p>

          {/* Floating Hand Animation */}
          <motion.div
            className="absolute -right-[150px] -top-[80px] hidden md:block"
            animate={{
              translateY: [-20, 20],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            <Image src={handImage} alt="Hand Image" width={300} height={300} />
          </motion.div>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col md:flex-row gap-4 mt-10 justify-center">
          {/* Primary Button */}
          <button
            className="w-full md:w-auto bg-black text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:scale-105 transition-transform"
            onClick={handleSignUpClick}
          >
            Sign Up
          </button>

          {/* Secondary Button */}
          <button
            className="w-full md:w-auto text-black font-bold py-3 px-8 hover:scale-105 transition-transform flex items-center justify-center"
            onClick={handleLearnMoreClick}
          >
            <span>Learn More</span>
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [0.8, 1.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        ></motion.div>
        <motion.div
          animate={{
            scale: [0.8, 1.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        ></motion.div>
      </div>
    </section>
  );
};