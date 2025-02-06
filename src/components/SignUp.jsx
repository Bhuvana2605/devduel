import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Sign up failed');
      }

      const data = await response.json();
      // Handle successful sign up, e.g., redirect to login page
      console.log('Sign up successful:', data);
      history.push('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Sign up failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-black-500 text-gray-700" style={{ fontFamily: 'sans-serif' }}>
      <h1 className="font-bold text-2xl text-white">Welcome :)</h1>
      <form className="flex flex-col bg-white rounded shadow-lg p-12 mt-8" onSubmit={handleSignUp}>
        <label className="font-semibold text-xs" htmlFor="usernameField">Username or Email</label>
        <input
          className="flex items-center h-12 px-4 w-64 bg-gray-200 mt-2 rounded focus:outline-none focus:ring-2"
          type="text"
          id="usernameField"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="font-semibold text-xs mt-3" htmlFor="passwordField">Password</label>
        <input
          className="flex items-center h-12 px-4 w-64 bg-gray-200 mt-2 rounded focus:outline-none focus:ring-2"
          type="password"
          id="passwordField"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        <button className="flex items-center justify-center h-12 px-6 w-64 bg-blue-600 mt-8 rounded font-semibold text-sm text-white hover:bg-blue-700" type="submit">
          Sign Up
        </button>
        <div className="flex mt-6 justify-center text-lg">
          <Link to="/login" className="text-blue-400 hover:text-blue-700">Go Back</Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
