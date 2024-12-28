import Logo from '../assets/smartpathslogo.png';
import Image from 'next/image';
import SocialX from '../assets/social-x.svg';
import SocialInsta from '../assets/social-insta.svg';
import SocialLinkedIn from '../assets/social-linkedin.svg';
import SocialPin from '../assets/social-pin.svg';
import SocialYoutube from '../assets/social-youtube.svg';

export const Footer = () => {
  return ( 
    <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center">
      <div className="container">
        <nav className="flex flex-col md:flex-row  md:justify-center gap-6 mt-6">
          <a href="#">About</a>
          <a href="#">Features</a>
          <a href="#">Updates</a>
        </nav>
        <div className="flex justify-center gap-6 mt-6">
          <SocialX />
          <SocialInsta />
          <SocialLinkedIn />
          <SocialPin />
          <SocialYoutube />
        </div>
        <p className="mt-6">&copy; 2024 SmartPaths. All rights reserved</p>
      </div>
    </footer>
  );
};
