// Navbar.tsx
import React from 'react';
import { NotepadText, List, Layout, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore.ts';

type NavbarProps = {
  handleLogout: () => void;
  view: "list" | "board";
  setView: (view: "list" | "board") => void;
};

const Navbar: React.FC<NavbarProps> = ({ handleLogout, view, setView }) => {
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="pt-4 pr-4 pl-4 bg-gray-50 flex justify-between items-start" style={{ paddingTop: '60px' }}>
      <div className="flex flex-col items-start">
        <div className="flex items-center mb-4">
          <NotepadText className="w-8 h-8 text-[#7B1984] mr-2" />
          <h1 className="text-[1.5rem] text-[#7B1984]-600">TaskBuddy</h1> {/* 24px = 1.5rem */}
        </div>
        <div className="mb-4 flex">
          <button
            onClick={() => setView("list")}
            className="flex items-center text-gray-600 hover:text-purple-600 text-[1rem]"
          >
            <div className={`flex items-center px-1 transition-all duration-200 ${
              view === "list" ? "font-bold border-b-2 border-black" : ""
            }`}>
              <List className="w-4 h-4 mr-1" />
              List
            </div>
          </button>
          <button
            onClick={() => setView("board")}
            className="flex items-center ml-4 text-gray-600 hover:text-purple-600 text-[1rem]"
          >
            <div className={`flex items-center px-1 transition-all duration-200 ${
              view === "board" ? "font-bold border-b-2 border-black" : ""
            }`}>
              <Layout className="w-4 h-4 mr-1" />
              Board
            </div>
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex items-center mb-4">
          <img
            src={user?.photoURL || 'https://via.placeholder.com/40'}
            alt="User Avatar"
            className="w-10 h-10 rounded-full mr-2"
          />
          <span className="text-gray-700 text-[1rem]">{user?.displayName || 'User'}</span> {/* 16px = 1rem */}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center text-black text-[0.75rem] hover:text-red-700 w-[108px] h-[40px] rounded-[12px] border border-[#7B198426] bg-[#FFF9F9]" // 12px = 0.75rem
        >
          <LogOut className="w-4 h-4 ml-1" />
          <span className="pl-1">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;