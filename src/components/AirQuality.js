// src/components/AirQuality.js

import 'chart.js/auto'; // Automatically registers Chart.js components
import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import './AirQuality.css';

const AirQuality = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch and parse CSV data
  useEffect(() => {
    Papa.parse('/city_day.csv', { // Ensure this path is correct relative to the public folder
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        // Filter out any empty or malformed rows
        const cleanData = results.data.filter(
          (row) => row.City && row.Date
        );
        setData(cleanData);
      },
      error: (err) => {
        console.error('Error parsing CSV:', err);
        setError('Failed to load data.');
      },
    });
  }, []);

  // Function to generate colors for charts
  const generateColorArray = (numColors) => {
    const colors = [];
    const baseColors = [
      'rgba(75, 192, 192, 0.6)',   // Teal
      'rgba(153, 102, 255, 0.6)',  // Purple
      'rgba(255, 159, 64, 0.6)',   // Orange
      'rgba(54, 162, 235, 0.6)',   // Blue
      'rgba(255, 99, 132, 0.6)',   // Pink
      'rgba(255, 206, 86, 0.6)',   // Yellow
      'rgba(201, 203, 207, 0.6)',  // Grey
      'rgba(83, 102, 255, 0.6)',   // Light Blue
      'rgba(255, 99, 255, 0.6)',   // Magenta
      'rgba(99, 255, 132, 0.6)',   // Light Green
    ];
    for (let i = 0; i < numColors; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  };

  // Chart: AQI Over Time
  const aqiOverTime = () => {
    const dates = data.map((row) => row.Date);
    const aqiValues = data.map((row) => row.AQI || 0);

    return {
      labels: dates,
      datasets: [
        {
          label: 'AQI',
          data: aqiValues,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)', // Teal
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          tension: 0.1,
        },
      ],
    };
  };

  // Chart: PM2.5 and PM10 Levels
  const pmLevels = () => {
    const dates = data.map((row) => row.Date);
    const pm25 = data.map((row) => row['PM2.5'] || 0);
    const pm10 = data.map((row) => row['PM10'] || 0);

    return {
      labels: dates,
      datasets: [
        {
          label: 'PM2.5',
          data: pm25,
          borderColor: 'rgba(255, 99, 132, 1)', // Pink
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          fill: false,
        },
        {
          label: 'PM10',
          data: pm10,
          borderColor: 'rgba(54, 162, 235, 1)', // Blue
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          fill: false,
        },
      ],
    };
  };

  // Chart: AQI Distribution
  const aqiDistribution = () => {
    const aqiBuckets = {};

    data.forEach((row) => {
      const bucket = row.AQI_Bucket || 'Unknown';
      aqiBuckets[bucket] = (aqiBuckets[bucket] || 0) + 1;
    });

    const labels = Object.keys(aqiBuckets);
    const counts = Object.values(aqiBuckets);

    return {
      labels: labels,
      datasets: [
        {
          label: 'AQI Distribution',
          data: counts,
          backgroundColor: generateColorArray(labels.length),
          borderColor: '#fff',
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart: Gas Concentrations Over Time
  const gasConcentrations = () => {
    const dates = data.map((row) => row.Date);
    const no = data.map((row) => row.NO || 0);
    const no2 = data.map((row) => row.NO2 || 0);
    const nox = data.map((row) => row.NOx || 0);
    const nh3 = data.map((row) => row.NH3 || 0);
    const co = data.map((row) => row.CO || 0);
    const so2 = data.map((row) => row.SO2 || 0);
    const o3 = data.map((row) => row.O3 || 0);
    const benzene = data.map((row) => row.Benzene || 0);
    const toluene = data.map((row) => row.Toluene || 0);
    const xylene = data.map((row) => row.Xylene || 0);

    return {
      labels: dates,
      datasets: [
        {
          label: 'NO',
          data: no,
          borderColor: 'rgba(255, 99, 132, 1)', // Pink
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          fill: false,
        },
        {
          label: 'NO2',
          data: no2,
          borderColor: 'rgba(54, 162, 235, 1)', // Blue
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          fill: false,
        },
        {
          label: 'NOx',
          data: nox,
          borderColor: 'rgba(255, 206, 86, 1)', // Yellow
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          fill: false,
        },
        {
          label: 'NH3',
          data: nh3,
          borderColor: 'rgba(75, 192, 192, 1)', // Teal
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          fill: false,
        },
        {
          label: 'CO',
          data: co,
          borderColor: 'rgba(153, 102, 255, 1)', // Purple
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          fill: false,
        },
        {
          label: 'SO2',
          data: so2,
          borderColor: 'rgba(255, 159, 64, 1)', // Orange
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          fill: false,
        },
        {
          label: 'O3',
          data: o3,
          borderColor: 'rgba(255, 99, 255, 1)', // Magenta
          backgroundColor: 'rgba(255, 99, 255, 0.6)',
          fill: false,
        },
        {
          label: 'Benzene',
          data: benzene,
          borderColor: 'rgba(99, 255, 132, 1)', // Light Green
          backgroundColor: 'rgba(99, 255, 132, 0.6)',
          fill: false,
        },
        {
          label: 'Toluene',
          data: toluene,
          borderColor: 'rgba(255, 206, 86, 1)', // Yellow
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          fill: false,
        },
        {
          label: 'Xylene',
          data: xylene,
          borderColor: 'rgba(75, 192, 192, 1)', // Teal
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          fill: false,
        },
      ],
    };
  };

  // Render charts only if data is loaded
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (data.length === 0) {
    return <div className="loading-message">Loading data...</div>;
  }

  return (
    <div className="air-quality-container">
      <h1 className="main-title">Air Quality Data Visualization</h1>

      <div className="chart-section">
        <h2>AQI Over Time</h2>
        <Line
          data={aqiOverTime()}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date',
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'AQI',
                },
              },
            },
          }}
        />
      </div>

      <div className="chart-section">
        <h2>PM2.5 and PM10 Levels Over Time</h2>
        <Line
          data={pmLevels()}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: false },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date',
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Concentration (µg/m³)',
                },
              },
            },
          }}
        />
      </div>

      <div className="chart-section">
        <h2>AQI Distribution</h2>
        <Pie
          data={aqiDistribution()}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'right' },
              title: { display: false },
            },
          }}
        />
      </div>

      <div className="chart-section">
        <h2>Gas Concentrations Over Time</h2>
        <Line
          data={gasConcentrations()}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date',
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Concentration (µg/m³)',
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AirQuality;
