import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Controlled as CodeMirror } from 'react-codemirror2';
import Split from 'react-split';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';

const Testcase = () => {
  const { id } = useParams(); // Get the problem ID from the URL
  const [code, setCode] = useState('// Write your code here...');
  const [language, setLanguage] = useState('javascript');

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleSubmit = () => {
    // Handle code submission logic here
    console.log('Code submitted:', code);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4" style={{ fontFamily: 'sans-serif' }}>
      <Split className="flex h-full" sizes={[50, 50]} minSize={200} gutterSize={10}>
        {/* First Div */}
        <div className="h-full overflow-y-scroll p-4 bg-zinc-800 rounded-lg">
          {/* Navbar */}
          <div className="flex justify-between items-center mb-4 bg-gray-700 p-2 rounded-lg">
            <h2 className="text-xl font-bold">Description</h2>
          
          </div>
          {/* Problem Heading */}
          <h2 className="text-2xl font-bold mb-2">Problem Title (ID: {id})</h2>
          {/* Problem Type */}
          <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full mb-4">Easy</span>
          {/* Problem Description */}
          <p className="mb-4">This is the problem description. It provides details about the problem that needs to be solved.</p>
          {/* Examples Section */}
          <h3 className="text-xl font-bold mb-2">Example 1</h3>
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Input:</h4>
            <p>Example input goes here.</p>
            <h4 className="text-lg font-semibold">Output:</h4>
            <p>Example output goes here.</p>
          </div>
          {/* Example 2 Section */}
          <h3 className="text-xl font-bold mb-2">Example 2</h3>
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Input:</h4>
            <p>Example input goes here.</p>
            <h4 className="text-lg font-semibold">Output:</h4>
            <p>Example output goes here.</p>
          </div>
        </div>

        {/* Right Panel */}
        <Split direction="vertical" className="flex-1 h-full" sizes={[30, 70]} minSize={100} gutterSize={10}>
          {/* Second Div */}
          <div className="p-4 bg-zinc-800 rounded-lg overflow-y-scroll">
            <div className="flex justify-between items-center mb-2">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="p-2 bg-gray-700 text-white rounded-md"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="clike">C++</option>
              </select>
              <button
                onClick={handleSubmit}
                className="p-2 bg-blue-500 text-white rounded-lg"
              >
                Submit
              </button>
            </div>
            <CodeMirror
              value={code}
              options={{
                mode: language,
                theme: 'material',
                lineNumbers: true,
              }}
              onBeforeChange={(editor, data, value) => {
                setCode(value);
              }}
            />
          </div>

          {/* Third Div */}
          <div className="p-4 bg-zinc-800 rounded-lg">
            <div className="bg-gray-700 p-2 rounded-t-lg">
              <h2 className="text-xl font-bold">Testcase</h2>
            </div>
            <div className="p-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-full mb-2">Case 1</button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-full mb-4">Case 2</button>
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
            </div>
          </div>
        </Split>
      </Split>
    </div>
  );
};

export default Testcase;