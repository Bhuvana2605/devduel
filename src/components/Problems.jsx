import React, { useState } from "react";
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

const Problems = () => {
  const [problems, setProblems] = useState([
    { id: 1, name: "Problem 1", difficulty: "Easy", status: "Open", solved: false },
    { id: 2, name: "Problem 2", difficulty: "Medium", status: "Open", solved: false },
    { id: 3, name: "Problem 3", difficulty: "Hard", status: "Closed", solved: false },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSolvedChange = (index) => {
    const newProblems = [...problems];
    newProblems[index].solved = !newProblems[index].solved;
    setProblems(newProblems);
  };

  return (
    <div className="container mx-auto p-4 h-screen" style={{ fontFamily: 'sans-serif' }}>
      <h1 className="text-2xl font-bold mb-4 text-white">Problems</h1>
      {loading ? (
        <Box sx={{ width: 300 }}>
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </Box>
      ) : (
        <>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search problems..."
              className="border rounded-md py-2 px-4 mr-2"
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-500">
              Search
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto w-full max-w-6xl mx-auto text-white border border-white ml-2">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-blue-700 w-1/2 text-left">Name</th>
                  <th className="px-6 py-3 bg-blue-700 text-left">Difficulty</th>
                  <th className="px-6 py-3 bg-blue-700 text-left">Status</th>
                  <th className="px-6 py-3 bg-blue-700 text-left">Solved</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, index) => (
                  <tr key={index} className="hover:bg-gray-800">
                    <td className="px-6 py-3 w-1/2 text-left">
                      <Link to={`/problems/${problem.id}`} className="nav-item cursor-pointer text-white no-underline">
                        {problem.name}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-left">{problem.difficulty}</td>
                    <td className="px-6 py-3 text-left">{problem.status}</td>
                    <td className="px-6 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={problem.solved}
                        onChange={() => handleSolvedChange(index)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Problems;
