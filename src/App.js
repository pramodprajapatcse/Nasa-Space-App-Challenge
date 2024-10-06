// client/src/App.js

import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AirQuality from './components/AirQuality';
import Drought from './components/Drought';
import Navbar from './components/Navbar';
import Production from './components/Production';
import SoilMoisture from './components/SoilMoisture';
import Dashboard from './pages/Dashboard'; // Import Dashboard
import Login from './pages/Login';
import Register from './pages/Register';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} /> {/* Default Route */}
        <Route path="/soil-moisture" element={<SoilMoisture />} />
        <Route path="/AirQuality" element={<AirQuality/>} />
        <Route path="/drought" element={<Drought />} />
        <Route path="/production" element={<Production />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </Router>
    
  );
}

export default App;
