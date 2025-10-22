import React from 'react';
import NurseryLeafletMap from '../components/NurseryLeafletMap'; // Adjust path accordingly

const Contact = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Contact Us</h1>
      <p><strong>Proprietor:</strong> Mr.B.Arjun Rao</p>
      <p><strong>Phone:</strong> +91 8500060763 , 9492262763</p>
      <p><strong>Email:</strong> arjunbrahmasani@gmail.com</p>
      <p><strong>Address:</strong> Daruka Banjara, kalluru(m), khammam(d)</p>

      <h2>Our Nursery Location</h2>
      <NurseryLeafletMap />
    </div>
  );
};

export default Contact;
