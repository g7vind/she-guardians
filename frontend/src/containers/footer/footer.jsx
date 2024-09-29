import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import shLogo from '../../assets/logo-2.png';
import axios from "axios";

import './footer.css';

const Footer = ({setAuthenticated, authenticated}) => {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
  
  const FooterContent = ({userType, userName}) => {
    return (
      <>
      {authenticated && userType === "user" &&  (
          <>
            <div className="gpt3__footer-heading">
              <h1 className="gradient__text">Find a safe place to stay {userName} </h1>
            </div>
            <div className="gpt3__footer-btn">
              <div className="gpt3__footer-btn-2">
                <p>Book accommodation Now!</p>
              </div>
            </div>
            <button className="gpt3__footer-btn" data-text="Awesome">
              <span className="gpt3__footer-btn-text">&nbsp;BOOK&nbsp;</span>
              <span aria-hidden="true" className="gpt3__footer-btn-hover-text">&nbsp;BOOK&nbsp;</span>
            </button>
          </>
        )}

        {!authenticated && (
          <>
            <div className="gpt3__footer-heading">
              <h1 className="gradient__text">Do you want to find a safe place to stay</h1>
            </div>
            <div className="gpt3__footer-btn">
              <div className="gpt3__footer-btn-2">
                <p>Register Now for Booking accommodation</p>
              </div>
            </div>
    
            <button className="gpt3__footer-btn" data-text="Awesome">
              <span className="gpt3__footer-btn-text">&nbsp;LOGIN&nbsp;</span>
              <span aria-hidden="true" className="gpt3__footer-btn-hover-text">&nbsp;LOGIN&nbsp;</span>
            </button>
          </>
        )}
      </>
    );
  };

  return (
  <>
  <div className="gpt3__footer section__padding">
    <FooterContent userType={user && user.userType} userName={user && user.name} />
    <br>
    </br>
    <br>
    </br>

    <div className="gpt3__footer-links">
      <div className="gpt3__footer-links_logo">
        <img src={shLogo} alt="gpt3_logo" />
        <p>@2024 SHE-GUARDIANS, <br /> All Rights Reserved</p>
      </div>
      <div className="gpt3__footer-links_div">
        <h4>Links</h4>
        <p>Social Media</p>
        <p>Contact</p>
      </div>
      <div className="gpt3__footer-links_div">
        <h4>Website-Service</h4>
        <p>Terms & Conditions </p>
        <p>Privacy Policy</p>
        <p>Contact</p>
      </div>
      <div className="gpt3__footer-links_div">
        <h4>Get in touch</h4>
        <p>Sample Address</p>
        <p>Ph: 121231332</p>
        <p>datapirates@test.com</p>
      </div>
    </div>

    <div className="gpt3__footer-copyright">
      <p>@2024 SHE-GUARDIANS. All rights reserved.</p>
      <p>DESIGNED BY TEAM DATAPIRATES</p>
    </div>

  </div>
  </>
  );
}

export default Footer;