import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Split from 'react-split';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike'; // Java mode is included in clike

const Testcase = () => {
  const { id } = useParams(); // Get the problem ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate
  const [code, setCode] = useState(''); // Initial value set to an empty string
  const [language, setLanguage] = useState('javascript');
  const [selectedCase, setSelectedCase] = useState(null);
  const [problemDetails, setProblemDetails] = useState({
    title: '',
    description: '',
    functionName: '',
    returnType: '',
    parameters: [],
    testCases: [],
    userBoilerplate: '',
  });
  const [loading, setLoading] = useState(true);
  const [output, setOutput] = useState(''); // State to store the output from the backend

  useEffect(() => {
    // Fetch problem details from the backend
    const fetchProblemDetails = async () => {
      try {
        const response = await fetch(`/api/problems/${id}`);
        const data = await response.json();
        setProblemDetails({
          title: data.title,
          description: data.description,
          functionName: data.functionName,
          returnType: data.returnType,
          parameters: data.parameters,
          testCases: data.testCases,
          userBoilerplate: data.userBoilerplate,
        });
        setCode(data.userBoilerplate); // Set the initial code to the user boilerplate
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problem details:', error);
        setLoading(false);
      }
    };

    fetchProblemDetails();
  }, [id]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/submit/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        throw new Error('Code submission failed');
      }

      const data = await response.json();
      setOutput(data.output); // Update the output state with the response from the backend
      console.log('Code submitted successfully:', data);
    } catch (error) {
      console.error('Error submitting code:', error);
    }
  };

  const handleCaseClick = (caseNumber) => {
    setSelectedCase(caseNumber);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4" style={{ fontFamily: 'sans-serif' }}>
      {loading ? (
        <Box sx={{ width: 300 }}>
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </Box>
      ) : (
        <Split className="flex h-full" sizes={[50, 50]} minSize={200} gutterSize={10}>
          {/* First Div */}
          <div className="h-full p-4 bg-zinc-800 rounded-lg">
            {/* Navbar */}
            <div className="flex justify-between items-center mb-4 bg-gray-700 p-2 rounded-lg">
              <h2 className="text-xl font-bold">Description</h2>
            </div>
            {/* Problem Heading */}
            <h2 className="text-2xl font-bold mb-2">{problemDetails.title} (ID: {id})</h2>
            {/* Problem Description */}
            <p className="mb-4">{problemDetails.description}</p>
            {/* Function Name */}
            <p className="mb-4"><strong>Function Name:</strong> {problemDetails.functionName}</p>
            {/* Return Type */}
            <p className="mb-4"><strong>Return Type:</strong> {problemDetails.returnType}</p>
            {/* Parameters */}
            <p className="mb-4"><strong>Parameters:</strong></p>
            <ul className="mb-4">
              {problemDetails.parameters.map((param, index) => (
                <li key={index}>{param.name} ({param.type})</li>
              ))}
            </ul>
            {/* Test Cases */}
            <p className="mb-4"><strong>Test Cases:</strong></p>
            <ul className="mb-4">
              {problemDetails.testCases.map((testCase, index) => (
                <li key={index}>Input: {testCase.input}, Output: {testCase.output}</li>
              ))}
            </ul>
          </div>

          {/* Right Panel */}
          <Split direction="vertical" className="flex-1 h-full" sizes={[30, 70]} minSize={100} gutterSize={10}>
            {/* Second Div */}
            <div className="p-4 bg-zinc-800 rounded-lg overflow-y-auto" style={{ maxHeight: '50vh' }}>
              <div className="flex justify-between items-center mb-2">
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="p-2 bg-gray-700 text-white rounded-md"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  
                </select>
                <button
                  onClick={handleSubmit}
                  className="p-2 bg-blue-500 text-white rounded-lg"
                >
                  Submit
                </button>
              </div>
              <div style={{ height: '200px' }}>
                <textarea
                  value={code}
                  onChange={handleCodeChange}
                  className="w-full h-full p-2 bg-gray-700 text-white rounded-md"
                  placeholder="Write your code here..."
                  style={{ resize: 'none' }}
                />
              </div>
            </div>

            {/* Third Div */}
            <div className="p-4 bg-zinc-800 rounded-lg" style={{ height: 'calc(100% - 200px)' }}>
              <div className="bg-gray-700 p-2 rounded-t-lg">
                <h2 className="text-xl font-bold">Testcase</h2>
              </div>
              <div className="p-4">
                {problemDetails.testCases.map((testcase, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full mb-2"
                    onClick={() => handleCaseClick(index + 1)}
                  >
                    Case {index + 1}
                  </button>
                ))}
                {selectedCase && (
                  <>
                    <h3 className="text-xl font-bold mb-2">Nums</h3>
                    <input
                      type="text"
                      placeholder="nums"
                      className="w-full p-2 mb-2 bg-gray-700 text-white rounded-md"
                    />
                    <h3 className="text-xl font-bold mb-2">Tags</h3>
                    <input
                      type="text"
                      placeholder="tags"
                      className="w-full p-2 bg-gray-700 text-white rounded-md"
                    />
                  </>
                )}
              </div>
              {/* Output Section */}
              {output && (
                <div className="bg-gray-700 p-4 rounded-lg mt-4">
                  <h3 className="text-xl font-bold mb-2">Output</h3>
                  <pre className="bg-gray-800 p-2 rounded-md text-white">{output}</pre>
                </div>
              )}
            </div>
          </Split>
        </Split>
      )}
    </div>
  );
};

export default Testcase;
