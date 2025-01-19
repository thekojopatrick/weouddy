'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const SplashScreen = ({
  onLoadComplete,
}: {
  onLoadComplete: () => void;
}) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Wait for a minimum of 2 seconds before starting fade out
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Give time for fade out animation before calling onLoadComplete
      setTimeout(onLoadComplete, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  return (
    <div
      className={`fixed inset-0 bg-white flex items-center justify-center z-50 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* App Logo/Icon */}
        <div className="w-16 h-16 relative text-center">
          <Image
            src={'/brand/logomark.svg'}
            alt={'WeOuddy'}
            className="object-cover"
            width={60}
            height={60}
          />
        </div>

        {/* Loading indicator */}
        <div className="mt-8">
          <div className="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-black via-zinc-500 to-black w-full animate-loading" />
          </div>
        </div>

        {/* From Meta text */}
        <div className="absolute bottom-8 text-sm text-gray-800">
          from
          <span className="font-semibold ml-1">Weouddy</span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
