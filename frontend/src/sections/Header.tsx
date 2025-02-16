"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import Logo from "../assets/smartpathslogo.png";
import MenuIcon from "../assets/menu.png";

export const Header = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTryForFreeClick = () => {
    router.push("/signup");
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 top-0 left-0 transition-shadow bg-white text-black ${
        isScrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between w-full">
        {/* Mobile Menu Button */}
        <button
          onClick={handleMenuToggle}
          className="md:hidden focus:outline-none z-50"
        >
          <Image src={MenuIcon} alt="Menu Icon" height={24} width={24} />
        </button>

        {/* Logo */}
        <Link href="/" legacyBehavior>
          <a className="flex items-center gap-2">
            <Image src={Logo} alt="SmartPaths Logo" height={50} width={50} />
            <span className="font-bold hidden md:inline">
              <span className="text-orange-500">Smart</span>
              <span className="text-black">Paths</span>
            </span>
          </a>
        </Link>

        {/* Navigation Menu */}
        <nav
          className={`absolute top-full left-0 w-full bg-white md:bg-transparent md:w-auto md:static
            flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 p-4 md:p-0
            transition-all duration-300 ease-in-out
            ${
              isMenuOpen
                ? "opacity-100 max-h-screen"
                : "opacity-0 max-h-0 overflow-hidden md:opacity-100 md:max-h-full"
            }
          `}
        >
          <Link href="/about" legacyBehavior>
            <a className="hover:text-blue-600 transition-colors">About</a>
          </Link>
          <Link href="/features" legacyBehavior>
            <a className="hover:text-blue-600 transition-colors">Features</a>
          </Link>
          <Link href="/updates" legacyBehavior>
            <a className="hover:text-blue-600 transition-colors">Updates</a>
          </Link>
          <button
            className="bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            onClick={handleTryForFreeClick}
          >
            Try for free
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
