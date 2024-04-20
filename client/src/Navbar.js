import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // Import external CSS file

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const location = useLocation();

  return (
    <nav className="finbuddy-navbar">
      <Link to="/home" className="finbuddy-brand">
        FinBuddy
      </Link>
      <div className="finbuddy-link-container">
        {location.pathname === '/budgeting' && (
          <>
            <Link to="/home" className="finbuddy-link">
              Home
            </Link>
            <Link to="/dashboard" className="finbuddy-link">
              Dashboard
            </Link>
            <Link to="/investment" className="finbuddy-link">
              Investment
            </Link>
          </>
        )}

        {location.pathname === '/dashboard' && (
          <>
            <Link to="/home" className="finbuddy-link">
              Home
            </Link>
            <Link to="/budgeting" className="finbuddy-link">
              Budgeting
            </Link>
            <Link to="/investment" className="finbuddy-link">
              Investment
            </Link>
          </>
        )}

      {location.pathname === '/investment' && (
          <>
            <Link to="/home" className="finbuddy-link">
              Home
            </Link>
            <Link to="/budgeting" className="finbuddy-link">
              Budgeting
            </Link>
            <Link to="/dashboard" className="finbuddy-link">
              Dashboard
            </Link>
          </>
        )}
        {isLoggedIn && (
          <span className="finbuddy-link" onClick={handleLogout} role="button" tabIndex="0">
            Logout
          </span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
