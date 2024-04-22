import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const RunningData = ({ data }) => {
  const { total_distance, total_time, pace, miles, chunks, speeds } = data;

  const getSpeedData = () => {
    let labels = [];
    let dataset = [];
    for (let mile = 0; mile < miles; mile++) {
      labels.push(`Mile ${mile + 1}`);
      dataset.push(speeds[mile].reduce((a, b) => a + b, 0) / chunks);
    }
    return {
      labels,
      datasets: [
        {
          label: 'Average Speed per Mile',
          data: dataset,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    };
  };

  return (
    <div>
      <h1>Run Summary</h1>
      <ul>
        <li>Total Distance: {total_distance} miles</li>
        <li>Total Time: {total_time} minutes</li>
        <li>Average Pace: {pace} min/mile</li>
      </ul>
      <div>
        <Bar data={getSpeedData()} options={{ plugins: { legend: { display: true } }, responsive: true }} />
      </div>
    </div>
  );
};

export default RunningData;
