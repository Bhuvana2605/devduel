import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      // Store user details in localStorage
      localStorage.setItem('user', JSON.stringify(data));
      // Handle successful login, e.g., save token, redirect to dashboard
      console.log('Login successful:', data);
      navigate('/dashboard'); // Redirect to dashboard or another page
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-black-500 text-gray-700" style={{ fontFamily: 'sans-serif' }}>
      {loading ? (
        <Box sx={{ width: 300 }}>
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </Box>
      ) : (
        <>
          <h1 className="font-bold text-2xl text-white">Welcome Back :)</h1>
          <form className="flex flex-col bg-white rounded shadow-lg p-12 mt-8" onSubmit={handleLogin}>
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
            <button className="flex items-center justify-center h-12 px-6 w-64 bg-blue-600 mt-8 rounded font-semibold text-sm text-blue-100 hover:bg-blue-700" type="submit">
              Login
            </button>
            <div className="flex mt-6 justify-center text-sm">
              <Link to="/" className="text-blue-700 hover:text-black-500">Go Back</Link>
              <span className="mx-2 text-gray-300">/</span>
              <Link to="/signup" className="text-blue-700 hover:text-black-500">Sign Up</Link>
              <span className="mx-2 text-gray-300">/</span>
              <Link to="/admin" className="text-blue-700 hover:text-black-500">Admin</Link>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Login;
