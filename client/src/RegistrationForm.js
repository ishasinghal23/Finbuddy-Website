import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Registrationstyles.css';
const RegistrationForm = ({ onRegister, onLoginRedirect }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <div className="registration-page-background">
    <div className="registration-form-container">
      <h2 className="registration-title">Registration Page</h2>
      <form className="registration-form" onSubmit={handleRegister}>
        <label className="registration-label">Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="registration-input"
        />
        <br />

        <label className="registration-label">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="registration-input"
        />
        <br />

        <label className="registration-label">Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="registration-input"
        />
        <br />

        <button type="submit" className="registration-button">
          Register
        </button>
      </form>

      <p className="registration-login-link">
        Already registered?{' '}
        <Link to="/login" onClick={onLoginRedirect} className="registration-login-link">
          Login here
        </Link>
      </p>
    </div>
    </div>
  );
};

export default RegistrationForm;
