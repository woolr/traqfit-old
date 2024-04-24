import React from 'react';
import TextField from '@mui/material/TextField';

function MileageTable({ miles, splits, speeds, setSpeeds }) {
  // Calculate the distance of each split and round it to two decimal places
  const splitDistance = (1 / splits).toFixed(2);

  // Function to handle speed change
  const handleSpeedChange = (splitIndex, mileIndex, newValue) => {
    const newSpeeds = speeds.map((split, idx) => {
      if (idx === splitIndex) {
        return split.map((speed, index) => index === mileIndex ? newValue : speed);
      }
      return split;
    });
    setSpeeds(newSpeeds);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Split</th>
          {Array.from({ length: miles }, (_, index) => (
            <th key={index}>Mile {index + 1}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {speeds.map((split, splitIndex) => (
          <tr key={splitIndex}>
            <td>
              <div style={{ textAlign: 'center' }}>Split {splitIndex + 1}</div>
              <div style={{ textAlign: 'center' }}>({splitDistance} miles)</div> {/* Display the rounded distance of each split */}
            </td>
            {split.map((speed, mileIndex) => (
              <td key={mileIndex}>
                <TextField
                  type="number"
                  name={`speeds_${mileIndex}_${splitIndex}`}
                  value={speed}
                  onChange={(e) => handleSpeedChange(splitIndex, mileIndex, e.target.value)}
                  required
                  variant="outlined"
                  inputProps={{ inputMode: 'numeric', style: { paddingRight: '6px', marginBottom: '4px' } }} // Adjust padding and margin
                  sx={{
                    width: '70px', // Set width to 70px
                    height: '70px', // Set height to 70px
                    borderRadius: '4px', // Apply border radius for a square shape

                    border: 'none', // Remove border
                    '& input': {
                      padding: '16px', // Adjust input padding for better appearance
                      backgroundColor: 'transparent', // Remove background color from padding
                    },
                    marginLeft: '8px', // Add marginLeft for horizontal space
                  }}
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
