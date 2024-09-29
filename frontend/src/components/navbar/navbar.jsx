import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo-2.png';
import './navbar.css';

const Navbar = ({ setAuthenticated, authenticated, handleViewProfile }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false); // State to control AuthForm visibility
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // State to control whether the user is registering
  const [name, setName] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswordIcon, setShowPasswordIcon] = useState(false);

  const toggleRegisterForm = () => {
    setIsRegistering(!isRegistering);
  };

  const handleToggleMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  const toggleAuthForm = () => {
    setShowAuthForm(!showAuthForm);
  };

  const toggleFlag = () => {
    handleToggleMenu();
    toggleAuthForm();
  }


  // Fetch user data when token changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Fetch user data error:", error);
        navigate("/home", { replace: true });
      }
    };
    fetchData();
  }, [navigate]
  );

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/logout", null, {
        withCredentials: true,
      });
      setAuthenticated(false);
      setToggleMenu(false);
      toast.success("Logout successful");
      navigate("/home", { replace: true });
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', { email, password }, { withCredentials: true });
      if (response.status === 200) {
        setAuthenticated(true);
        toggleAuthForm();
        const UserType = response.data.userType;

        setEmail('');
        setPassword('');
        
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

  const renderAuthForm = () => {
    return (
      <div className="auth-form">
        <div className="auth-form_container scale-up-center">
          <button onClick={toggleAuthForm}>X</button>
          <h2>{isRegistering ? 'Register' : 'Login'}</h2>
          {isRegistering ? (
            <>
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="text" placeholder="Aadhar Number" value={aadhar} onChange={(e) => setAadhar(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </>
          ) : (
            <>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
            </>
          )}
          <button onClick={isRegistering ? handleRegister : handleLogin}>
            {isRegistering ? 'Register' : 'Login'}
          </button>
          <p onClick={toggleRegisterForm}>
            {isRegistering ? 'Already have a Account? Login' : 'Create new account'}
          </p>
        </div>
      </div>
    );
  };

  const renderMenu = () => {
    return (
      <div className={`gpt3__navbar-menu ${authenticated ? 'authenticated' : ''}`}>
        <input id="checkbox" type="checkbox" checked={toggleMenu} onChange={handleToggleMenu} />
        <label className="toggle" htmlFor="checkbox"><div className="bars" id="bar1"></div><div className="bars" id="bar2"></div><div className="bars" id="bar3"></div></label>
        {toggleMenu && (
          <div className="gpt3__navbar-menu_container scale-up-center">
            <div className="gpt3__navbar-menu_container-links">
              <p><a href="#home">Home</a></p>
              {authenticated && (
              <p><a onClick={handleViewProfile}>View/Edit Profile</a></p>
              )}
              <p><a href="#features">About Us</a></p>
              {authenticated ? (
                <button type="button" onClick={handleLogout}>Logout</button>
              ) : (
                <button type="button">Sign in</button>
              )}
            </div>
            <div className="gpt3__navbar-menu_container-links-sign">
              {authenticated ? (
                <button type="button" onClick={handleLogout}>Logout</button>
              ) : (
                <button type="button" onClick={toggleFlag}>Sign in</button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">

        {authenticated && (
          <>
         <div className="gpt3__navbar-links_logo">
          <img src={logo} alt="Logo"/>She-Guardians
        </div> 
         {/* <div className="gpt3__navbar-links_container">  //Add if required
          <p><a href="#home">View Bookings</a></p>
          <p><a href="#wgpt3">View Users</a></p>
          <p><a href="#possibility">Add new Location</a></p>
        </div>  */}
        </>
        )} 
      </div>

      <div>
        {authenticated && (
          <>
           <h2 className="gradient__text" id='head'> Welcome {user && user.name}  </h2> 
          </>
        )}
      </div>

      <div className="gpt3__navbar-sign">
        {authenticated ? (
          <button type="button" onClick={handleLogout}>Logout</button>
        ) : (
          <button type="button" onClick={toggleAuthForm}>Sign in</button> 
        )}
      </div>

      {showAuthForm && renderAuthForm()}

      {renderMenu()}

    </div>
  );
};

export default Navbar;
