// components/Header.js
import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

const Header = () => {
  return (
    <header className="w-full py-4 px-8 bg-[#F8FFED] flex justify-between items-center">
      <Logo size="small"/>
      <nav className="flex items-center">
        <Link href="/login" legacyBehavior>
          <a className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white">
            Sign In
          </a>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
