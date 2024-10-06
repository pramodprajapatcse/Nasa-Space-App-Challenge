// src/pages/Login.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import './login.css'; // Ensure this line imports your CSS

function Login() {
  const navigate = useNavigate();

  // State to hold form data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // State to handle errors
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to backend
      const response = await API.post('/auth/login', {
        username: formData.username,
        password: formData.password,
      });

      if (response.status === 200) {
        // Login successful, store token and navigate to dashboard
        localStorage.setItem('token', response.data.access_token);
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.errors) {
        // Handle validation errors from backend
        const messages = err.response.data.errors.map((error) => error.msg).join(' ');
        setError(messages);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <h2>Login</h2>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" className="btn">Login</button>
        </form>
        <p className="mt-3">
          Don't have an account? <Link to="/register">Register here</Link>.
        </p>
      </div>

      {/* Decorative Farmer Elements */}
      <div className="corn-stalk">
        <div className="corn-leaf"></div>
      </div>
    </div>
  );
}

export default Login;
