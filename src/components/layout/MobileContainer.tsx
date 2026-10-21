import React from 'react';
import { ToastContainer } from '../common/Toast';

export const MobileContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F6F0FC] flex justify-center text-[#29213A] antialiased">
      {/* Centered mobile-first canvas on desktop; full bleed on mobile */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl min-h-screen bg-[#F6F0FC] flex flex-col relative shadow-2xl shadow-[#8B5FBF]/5 border-x border-[#EDE3F7]/50">
        <ToastContainer />
        <main className="flex-1 flex flex-col pb-24">
          {children}
        </main>
      </div>
    </div>
  );
};
