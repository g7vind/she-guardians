import React, { useState } from 'react';
import './home.css';

const Home = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
    setShowRegisterForm(false);
  };

  const toggleRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm);
    setShowLoginForm(false);
  };

  return (
    <div className="home">
      <section className={`showcase ${showLoginForm || showRegisterForm ? 'active' : ''}`}>
        <div className="overlay"></div>
        <div className="text">
          <h2>Empowering Women on the Go</h2>
          <h4>Welcome to 'She-Guardians': Your Safe Haven in the City</h4>
          <p>
            At 'She-Guardians,' in collaboration with 'Ente Koodu', a government-led movement, we understand the challenges faced by women when traveling for official purposes. Our project provides a safe and welcoming space for women, girls, 
            and boys below 12 years old during their visits to the city.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;