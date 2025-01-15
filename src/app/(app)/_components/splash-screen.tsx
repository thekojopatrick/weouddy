'use client';

import React, { useEffect, useState } from 'react';

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
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 rounded-xl animate-pulse" />
        </div>

        {/* Loading indicator */}
        <div className="mt-8">
          <div className="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 w-full animate-loading" />
          </div>
        </div>

        {/* From Meta text */}
        <div className="absolute bottom-8 text-sm text-gray-400">
          from
          <span className="font-semibold ml-1">Weouddy</span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
