import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Problems from "./components/Problems";
import Leaderboard from "./components/Leaderboard";
import Admin from "./components/Admin";
import UserProfileCard from "./components/UserProfileCard";
import Testcase from "./components/Testcase"; // Import the Testcase component
import './index.css';

function App() {
  return (
    <Router>
      <div className="bg-black-500 min-h-screen w-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/problems/:id" element={<Testcase />} /> {/* Add the Testcase route */}
          <Route path="/profile" element={<UserProfileCard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;