import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import {toast} from 'react-toastify';
import axios from 'axios';
import './login.css';

const Login = ({ setAuthenticated,toggleLoginForm }) => { // Receive toggleLoginForm as a prop

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordIcon, setShowPasswordIcon] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setShowPasswordIcon(e.target.value.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', { email, password }, { withCredentials: true });
      if (response.status === 200) {
        setAuthenticated(true);
        toggleLoginForm(); // Hide the login form after successful login
        const UserType = response.data.userType;
        
        if ('staff' === UserType) {
          toast.success('Staff Login successful');
          navigate('/sdashboard', { replace: true });
        } else if ('admin' === UserType) {
          toast.success('Admin Login successful');
          navigate('/admin', { replace: true });
        } else {
          toast.success('User Login successful');
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (error) {
      console.error("Error in login submission:", error);
    }
};
  

  return (
    <div >
      <form onSubmit={handleSubmit} >
        <div className="input-group">
          <span className="input-icon">
            <FaUser />
          </span>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <span className="input-icon">
            <FaLock />
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          {showPasswordIcon && (
            <span className="password-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
            </span>
          )}
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        <button id="buttt" className="close-btn" onClick={toggleLoginForm}>
        <FontAwesomeIcon icon={faAnglesLeft} />
      </button>
      </form>
    </div>
  );
};

export default Login;
