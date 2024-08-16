import Image from 'next/image';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-center p-4 mt-8">
      <p>&copy; 2024 Feel Good Reads. All rights reserved.</p>
      <div className="flex justify-center space-x-4 mt-2">
        <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
          <Image 
            src="/images/google-play-badge.png" 
            alt="Google Play" 
            width={130} 
            height={40}
            className="h-auto" 
          />
        </a>
        <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
          <Image 
            src="/images/app-store-badge.png" 
            alt="App Store" 
            width={130} 
            height={38} 
            className="h-auto" 
          />
        </a>
      </div>
      <a href="/about-us" className="text-green-700 mt-4 inline-block">About us</a>
    </footer>
  );
};

export default Footer;
