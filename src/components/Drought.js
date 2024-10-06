// src/components/Drought.js

import 'chart.js/auto'; // Automatically registers Chart.js components
import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import './Drought.css';

const Drought = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch and parse CSV data
  useEffect(() => {
    Papa.parse('/county_info_2016.csv', { // Corrected path
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
          if (!row.USPS || !row.NAME || typeof row.ALAND_SQMI !== 'number') {
            console.warn(`Row ${index + 1} is missing required fields:`, row);
          }
        });

        // Filter out any empty or malformed rows
        const cleanData = results.data.filter(
          (row) => row.USPS && row.NAME && typeof row.ALAND_SQMI === 'number'
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

  // Chart: Overall Land vs Water Area (Pie Chart)
  const overallLandWater = () => {
    const totalLand = data.reduce((acc, row) => acc + (row.ALAND_SQMI || 0), 0);
    const totalWater = data.reduce((acc, row) => acc + (row.AWATER_SQMI || 0), 0);

    return {
      labels: ['Land Area (sq mi)', 'Water Area (sq mi)'],
      datasets: [
        {
          data: [totalLand, totalWater],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',   // Teal
            'rgba(54, 162, 235, 0.6)',   // Blue
          ],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart: Top 10 Counties by Land Area (Bar Chart)
  const top10LandArea = () => {
    // Sort data by ALAND_SQMI in descending order and take top 10
    const sortedData = [...data].sort((a, b) => b.ALAND_SQMI - a.ALAND_SQMI).slice(0, 10);
    const labels = sortedData.map((row) => row.NAME);
    const landAreas = sortedData.map((row) => row.ALAND_SQMI);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Land Area (sq mi)',
          data: landAreas,
          backgroundColor: generateColorArray(10),
          borderColor: generateColorArray(10).map(color => color.replace('0.6', '1')),
          borderWidth: 1,
        },
      ],
    };
  };

  // Optional: Additional Charts Based on More Fields
  // For example, a scatter plot of county centroids
  /*
  const countyCentroids = () => {
    const labels = data.map((row) => row.NAME);
    const latitudes = data.map((row) => row.INTPTLAT);
    const longitudes = data.map((row) => row.INTPTLONG);

    return {
      labels: labels,
      datasets: [
        {
          label: 'County Centroids',
          data: latitudes.map((lat, index) => ({ x: longitudes[index], y: lat })),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
      ],
    };
  };
  */

  // Render charts only if data is loaded
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (data.length === 0) {
    return <div className="loading-message">Loading data...</div>;
  }

  return (
    <div className="drought-container">
      <h1 className="main-title">Drought Data Visualization</h1>

      <div className="chart-section">
        <h2>Overall Land vs Water Area</h2>
        <Pie
          data={overallLandWater()}
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
        <h2>Top 10 Counties by Land Area</h2>
        <Bar
          data={top10LandArea()}
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
                  text: 'County',
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Land Area (sq mi)',
                },
              },
            },
          }}
        />
      </div>

      {/* Optional: Additional Charts */}
      {/*
      <div className="chart-section">
        <h2>County Centroids</h2>
        <Scatter
          data={countyCentroids()}
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
                  text: 'Longitude',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Latitude',
                },
              },
            },
          }}
        />
      </div>
      */}
    </div>
  );
};

export default Drought;
