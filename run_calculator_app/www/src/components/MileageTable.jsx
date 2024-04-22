import React from 'react';

function MileageTable({ miles, chunks, speeds, setSpeeds }) {
  // Calculate the distance of each chunk and round it to two decimal places
  const chunkDistance = (1 / chunks).toFixed(2);

  // Function to handle speed change
  const handleSpeedChange = (chunkIndex, mileIndex, newValue) => {
    const newSpeeds = speeds.map((chunk, idx) => {
      if (idx === chunkIndex) {
        return chunk.map((speed, index) => index === mileIndex ? newValue : speed);
      }
      return chunk;
    });
    setSpeeds(newSpeeds);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Chunk</th>
          {Array.from({ length: miles }, (_, index) => (
            <th key={index}>Mile {index + 1}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {speeds.map((chunk, chunkIndex) => (
          <tr key={chunkIndex}>
            <td>
              <div>Chunk {chunkIndex + 1}</div>
              <div>({chunkDistance} miles)</div> {/* Display the rounded distance of each chunk */}
            </td>
            {chunk.map((speed, mileIndex) => (
              <td key={mileIndex}>
                <input
                  type="number"
                  name={`speeds_${mileIndex}_${chunkIndex}`}
                  value={speed}
                  onChange={e => handleSpeedChange(chunkIndex, mileIndex, e.target.value)}
                  step="0.01"
                  required
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MileageTable;
