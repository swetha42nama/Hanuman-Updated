import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header-container">
      <div className="nursery-title">
        Sri Hanuman Rythu Mithra Mirchi Nursery
      </div>
      <div className="header-row">
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/services" className="nav-link">Services</Link>          
          <Link to="/advance-booking" className="nav-link">AdvanceBooking</Link>
          <Link to="/booking" className="nav-link">Booking</Link>   
          <Link to="/Trays" className="nav-link">Trays</Link>
          <Link to="/advance-booked-farmers" className="nav-link">AdvancedBookedFarmers</Link>      
          <Link to="/farmer-details" className="nav-link">FarmersData</Link> 
          <Link to="/FarmerTrays" className="nav-link">FarmerTrays</Link>         
          <Link to="/TotalDetails" className="nav-link">TotalDetails</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/ratings" className="nav-link">Ratings</Link>
        </nav>
        
        <div className="logo-container">
          <img src="/images/logo.png" alt="Logo" className="header-img" />
          <img src="/images/vinayaka.png" alt="Nursery" className="header-img" />
        </div>
      </div>
    </header>
  );
};

export default Header;
