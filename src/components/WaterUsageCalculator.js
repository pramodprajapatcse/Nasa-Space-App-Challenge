import React, { useState } from 'react';
import './WaterUsageCalculator.css'; // Import the CSS for styling

const WaterUsageCalculator = () => {
  const [cropType, setCropType] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [soilType, setSoilType] = useState('');
  const [waterUsage, setWaterUsage] = useState(null);

  const handleCalculate = () => {
    // Simple water usage formula based on dummy values, you can update with a real formula.
    const waterFactor = cropType === 'maize' ? 1.2 : cropType === 'wheat' ? 0.8 : 1;
    const soilFactor = soilType === 'sandy' ? 1.5 : soilType === 'loamy' ? 1 : 0.9;
    const calculatedWaterUsage = farmSize * waterFactor * soilFactor;
    setWaterUsage(calculatedWaterUsage.toFixed(2));
  };

  return (
    <div className="calculator-container">
      <h2>Water Usage Calculator</h2>
      <form className="calculator-form">
        <div className="form-group">
          <label>Crop Type</label>
          <select value={cropType} onChange={(e) => setCropType(e.target.value)}>
            <option value="">Select Crop</option>
            <option value="maize">Maize</option>
            <option value="wheat">Wheat</option>
            <option value="rice">Rice</option>
          </select>
        </div>
        <div className="form-group">
          <label>Farm Size (hectares)</label>
          <input
            type="number"
            value={farmSize}
            onChange={(e) => setFarmSize(e.target.value)}
            placeholder="Enter farm size"
          />
        </div>
        <div className="form-group">
          <label>Soil Type</label>
          <select value={soilType} onChange={(e) => setSoilType(e.target.value)}>
            <option value="">Select Soil Type</option>
            <option value="sandy">Sandy</option>
            <option value="loamy">Loamy</option>
            <option value="clay">Clay</option>
          </select>
        </div>
        <button type="button" className="calculate-btn" onClick={handleCalculate}>
          Calculate
        </button>
      </form>
      {waterUsage && (
        <div className="result">
          <h3>Estimated Water Usage</h3>
          <p>{waterUsage} liters per hectare</p>
        </div>
      )}
    </div>
  );
};

export default WaterUsageCalculator;
