import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaIdCard } from 'react-icons/fa';
import { RiLockPasswordLine, RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import {toast} from 'react-toastify';
import './register.css';

const RegisterForm = ({ toggleRegisterForm }) => { // Receive toggleRegisterForm as a prop
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswordIcon, setShowPasswordIcon] = useState(false);
  

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !password || !email || !aadhar) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/signup', {
        name,
        email,
        aadhar,
        password,
      });

      setSuccessMessage('Registration successful!');
      toast.success('Successfully Registered the user: ' + name);
      setTimeout(() => {
        setName('');
        setPassword('');
        setEmail('');
        setAadhar('');
        // Optionally, redirect the user or perform other actions here
      }, 3000); // 3000 milliseconds = 3 seconds delay
    } catch (error) {
      setError(error.response.data);
      toast.error(error.response.data);
      setSuccessMessage('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setShowPasswordIcon(e.target.value.length > 0);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleRegister} className="login-form login-box">
        <div className="input-group">
          <FaUser className="input-icon" />
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input-group">
          <FaIdCard className="input-icon" />
          <input type="text" placeholder="Aadhar Number" value={aadhar} onChange={(e) => setAadhar(e.target.value)} />
        </div>
        <div className="input-group">
          <RiLockPasswordLine className="input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          {showPasswordIcon && (
            <span className="password-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
            </span>
          )}
        </div>
        <button type="submit" className="login-button">Register</button>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button id="buttt" className="close-btn" onClick={toggleRegisterForm}>
        <FontAwesomeIcon icon={faAnglesLeft} />
      </button>
      </form>
    </div>
  );
};

export default RegisterForm;