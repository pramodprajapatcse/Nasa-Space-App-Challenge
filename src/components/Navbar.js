import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">AgriTool</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">


                        <li className="nav-item">
                            <Link className="nav-link" to="/Production">Vegetation Growth</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/AirQuality">Air Quality</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/soil-moisture">Soil Moisture</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/Drought">Drought</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/floods">Trendings</Link>
                        </li>

                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {!token ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;