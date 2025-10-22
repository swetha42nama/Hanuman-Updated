import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const AdvanceBookedFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFarmers, setExpandedFarmers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const farmersCol = collection(db, 'advanceBookedFarmers');
      const snapshot = await getDocs(farmersCol);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFarmers(list);
    } catch (error) {
      console.error('Error fetching advance booked farmers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const toggleExpand = (farmerId) => {
    setExpandedFarmers(prev => ({ ...prev, [farmerId]: !prev[farmerId] }));
  };

  const handleDeleteFarmer = async (farmerId, farmerName) => {
    if (!window.confirm(`Delete all bookings for ${farmerName}?`)) return;
    try {
      await deleteDoc(doc(db, 'advanceBookedFarmers', farmerId));
      alert('Deleted successfully');
      fetchFarmers();
    } catch (err) {
      alert('Delete failed');
      console.error(err);
    }
  };

  const filteredFarmers = farmers
    .filter(f => {
      const s = searchTerm.toLowerCase();
      return (
        f.name?.toLowerCase().includes(s) ||
        f.village?.toLowerCase().includes(s) ||
        f.phoneNumber?.includes(s)
      );
    })
    .sort((a, b) => {
      const s = searchTerm.toLowerCase();
      const aName = a.name?.toLowerCase() || '';
      const bName = b.name?.toLowerCase() || '';
      if (aName.startsWith(s)) return -1;
      if (bName.startsWith(s)) return 1;
      return 0;
    });

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: 'auto' }}>
      <div style={{ marginBottom: 15 }}>
        <Link to="/advance-booking" style={{ textDecoration: 'underline', color: 'blue' }}>
          Go to Advance Booking
        </Link>
      </div>

      <h1>Advance Booked Farmers</h1>

      <input
        type="text"
        placeholder="Search by name, village, or phone number"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: '100%', marginBottom: 20, padding: 8, borderRadius: 4, border: '1px solid #ccc', fontSize: 16 }}
      />

      {filteredFarmers.length === 0 ? (
        <p>No farmers matching your search.</p>
      ) : (
        filteredFarmers.map(farmer => (
          <div key={farmer.id} style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 15,
            marginBottom: 20,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <div
              style={{ cursor: 'pointer', fontWeight: 'bold', color: '#004d40', fontSize: 18 }}
              onClick={() => toggleExpand(farmer.id)}
            >
              {farmer.name} (Father: {farmer.fatherName || 'N/A'}) - Phone: {farmer.phoneNumber}
            </div>
            <p style={{ color: '#666' }}>Village: {farmer.village || 'N/A'}</p>

            <button
              onClick={() => handleDeleteFarmer(farmer.id, farmer.name)}
              style={{
                backgroundColor: '#e53935',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '8px',
                marginBottom: '15px',
              }}
            >
              Delete All Bookings
            </button>

            {expandedFarmers[farmer.id] && (
              <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#e0f2f1' }}>
                  <tr>
                    <th style={{ width: '150px' }}>Date</th>
                    <th style={{ width: '120px' }}>Total Saplings</th>
                    <th>Plant Varieties</th>
                    <th style={{ width: '180px' }}>Saplings by Variety</th>
                    <th style={{ width: '120px' }}>Trays Needed</th>
                    <th style={{ width: '120px' }}>Bonus Trays</th>
                    <th style={{ width: '120px' }}>Total Trays</th>
                    <th style={{ width: '140px' }}>Total Cost</th>
                    <th style={{ width: '140px' }}>Advance Paid</th>
                    <th style={{ width: '140px' }}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {farmer.bookings?.map((booking, i) => (
                    <tr key={i}>
                      <td style={{ width: '150px' }}>{booking.date}</td>
                      <td style={{ width: '120px' }}>{booking.totalSaplings}</td>
                      <td>{booking.plantDetails?.map(p => p.name).join(', ')}</td>
                      <td style={{ width: '180px' }}>
                        {booking.plantDetails?.map((p, idx) => (
                          <div key={idx}>{p.name}: {p.saplingsNumber}</div>
                        ))}
                      </td>
                      <td style={{ width: '120px' }}>{booking.traysNeeded}</td>
                      <td style={{ width: '120px' }}>{booking.bonusTrays}</td>
                      <td style={{ width: '120px' }}>{booking.totalTrays}</td>
                      <td style={{ width: '140px' }}>₹{booking.totalCropCost}</td>
                      <td style={{ width: '140px' }}>₹{booking.advancePaid}</td>
                      <td style={{ width: '140px' }}>{booking.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdvanceBookedFarmers;
