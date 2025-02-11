import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminPage from "./Adminpage";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      if (data.isAuthenticated) {
        setIsAuthenticated(true);
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <AdminPage />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-black-500 text-gray-700" style={{ fontFamily: 'sans-serif' }}>
      <h1 className="font-bold text-2xl text-white">Admin Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col bg-white rounded shadow-lg p-12 mt-8">
        <label className="font-semibold text-xs" htmlFor="usernameField">Username</label>
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
          {loading ? "Loading..." : "Login"}
        </button>
        <Link to="/" className="text-blue-400 hover:text-blue-700 text-center mt-4">Go Back</Link>
      </form>
    </div>
  );
};

export default Admin;
