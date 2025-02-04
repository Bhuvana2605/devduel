import React from 'react';

function Leaderboard() {
  const leaderboardData = [
    { rank: 1, userId: 'P1', solvedProblems: '1-5', timeTaken: 'Y/N' },
    { rank: 2, userId: 'P2', solvedProblems: '1-5', timeTaken: 'Y/N' },
    { rank: 3, userId: 'P3', solvedProblems: '1-5', timeTaken: 'Y/N' },
    { rank: 4, userId: 'P4', solvedProblems: '1-5', timeTaken: 'Y/N' },
    { rank: 5, userId: 'P5', solvedProblems: '1-5', timeTaken: 'Y/N' },
    { rank: 6, userId: 'P6', solvedProblems: '1-5', timeTaken: 'Y/N' },
    { rank: 7, userId: 'P7', solvedProblems: '1-5', timeTaken: 'Y/N' },
    { rank: 8, userId: 'P8', solvedProblems: '1-5', timeTaken: 'Y/N' },
    { rank: 9, userId: 'P9', solvedProblems: '1-5', timeTaken: 'Y/N' },
    { rank: 10, userId: 'P10', solvedProblems: '1-5', timeTaken: 'Y/N' },
    { rank: 11, userId: 'P11', solvedProblems: '1-5', timeTaken: 'Y/N' },
    { rank: 12, userId: 'P12', solvedProblems: '1-5', timeTaken: 'Y/N' },
    { rank: 13, userId: 'P13', solvedProblems: '1-5', timeTaken: 'Y/N' },
    { rank: 14, userId: 'P14', solvedProblems: '1-5', timeTaken: 'Y/N' },
    { rank: 15, userId: 'P15', solvedProblems: '1-5', timeTaken: 'Y/N' },
  ];

  return (
    <div className="container mx-auto p-4" style={{ fontFamily: 'sans-serif' }}>
      <h1 className="text-2xl font-bold mb-4 text-white text-center uppercase">Leaderboard</h1>
      <table className="table-auto w-full max-w-6xl mx-auto text-white border border-white" style={{ marginLeft: '40px', marginRight: '40px' }}>
        <thead>
          <tr className="bg-blue-700">
            <th className="py-2 px-4 text-left">Rank</th>
            <th className="py-2 px-4 text-left">User ID</th>
            <th className="py-2 px-4 text-left">Solved Problems</th>
            <th className="py-2 px-4 text-left">Time Taken</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((data, index) => (
            <tr key={index} className="hover:bg-gray-600">
              <td className="py-2 px-4 bg-black text-left">{data.rank}</td>
              <td className="py-2 px-4 bg-black text-left">{data.userId}</td>
              <td className="py-2 px-4 bg-black text-left">{data.solvedProblems}</td>
              <td className="py-2 px-4 bg-black text-left">{data.timeTaken}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;