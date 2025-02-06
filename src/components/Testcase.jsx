import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Split from 'react-split';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike'; // Java mode is included in clike

const Testcase = () => {
  const { id } = useParams(); // Get the problem ID from the URL
  const [code, setCode] = useState(''); // Initial value set to an empty string
  const [language, setLanguage] = useState('javascript');
  const [selectedCase, setSelectedCase] = useState(null);
  const [problemDetails, setProblemDetails] = useState({
    title: '',
    description: '',
    examples: [],
    testcases: [],
    difficulty: '',
  });

  useEffect(() => {
    // Fetch problem details from the backend
    const fetchProblemDetails = async () => {
      try {
        const response = await fetch(`/api/problems/${id}`);
        const data = await response.json();
        setProblemDetails({
          title: data.title,
          description: data.description,
          examples: data.examples,
          testcases: data.testcases,
          difficulty: data.difficulty,
        });
      } catch (error) {
        console.error('Error fetching problem details:', error);
      }
    };

    fetchProblemDetails();
  }, [id]);

  useEffect(() => {
    // Fetch boilerplate code from the backend
    const fetchBoilerplateCode = async () => {
      try {
        const response = await fetch(`/api/boilerplate/${language}`);
        const data = await response.json();
        setCode(data.boilerplate);
      } catch (error) {
        console.error('Error fetching boilerplate code:', error);
      }
    };

    fetchBoilerplateCode();
  }, [language]);

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
      <Split className="flex h-full" sizes={[50, 50]} minSize={200} gutterSize={10}>
        {/* First Div */}
        <div className="h-full p-4 bg-zinc-800 rounded-lg">
          {/* Navbar */}
          <div className="flex justify-between items-center mb-4 bg-gray-700 p-2 rounded-lg">
            <h2 className="text-xl font-bold">Description</h2>
          </div>
          {/* Problem Heading */}
          <h2 className="text-2xl font-bold mb-2">{problemDetails.title} (ID: {id})</h2>
          {/* Problem Type */}
          <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full mb-4">{problemDetails.difficulty}</span>
          {/* Problem Description */}
          <p className="mb-4">{problemDetails.description}</p>
          {/* Examples Section */}
          {problemDetails.examples.map((example, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-bold mb-2">Example {index + 1}</h3>
              <h4 className="text-lg font-semibold">Input:</h4>
              <p>{example.input}</p>
              <h4 className="text-lg font-semibold">Output:</h4>
              <p>{example.output}</p>
            </div>
          ))}
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
                <option value="clike">C++</option>
                <option value="java">Java</option>
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
              {problemDetails.testcases.map((testcase, index) => (
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
          </div>
        </Split>
      </Split>
    </div>
  );
};

export default Testcase;
