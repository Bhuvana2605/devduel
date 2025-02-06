import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const AdminPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [functionName, setFunctionName] = useState('');
  const [functionType, setFunctionType] = useState('');
  const [inputs, setInputs] = useState([{ name: '', type: '', id: '' }]);
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '' }]);
  const history = useHistory();

  const handleAddInput = () => {
    setInputs([...inputs, { name: '', type: '', id: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '' }]);
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          functionName,
          functionType,
          inputs,
          testCases,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create problem');
      }

      const data = await response.json();
      console.log('Problem created:', data);
      history.push('/problems'); // Redirect to problems page
    } catch (error) {
      console.error('Error creating problem:', error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4" style={{ fontFamily: 'sans-serif' }}>
      <h1 className="text-2xl font-bold mb-4">Create a New Problem</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="title">Title</label>
          <input
            className="w-full p-2 bg-gray-700 text-white rounded-md"
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="description">Description</label>
          <textarea
            className="w-full p-2 bg-gray-700 text-white rounded-md"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="functionName">Function Name</label>
          <input
            className="w-full p-2 bg-gray-700 text-white rounded-md"
            type="text"
            id="functionName"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="functionType">Function Type</label>
          <input
            className="w-full p-2 bg-gray-700 text-white rounded-md"
            type="text"
            id="functionType"
            value={functionType}
            onChange={(e) => setFunctionType(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Inputs</label>
          {inputs.map((input, index) => (
            <div key={index} className="mb-2">
              <input
                className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                type="text"
                placeholder="Name"
                value={input.name}
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
              />
              <input
                className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                type="text"
                placeholder="Type"
                value={input.type}
                onChange={(e) => handleInputChange(index, 'type', e.target.value)}
              />
              <input
                className="w-full p-2 bg-gray-700 text-white rounded-md"
                type="text"
                placeholder="ID"
                value={input.id}
                onChange={(e) => handleInputChange(index, 'id', e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleAddInput}
          >
            Add Input
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Test Cases</label>
          {testCases.map((testCase, index) => (
            <div key={index} className="mb-2">
              <input
                className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                type="text"
                placeholder="Input"
                value={testCase.input}
                onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
              />
              <input
                className="w-full p-2 bg-gray-700 text-white rounded-md"
                type="text"
                placeholder="Expected Output"
                value={testCase.expectedOutput}
                onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleAddTestCase}
          >
            Add Test Case
          </button>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Create Problem
        </button>
      </form>
    </div>
  );
};

export default AdminPage;
  
