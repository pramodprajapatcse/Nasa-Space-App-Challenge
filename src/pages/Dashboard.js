import axios from 'axios'; // Ensure axios is imported
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import L from 'leaflet';
import React, { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import cities from '../data/cities.json';
import API from '../services/api';

// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState('');
  
  const [markers, setMarkers] = useState([]);
  const [landArea, setLandArea] = useState('');
  const [waterNeeded, setWaterNeeded] = useState(null);

  // Function to fetch location name using reverse geocoding
  const fetchLocationName = async (lat, lon) => {
    try {
      // Use OpenStreetMap Nominatim for reverse geocoding
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          format: 'json',
          lat,
          lon
        }
      });
      if (response.data && response.data.display_name) {
        setLocationName(response.data.display_name);
      } else {
        setLocationName('Unknown Location');
      }
    } catch (err) {
      console.error('Error fetching location name:', err);
      setLocationName('Unknown Location');
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setWeatherData(null);
    setLocationName('');
    setLoading(true);

    if (!latitude || !longitude) {
      setError('Please provide both latitude and longitude');
      setLoading(false);
      return;
    }

    try {
      // Fetch location name
      await fetchLocationName(latitude, longitude);

      // Fetch weather data
      const response = await API.get('/nasa/weather', {
        params: {
          latitude,
          longitude,
          start_date: '20230101',
          end_date: '20231231',
        },
      });

      setWeatherData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = async (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    setError('');
    setWeatherData(null);
    setLocationName('');
    setLoading(true);

    if (cityName === '') {
      setLatitude('');
      setLongitude('');
      setLoading(false);
      return;
    }

    const city = cities.find(c => c.name === cityName);
    if (city) {
      const { latitude: lat, longitude: lon } = city;
      setLatitude(lat);
      setLongitude(lon);

      try {
        // Fetch location name
        await fetchLocationName(lat, lon);

        // Fetch weather data
        const response = await API.get('/nasa/weather', {
          params: {
            latitude: lat,
            longitude: lon,
            start_date: '20230101',
            end_date: '20231231',
          },
        });

        setWeatherData(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Selected city not found');
      setLoading(false);
    }
  };

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
    setMarkers([{ lat, lng }]); // Add marker

    setError('');
    setWeatherData(null);
    setLoading(true);

    try {
      // Fetch location name
      await fetchLocationName(lat, lng);

      // Fetch weather data
      const response = await API.get('/nasa/weather', {
        params: {
          latitude: lat,
          longitude: lng,
          start_date: '20230101',
          end_date: '20231231',
        },
      });

      setWeatherData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click: handleMapClick,
    });

    return markers.map((position, idx) => (
      <Marker key={idx} position={position}></Marker>
    ));
  };

  const renderChart = () => {
    if (!weatherData) return null;

    const data = weatherData.properties.parameter;

    const dates = Object.keys(data.T2M).slice(-30); // Last 30 days for better visualization
    const temperatures = Object.values(data.T2M).slice(-30);
    const precipitation = Object.values(data.PRECTOTCORR).slice(-30);

    const temperatureData = {
      labels: dates,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperatures,
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
        },
      ],
    };

    const precipitationData = {
      labels: dates,
      datasets: [
        {
          label: 'Precipitation (mm)',
          data: precipitation,
          borderColor: 'rgba(153,102,255,1)',
          fill: false,
        },
      ],
    };

    return (
      <div>
        <Row>
          <Col md={6}>
            <h4 className="mt-4">Temperature Over Time (Last 30 Days)</h4>
            <Line data={temperatureData} />
          </Col>
          <Col md={6}>
            <h4 className="mt-4">Precipitation Over Time (Last 30 Days)</h4>
            <Line data={precipitationData} />
          </Col>
        </Row>
        {/* Add more charts as needed */}
      </div>
    );
  };

  // Function to calculate water needed
  const calculateWaterNeeded = (area) => {
    // Assuming an average of 500 liters of water per square meter for crops
    const waterPerSquareMeter = 500; 
    return area * waterPerSquareMeter; 
  };

  const handleWaterCalculatorSubmit = (e) => {
    e.preventDefault();
    if (!landArea) {
      setWaterNeeded(null);
      return;
    }
    const neededWater = calculateWaterNeeded(landArea);
    setWaterNeeded(neededWater);
  };

  return (
    <Container className="mt-5" style={{ backgroundImage: "url('/path/to/your/texture.png')", backgroundSize: 'cover' }}>
      <h2>Dashboard</h2>

      <Row className="mt-4">
        <Col md={4}>
          <Card>
            <Card.Header>Manual Location Entry</Card.Header>
            <Card.Body>
              <Form onSubmit={handleManualSubmit}>
                <Form.Group className="mb-3" controlId="latitude">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="Enter latitude (e.g., 30.7488819)"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="longitude">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="Enter longitude (e.g., 76.64135809999993)"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Fetching...' : 'Get Weather Data'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>Select City</Card.Header>
            <Card.Body>
              <Form.Select value={selectedCity} onChange={handleCitySelect}>
                <option value="">Select a city...</option>
                {cities.map((city, index) => (
                  <option key={index} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </Form.Select>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>Map</Card.Header>
            <Card.Body>
              <MapContainer center={[20, 0]} zoom={2} style={{ height: '300px', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
              </MapContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {loading && <Spinner animation="border" className="mt-3" />}

      {weatherData && (
        <div>
          <h3 className="mt-4">Weather Data for {locationName}</h3>
          {renderChart()}
        </div>
      )}

      <Card className="mt-5">
        <Card.Header>Water Calculator</Card.Header>
        <Card.Body>
          <Form onSubmit={handleWaterCalculatorSubmit}>
            <Form.Group className="mb-3" controlId="landArea">
              <Form.Label>Land Area (in square meters)</Form.Label>
              <Form.Control
                type="number"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                placeholder="Enter land area"
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Calculate Water Needed
            </Button>
          </Form>
          {waterNeeded !== null && (
            <Alert variant="success" className="mt-3">
              You will need approximately {waterNeeded} liters of water.
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Dashboard;
