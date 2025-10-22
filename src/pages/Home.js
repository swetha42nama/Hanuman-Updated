import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      {/* 🌿 Hero Section */}
      <div className="hero-section">
        <img
          src="/images/nursery-home.png"
          alt="Mirchi Nursery"
          className="hero-image"
        />
        <div className="hero-text">
          <h1>Welcome to Hanuman Rythu mithra Mirchi Nursery 🌶️</h1>
          <p>
            Explore a wide variety of high-quality Mirchi saplings.  
            Book your crops, pre-order in advance, and grow your farm with us.
          </p>
          <Link to="/booking" className="btn">Book Now</Link>
        </div>
      </div>

      {/* 🌱 About Section */}
      <div className="about-section">
        <h2>Why Choose Mirchi Nursery?</h2>
        <p>
          We specialize in growing healthy and high-yield Mirchi saplings.
          Our nursery offers varieties like <strong>Arjun, Keerthi, Red Hot, Mahyco, Yeshaswini</strong> and more,
          all nurtured with care and delivered fresh to your farm.
        </p>
        <Link to="/services" className="btn-secondary">View Varieties</Link>
      </div>
    </div>
  );
};

export default Home;
