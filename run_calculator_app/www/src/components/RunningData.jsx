import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const RunningData = ({ data }) => {
  const { total_distance, total_time, pace, miles, chunks, speeds } = data;

  const formatTotalTime = () => {
    const hours = Math.floor(total_time / 60);
    const minutes = Math.floor(total_time % 60);
    const remainingSeconds = Math.round((total_time - Math.floor(total_time)) * 60);

    let formattedTime = '';

    if (hours > 0) {
      formattedTime += `${hours} hour${hours > 1 ? 's' : ''} `;
    }

    formattedTime += `${minutes} minute${minutes !== 1 ? 's' : ''}`;

    if (remainingSeconds > 0) {
      formattedTime += ` ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    }

    return formattedTime.trim();
  };

  const formatAveragePace = () => {
    return pace.toFixed(2);
  };

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
        <li>Total Time: {formatTotalTime()}</li>
        <li>Average Pace: {formatAveragePace()} mph</li>
      </ul>
      <div>
        <Bar data={getSpeedData()} options={{ plugins: { legend: { display: true } }, responsive: true }} />
      </div>
    </div>
  );
};

export default RunningData;
