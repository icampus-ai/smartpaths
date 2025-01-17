"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ArrowRight from '../assets/arrow-right.svg';
import Logo from '../assets/smartpathslogo.png';
import Image from 'next/image';
import MenuIcon from '../assets/menu.svg';
import Link from 'next/link'; // Import Link for navigation

const bounceAnimation = {
  animation: 'bounce 2s infinite',
};

const pulseAnimation = {
  animation: 'pulse 2s infinite',
};

const fadeInAnimation = {
  animation: 'fade-in 2s ease-in-out',
};

const keyframes = `
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const Header = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTryForFreeClick = () => {
    router.push('/signup'); 
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down and not at the top
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
        // Scrolling up or at the top
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);

      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <style>{keyframes}</style>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-transparent text-white shadow-lg' : 'bg-white text-black'} ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="py-5">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <Link href="/" legacyBehavior>
                <a className="flex items-center gap-2">
                  <Image src={Logo} alt="SmartPaths Logo" height={80} width={80}/>
                </a>
              </Link>
              <button onClick={handleMenuToggle} className="md:hidden">
                <Image src={MenuIcon} alt="Menu Icon" height={24} width={24} />
              </button>
              <nav className={`md:flex gap-6 items-center ${isMenuOpen ? 'block' : 'hidden'}`}>
                <Link href="/about" legacyBehavior>
                  <a className="hover:text-blue-500 transition-colors duration-200">About</a>
                </Link>
                <Link href="/features" legacyBehavior>
                  <a className="hover:text-blue-500 transition-colors duration-200">Features</a>
                </Link>
                <Link href="/updates" legacyBehavior>
                  <a className="hover:text-blue-500 transition-colors duration-200">Updates</a>
                </Link>
                <button 
                  className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight hover:bg-blue-700 transition-colors duration-200"
                  onClick={handleTryForFreeClick}
                >
                  Try for free
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;