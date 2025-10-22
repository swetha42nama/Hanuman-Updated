import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import Ratings from './pages/Ratings';
import AdvanceBooking from './pages/AdvanceBooking';
import TotalDetails from './pages/TotalDetails';
import FarmerDetails from './pages/FarmerDetails';
import AdvanceBookedFarmers from './pages/AdvanceBookedFarmers';
import 'leaflet/dist/leaflet.css';
import Trays from './pages/Trays';
import FarmerTrays from './pages/FarmerTrays';




function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/ratings" element={<Ratings />} />
        <Route path="/advance-booking" element={<AdvanceBooking />} />
        <Route path="/Totaldetails" element={<TotalDetails />} />
        <Route path="/farmer-details" element={<FarmerDetails />} />
        <Route path="/advance-booked-farmers" element={<AdvanceBookedFarmers />} />
        <Route path="/Trays" element={<Trays />} />
        <Route path="/FarmerTrays" element={<FarmerTrays />} /> 
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
