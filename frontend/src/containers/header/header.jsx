import React, { useState } from 'react';
import shLogo from '../../assets/logo-2.png';
import './header.css';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import axios from 'axios';

const Header = ({setAuthenticated, authenticated}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', { email, password }, { withCredentials: true });
      if (response.status === 200) {
        setAuthenticated(true);
        navigateBasedOnUserType(response.data.userType);
      }
    } catch (error) {
      console.error("Error in login submission:", error);
    }
  };

  const navigateBasedOnUserType = (userType) => {
    switch (userType) {
      case 'staff':
        toast.success('Staff Login successful');
        navigate('/sdashboard', { replace: true });
        break;
      case 'admin':
        toast.success('Admin Login successful');
        navigate('/admin', { replace: true });
        break;
      default:
        toast.success('User Login successful');
        navigate('/dashboard', { replace: true });
    }
  };

  if (authenticated) {
    return (
      <div className="gpt3__header section__padding" id="home">
      <div className="gpt3__header-content"></div>
      <div></div>
      </div>
    )
  }

  return (
    <div className="gpt3__header section__padding" id="home">
      <div className="gpt3__header-content">
        <h1 className="gradient__text">Empowering Women on the Go</h1>
        <h2 className="gradient__text">Welcome to 'She-Guardians': Your Safe Haven in the City</h2>
        <p>At 'She-Guardians,' in collaboration with 'Ente Koodu', a government-led movement, we understand the challenges faced by women when traveling for official purposes. Our project provides a safe and welcoming space for women, girls, 
              and boys below 12 years old during their visits to the city.</p>
      </div>
      <div className="gpt3__header-image">
        <img src={shLogo} alt="She-Guardians Logo" />
      </div>
    </div>
  );
};

export default Header;