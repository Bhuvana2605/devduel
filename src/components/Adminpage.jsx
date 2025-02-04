import React, { useState } from 'react';

const AdminPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [functionName, setFunctionName] = useState('');
  const [functionType, setFunctionType] = useState('');
  const [inputs, setInputs] = useState([{ name: '', type: '', id: '' }]);
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '' }]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({ title, description, functionName, functionType, inputs, testCases });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black-500" style={{ fontFamily: 'sans-serif' }}>
      <h1 className="text-2xl font-bold mb-4 text-white">Add Problem here</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="functionName">
            Function Name
          </label>
          <input
            type="text"
            id="functionName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="functionType">
            Function Type
          </label>
          <input
            type="text"
            id="functionType"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            value={functionType}
            onChange={(e) => setFunctionType(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Inputs</label>
          {inputs.map((input, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder="Name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 mb-2"
                value={input.name}
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Type"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 mb-2"
                value={input.type}
                onChange={(e) => handleInputChange(index, 'type', e.target.value)}
              />
              <input
                type="text"
                placeholder="ID"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                value={input.id}
                onChange={(e) => handleInputChange(index, 'id', e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddInput} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2">
            Add Input
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Test Cases</label>
          {testCases.map((testCase, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder="Input"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 mb-2"
                value={testCase.input}
                onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
              />
              <input
                type="text"
                placeholder="Expected Output"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                value={testCase.expectedOutput}
                onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddTestCase} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2">
            Add Test Case
          </button>
        </div>
        <div className="flex justify-center">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPage;