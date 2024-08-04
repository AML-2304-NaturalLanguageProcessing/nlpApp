// components/Logo.js
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Logo = ({ size }) => {
  return (
    <Link href="/" legacyBehavior>
      <a className="block">
        {size === 'large' && (
          <div>
            <Image src="/images/feelgoodreads_logo_large.png" alt="Feel Good Reads Logo" width={600} height={600} />
          </div>
        )}
        {size === 'medium' && (
          <div>
            <Image src="/images/feelgoodreads_logo_medium.png" alt="Feel Good Reads Logo" width={300} height={300} />
          </div>
        )}
        {size === 'small' && (
          <div>
            <Image src="/images/feelgoodreads_logo_small.png" alt="Feel Good Reads Logo" width={150} height={150} />
          </div>
        )}
      </a>
    </Link>
  );
};

export default Logo;
