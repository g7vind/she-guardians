import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate,Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import { useAuthContext } from './context/AuthContext';


import {Home, Dashboard, SDashboard, AdminDashboard} from './components';

const AuthenticatedRoutes = ({setAuthenticated, authenticated}) => {
  
  const {authUser} = useAuthContext();
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Now used within the context of <Router>

  useEffect(() => {
    if (location.pathname !== "/" && location.pathname !== "/home") {
      const checkAuthentication = async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/user', { withCredentials: true });
          if (response.status === 200) {
            setAuthenticated(true);
          }
        } catch (error) {
          console.error('Authentication check error:', error);
          toast.error('Please login to continue');
        } finally {
          setLoading(false);
        }
      };
      checkAuthentication();
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  if (loading) {
    return <div>
      <span className="loading loading-infinity loading-lg">Loading...</span>
    </div>;
  }

  return (
    <>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        
        {/* 
        <Route path="/sdashboard" element={authUser && authUser.userType==="staff" ? <SDashboard /> : <Navigate to={'/home'}/>}
        <Route path="/dashboard" element={authUser && authUser.userType==="user"? <Dashboard /> : <Navigate to={'/home'}/>} />
        <Route path="/admin" element={authUser && authUser.userType==="admin"? <AdminDashboard /> : <Navigate to={'/home'}/>} /> 
        */}
        
        <Route path="/sdashboard" element={authenticated ? <SDashboard setAuthenticated={setAuthenticated}  /> : <Home/>}/>
        <Route path="/dashboard" element={authenticated ? <Dashboard setAuthenticated={setAuthenticated} /> : <Home />}/>
        <Route path="/admin" element={authenticated ? <AdminDashboard setAuthenticated={setAuthenticated}  /> : <Home />}/>
      
      </Routes>
      <ToastContainer theme='dark' />
    </>
  );
}

export default AuthenticatedRoutes;