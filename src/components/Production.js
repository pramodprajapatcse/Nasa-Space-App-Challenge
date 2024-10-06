// src/components/Production.js

import 'chart.js/auto'; // Automatically registers Chart.js components
import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import './Production.css';

const Production = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch and parse CSV data
  useEffect(() => {
    Papa.parse('/crop_production.csv', { // Ensure this path is correct relative to the public folder
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true, // Skip empty lines
      complete: (results) => {
        console.log('Papa.parse results:', results);
        // Check if data is present
        if (!results.data || results.data.length === 0) {
          setError('No data found in CSV.');
          return;
        }

        // Log each row to identify any missing fields
        results.data.forEach((row, index) => {
          if (!row.State_Name || !row.Crop_Year || !row.Crop || typeof row.Production !== 'number') {
            console.warn(`Row ${index + 1} is missing required fields:`, row);
          }
        });

        // Filter out any empty or malformed rows
        const cleanData = results.data.filter(
          (row) =>
            row.State_Name &&
            row.Crop_Year &&
            row.Crop &&
            typeof row.Production === 'number'
        );
        console.log('Cleaned Data:', cleanData);
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

  // Chart: Total Production by Crop (Bar Chart)
  const totalProductionByCrop = () => {
    const productionByCrop = data.reduce((acc, row) => {
      acc[row.Crop] = (acc[row.Crop] || 0) + row.Production;
      return acc;
    }, {});

    const labels = Object.keys(productionByCrop);
    const production = Object.values(productionByCrop);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Total Production',
          data: production,
          backgroundColor: generateColorArray(labels.length),
          borderColor: generateColorArray(labels.length).map(color => color.replace('0.6', '1')),
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart: Production Trends Over Years (Line Chart)
  const productionTrendsOverYears = () => {
    const productionByYear = data.reduce((acc, row) => {
      acc[row.Crop_Year] = (acc[row.Crop_Year] || 0) + row.Production;
      return acc;
    }, {});

    const sortedYears = Object.keys(productionByYear).sort((a, b) => a - b);
    const production = sortedYears.map(year => productionByYear[year]);

    return {
      labels: sortedYears,
      datasets: [
        {
          label: 'Total Production',
          data: production,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)', // Teal
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          tension: 0.1,
        },
      ],
    };
  };

  // Chart: Production Distribution by Season (Pie Chart)
  const productionBySeason = () => {
    // Assuming 'Season' field contains values like 'Kharif', 'Rabi', etc.
    const productionBySeason = data.reduce((acc, row) => {
      acc[row.Season] = (acc[row.Season] || 0) + row.Production;
      return acc;
    }, {});

    const labels = Object.keys(productionBySeason);
    const production = Object.values(productionBySeason);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Production by Season',
          data: production,
          backgroundColor: generateColorArray(labels.length),
          borderColor: '#ffffff',
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart: Production by State (Bar Chart)
  const productionByState = () => {
    const productionByState = data.reduce((acc, row) => {
      acc[row.State_Name] = (acc[row.State_Name] || 0) + row.Production;
      return acc;
    }, {});

    const labels = Object.keys(productionByState);
    const production = Object.values(productionByState);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Total Production',
          data: production,
          backgroundColor: generateColorArray(labels.length),
          borderColor: generateColorArray(labels.length).map(color => color.replace('0.6', '1')),
          borderWidth: 1,
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
    <div className="production-container">
      <h1 className="main-title">Crop Production Data Visualization</h1>

      <div className="chart-section">
        <h2>Total Production by Crop</h2>
        <Bar
          data={totalProductionByCrop()}
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
                  text: 'Crop',
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Production',
                },
              },
            },
          }}
        />
      </div>

      <div className="chart-section">
        <h2>Production Trends Over Years</h2>
        <Line
          data={productionTrendsOverYears()}
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
                  text: 'Year',
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Production',
                },
              },
            },
          }}
        />
      </div>

      <div className="chart-section">
        <h2>Production Distribution by Season</h2>
        <Pie
          data={productionBySeason()}
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
        <h2>Production by State</h2>
        <Bar
          data={productionByState()}
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
                  text: 'State',
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Production',
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Production;
