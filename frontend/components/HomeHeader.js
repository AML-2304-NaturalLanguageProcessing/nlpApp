// components/HomeHeader.js
import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

const HomeHeader = () => {
  return (
    <header className="w-full py-4 px-8 bg-[#F8FFED] flex flex-col items-center">
      <Logo size="medium"/>
      <nav className="absolute top-4 right-4">
        <Link href="/login" legacyBehavior>
          <a className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white">
            Sign In
          </a>
        </Link>
      </nav>
    </header>
  );
};

export default HomeHeader;
