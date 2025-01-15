// Loginpage.tsx
import React from 'react';
import googleLogo from "../assets/google-logo.svg";
import mobileBg from "../assets/mobile-bg.svg";
import circlesLogo from "../assets/circles_bg.svg";
import overlayImage from "../assets/overlay-image.svg";
import { NotepadText } from "lucide-react";

const Loginpage: React.FC<{ handleGoogleLogin: () => void }> = ({ handleGoogleLogin }) => {
  return (
    <div className="bg-[#FFF9F9] font-sans min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile Background Image */}
      <div className="md:hidden absolute inset-0">
        <img
          src={mobileBg}
          alt="Mobile Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Left Section */}
      <div className="w-full md:w-1/3 flex flex-col justify-center items-center md:items-start md:justify-center p-10 z-10 min-h-screen md:min-h-0">
        <div className="text-left flex items-center justify-start">
          <NotepadText className="w-8 h-8 text-[#7B1984] mr-2" />
          <h1 className="text-[1.625rem] font-bold text-[#7B1984] font-sans">
            TaskBuddy
          </h1>
        </div>
        <p className="text-gray-500 mb-6">
          Streamline your workflow and track progress effortlessly with our
          all-in-one task management app.
        </p>
        <div className="w-full flex justify-center">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-black text-white flex justify-center items-center px-4 py-2 rounded-[18px] shadow hover:bg-gray-800"
          >
            <img src={googleLogo} alt="Google" className="w-5 h-5 mr-2" />
            Continue with Google
          </button>
        </div>
      </div>

      {/* Right Section with Image */}
      <div className="hidden md:flex w-full md:w-2/3 justify-end items-center relative">
        <img
          src={circlesLogo}
          alt="Circles Background"
          className="max-w-full h-auto"
        />
        <img
          src={overlayImage}
          alt="Overlay"
          className="absolute max-w-full h-auto"
        />
      </div>
    </div>
  );
};

export default Loginpage;