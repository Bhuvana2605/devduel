import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaCode, FaSearch } from 'react-icons/fa';
import UserProfileCard from './UserProfileCard';
import '../styles.css';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleProfileOpen = () => {
    setIsProfileOpen(true);
  };

  const handleProfileClose = () => {
    setIsProfileOpen(false);
  };

  return (
    <nav className="w-full bg-black-500 p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-white" style={{ fontFamily: 'Arial, sans-serif' }}>
        <div className="flex items-center mb-4 md:mb-0">
          <FaCode className="mr-2" />
          <h1 className="text-xl uppercase font-bold">DevDuel</h1>
        </div>
        <div className="flex flex-1 justify-center space-x-4 mb-4 md:mb-0">
          <Link to="/" className="nav-item cursor-pointer text-white no-underline">Home</Link>
          <Link to="/problems" className="nav-item cursor-pointer text-white no-underline">Problems</Link>
          <Link to="/leaderboard" className="nav-item cursor-pointer text-white no-underline">Leaderboard</Link>
        </div>
        <div className="flex items-center ml-2 md:ml-4">
          <div className="relative">
            <input
              type="search"
              className="p-1 pl-3 pr-8 rounded-md border border-white bg-transparent text-white placeholder-white"
              placeholder="Search"
              aria-label="Search"
            />
            <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white" />
          </div>
          <button onClick={handleProfileOpen} className="ml-2 text-xl">
            <FaUserCircle />
          </button>
        </div>
      </div>
      {isProfileOpen && <UserProfileCard onClose={handleProfileClose} />}
    </nav>
  );
};

export default Navbar;