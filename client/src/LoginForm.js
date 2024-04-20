// LoginForm component

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Loginstyles.css';

const LoginForm = ({ onLogin, onRegisterRedirect }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin(formData);
  };

  return (
    <div className='login-bg'>
    <div className="login-form-container">
      <h2 className="login-title">Login Page</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <label className="login-label">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="login-input"
        />
        <br />

        <label className="login-label">Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="login-input"
        />
        <br />

        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      <p className="login-register-link">
        Not registered?{' '}
        <Link to="/register" onClick={onRegisterRedirect} className="login-register-link">
          Register here
        </Link>
      </p>
    </div>
    </div>
  );
};

export default LoginForm;
