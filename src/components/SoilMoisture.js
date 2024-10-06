// src/components/SoilMoisture.js

import 'chart.js/auto'; // Automatically registers Chart.js components
import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import './SoilMoisture.css';

const SoilMoisture = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch and parse CSV data
  useEffect(() => {
    Papa.parse('/soil-moisture.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        // Filter out any empty or malformed rows
        const cleanData = results.data.filter(
          (row) => row.Study_number && row.PubYear
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
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(199, 199, 199, 0.6)',
      'rgba(83, 102, 255, 0.6)',
      'rgba(255, 99, 255, 0.6)',
      'rgba(99, 255, 132, 0.6)',
    ];
    for (let i = 0; i < numColors; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  };

  // Chart: Publications Over Years
  const publicationsOverYears = () => {
    const publicationsByYear = {};

    data.forEach((row) => {
      const year = row.PubYear;
      if (year) {
        publicationsByYear[year] = (publicationsByYear[year] || 0) + 1;
      }
    });

    const sortedYears = Object.keys(publicationsByYear).sort((a, b) => a - b);
    const counts = sortedYears.map((year) => publicationsByYear[year]);

    return {
      labels: sortedYears,
      datasets: [
        {
          label: 'Number of Publications',
          data: counts,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart: Citations per Study
  const citationsPerStudy = () => {
    const citations = data.map((row) => row.Citations || 0);
    const labels = data.map((row) => `Study ${row.Study_number}`);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Number of Citations',
          data: citations,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart: Publications by Author
  const publicationsByAuthor = () => {
    const authorCounts = {};

    data.forEach((row) => {
      if (row.Authors && typeof row.Authors === 'string') {
        const authors = row.Authors.split(';').map((author) => author.trim());
        authors.forEach((author) => {
          if (author) {
            authorCounts[author] = (authorCounts[author] || 0) + 1;
          }
        });
      }
    });

    const sortedAuthors = Object.keys(authorCounts).sort(
      (a, b) => authorCounts[b] - authorCounts[a]
    );

    // Top 50 authors for clarity
    const topAuthors = sortedAuthors.slice(0, 50);
    const counts = topAuthors.map((author) => authorCounts[author]);

    return {
      labels: topAuthors,
      datasets: [
        {
          label: 'Publications by Author',
          data: counts,
          backgroundColor: generateColorArray(topAuthors.length),
          borderColor: '#fff',
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart: Publications by Source (Journal)
  const publicationsBySource = () => {
    const sourceCounts = {};

    data.forEach((row) => {
      // Safely handle the 'Source' field
      const source =
        row.Source && typeof row.Source === 'string'
          ? row.Source.trim()
          : 'Unknown';

      if (source) {
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      }
    });

    const sortedSources = Object.keys(sourceCounts).sort(
      (a, b) => sourceCounts[b] - sourceCounts[a]
    );

    // Top 10 sources for clarity
    const topSources = sortedSources.slice(0, 10);
    const counts = topSources.map((source) => sourceCounts[source]);

    return {
      labels: topSources,
      datasets: [
        {
          label: 'Number of Publications',
          data: counts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Render charts only if data is loaded
  if (error) {
    return <div className="error">{error}</div>;
  }

  if (data.length === 0) {
    return <div className="loading">Loading data...</div>;
  }

  return (
    <div className="soil-moisture-container">
      <h1>Soil Moisture Research Data Visualization</h1>

      <div className="chart-section">
        <h2>Publications Over Years</h2>
        <Bar
          data={publicationsOverYears()}
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
                  text: 'Publication Year',
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Publications',
                },
              },
            },
          }}
        />
      </div>

      <div className="chart-section">
        <h2>Citations per Study</h2>
        <Bar
          data={citationsPerStudy()}
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
                  text: 'Study Number',
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Citations',
                },
              },
            },
          }}
        />
      </div>

      <div className="chart-section">
        <h2>Publications by Author</h2>
        <Pie
          data={publicationsByAuthor()}
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
        <h2>Publications by Source (Journal)</h2>
        <Bar
          data={publicationsBySource()}
          options={{
            indexAxis: 'y',
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
            scales: {
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Publications',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Journal Source',
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default SoilMoisture;
