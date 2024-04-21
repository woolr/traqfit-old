import React, { useState } from 'react';

function RunConfig() {
  const [miles, setMiles] = useState(3); // Assuming a default value
  const [chunks, setChunks] = useState(1);
  const [speeds, setSpeeds] = useState(Array.from({ length: 1 }, () => Array(miles).fill('')));
  const [responseData, setResponseData] = useState(null);  // State to store the response data

  const addChunk = () => {
    setChunks(chunks + 1);
    setSpeeds([...speeds, Array(miles).fill('')]);
  };

  const removeChunk = () => {
    if (chunks > 1) {
      setChunks(chunks - 1);
      speeds.pop();
      setSpeeds([...speeds]);
    }
  };

  const fillSpeedGrid = (fillSpeed) => {
    const newSpeeds = speeds.map(chunk => chunk.map(() => fillSpeed));
    setSpeeds(newSpeeds);
  };

  const clearSpeedGrid = () => {
    setSpeeds(speeds.map(chunk => chunk.map(() => '')));
  };

  const handleMilesChange = (e) => {
    const newMiles = parseInt(e.target.value, 3);
    if (!isNaN(newMiles) && newMiles > 0) {
      setMiles(newMiles);
      const newSpeeds = speeds.map(chunk => Array(newMiles).fill(''));
      setSpeeds(newSpeeds);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (typeof miles !== 'number' || typeof chunks !== 'number' || !Array.isArray(speeds)) {
      console.error('Invalid data types');
      return;
    }
    if (speeds.some(chunk => !Array.isArray(chunk) || chunk.some(speed => typeof parseFloat(speed) !== 'number'))) {
      console.error('Speeds must be arrays of numbers');
      return;
    }
    const transposeSpeeds = speeds[0].map((_, colIndex) => speeds.map(row => parseFloat(row[colIndex]) || 0));
    const requestBody = JSON.stringify({ miles, chunks, speeds: transposeSpeeds.map(chunk => chunk.map(speed => parseFloat(speed) || 0)) }) // Convert speeds to numbers, defaulting to 0 if conversion fails
    
    fetch('http://localhost:8000/api/calculate_run', {
      method: 'POST',
      body: requestBody,
      headers: {
        'Content-Type': 'application/json' // Ensure this is correctly set
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setResponseData(data);  // Store the data in state
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div>
      <h1>Run Configuration</h1>
      <p>Total miles: {miles}</p>
      <p>Number of chunks: {chunks}</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="milesInput">Total Miles:</label>
        <input type="number" id="milesInput" value={miles} onChange={handleMilesChange} min="1" required />
        
        <label htmlFor="fillSpeed">Enter speed (mph):</label>
        <input type="number" id="fillSpeed" step="0.01" onChange={(e) => fillSpeedGrid(e.target.value)} required />
        
        <button type="button" onClick={clearSpeedGrid}>Clear All</button>
        
        <table>
          <thead>
            <tr>
              <th>Chunk</th>
              {Array.from({ length: miles }, (_, index) => <th key={index}>Mile {index + 1}</th>)}
            </tr>
          </thead>
          <tbody>
            {speeds.map((chunk, chunkIndex) => (
              <tr key={chunkIndex}>
                <td>Chunk {chunkIndex + 1}</td>
                {chunk.map((speed, mileIndex) => (
                  <td key={mileIndex}>
                    <input type="number" name={`speeds_${mileIndex}_${chunkIndex}`} value={speed} onChange={(e) => {
                      const newSpeeds = [...speeds];
                      newSpeeds[chunkIndex][mileIndex] = e.target.value;
                      setSpeeds(newSpeeds);
                    }} step="0.01" required />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit">Calculate</button>
        <button type="button" onClick={addChunk}>Add Chunk</button>
        <button type="button" onClick={removeChunk}>Remove Chunk</button>
      </form>
      {/* Display the response data */}
      {responseData && (
        <div>
          <h2>Results</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default RunConfig;