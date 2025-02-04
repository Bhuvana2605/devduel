import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-black-500 text-gray-700" style={{ fontFamily: 'sans-serif' }}>
      <h1 className="font-bold text-2xl text-white">Welcome Back :)</h1>
      <form className="flex flex-col bg-white rounded shadow-lg p-12 mt-8">
        <label className="font-semibold text-xs" htmlFor="usernameField">Username or Email</label>
        <input className="flex items-center h-12 px-4 w-64 bg-gray-200 mt-2 rounded focus:outline-none focus:ring-2" type="text" id="usernameField" />
        <label className="font-semibold text-xs mt-3" htmlFor="passwordField">Password</label>
        <input className="flex items-center h-12 px-4 w-64 bg-gray-200 mt-2 rounded focus:outline-none focus:ring-2" type="password" id="passwordField" />
        <button className="flex items-center justify-center h-12 px-6 w-64 bg-blue-600 mt-8 rounded font-semibold text-sm text-blue-100 hover:bg-blue-700">Login</button>
        <div className="flex mt-6 justify-center text-sm">
          <Link to="/" className="text-blue-700 hover:text-black-500">Go Back</Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link to="/signup" className="text-blue-700 hover:text-black-500">Sign Up</Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link to="/admin" className="text-blue-700 hover:text-black-500">Admin</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;