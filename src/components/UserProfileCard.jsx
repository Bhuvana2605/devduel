import React, { useState, useEffect } from 'react';

function UserProfileCard({ onClose }) {
  const [userData, setUserData] = useState({ username: '', rank: '', problemsSolved: 0 });

  useEffect(() => {
    // Replace with your backend API endpoint
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://your-backend-api.com/user');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="fixed top-0 right-0 w-64 h-auto bg-white shadow-lg rounded-l-lg overflow-hidden z-50" style={{ fontFamily: 'sans-serif' }}>
      <div className="px-6 py-4">
        <button onClick={onClose} className="text-gray-700 hover:text-gray-900 float-right">X</button>
        <div className="font-bold text-xl mb-2 text-center">{userData.username}</div>
        <p className="text-gray-700 text-base text-center">
          <span className="font-semibold">Rank:</span> {userData.rank}
        </p>
        <p className="text-gray-700 text-base text-center">
          <span className="font-semibold">Problems Solved:</span> {userData.problemsSolved}
        </p>
      </div>
    </div>
  );
}

export default UserProfileCard;