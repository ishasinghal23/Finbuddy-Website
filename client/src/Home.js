// Dashboard.js
import React from 'react';
import homeBg from './homebg2.png'; // Make sure to import your image file
import { Link } from 'react-router-dom';
import './Home.css'; // Import the CSS file

const Home = ({ handleLogout }) => {
  return (
    <div className="dashboard" style={{ backgroundImage: `url(${homeBg})` }}>
      <div className="link-container">
        <div className="link left-link">
          <Link to="/budgeting" className="dashboard-link">
            Let's Get Budgeting
            <br />
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
        <div className="link right-link" >
          <Link to="/investment" className="dashboard-link">
            Investment Ideas
            <br />
            <i className="fas fa-arrow-left"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
