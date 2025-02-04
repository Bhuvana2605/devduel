import React from "react";
import { Link } from "react-router-dom";
import Card from "./Card"; // Import the Card component
import '../styles2.css';

function HeroSection() {
  return (
    <section className="flex flex-col lg:flex-row items-start justify-between min-h-screen w-screen bg-black-500">
      <div className="mt-[20px] md:mt-[40px] lg:mt-[60px] ml-[0px] md:ml-[40px] lg:ml-[120px] w-full md:w-[600px] lg:w-[772px] h-auto" style={{ fontFamily: 'sans-serif' }}>
        <h1 className="text-white font-extrabold leading-[50px] md:leading-[67px] lg:leading-[83px] text-[30px] md:text-[50px] lg:text-[70px] uppercase">
          The best <span className="cursor-pointer hover:text-blue-700 transition-colors duration-300">programmers</span><br />are always <span className="text-blue-700">learning</span>
        </h1>
        <Link to="/login">
          <div className="mt-2 bg-white text-black text-sm py-[10px] px-[30px] rounded-[40px] cursor-pointer hover:bg-black-500 hover:text-white transition-colors duration-300 ml-[20px]" style={{ display: 'inline-block' }}>
            Sign Up/Sign In
          </div>
        </Link>
      </div>
      <div className="w-full lg:w-[50%] mt-8 lg:mt-0 lg:ml-8 flex justify-start">
        <Card />
      </div>
    </section>
  );
}

export default HeroSection;