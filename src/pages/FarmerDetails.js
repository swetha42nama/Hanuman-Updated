import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const FarmerDetails = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFarmers, setExpandedFarmers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const farmersCol = collection(db, 'farmers');
      const snapshot = await getDocs(farmersCol);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFarmers(list);
    } catch (error) {
      console.error('Error fetching farmers:', error);
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
    if (!window.confirm(`Are you sure you want to delete ${farmerName}'s data?`)) return;
    try {
      await deleteDoc(doc(db, 'farmers', farmerId));
      alert(`Deleted data for ${farmerName}`);
      fetchFarmers();
    } catch (error) {
      console.error('Delete farmer error:', error);
      alert('Failed to delete farmer.');
    }
  };

  const filteredFarmers = farmers
    .filter(farmer => {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        farmer.name?.toLowerCase().includes(lowerSearch) ||
        farmer.village?.toLowerCase().includes(lowerSearch) ||
        (farmer.phoneNumbers && farmer.phoneNumbers.some(phone => phone.includes(lowerSearch))) ||
        (farmer.phoneNumber && farmer.phoneNumber.includes(lowerSearch))
      );
    })
    .sort((a, b) => {
      const lowerSearch = searchTerm.toLowerCase();
      const aNameStarts = a.name?.toLowerCase().startsWith(lowerSearch) ? 0 : 1;
      const bNameStarts = b.name?.toLowerCase().startsWith(lowerSearch) ? 0 : 1;
      return aNameStarts - bNameStarts;
    });

  if (loading) return <p>Loading farmers...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
      <h1>Farmers and Their Bookings</h1>
      <input
        type="text"
        placeholder="Search by name, village, or phone number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px', padding: '8px', width: '100%', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      {filteredFarmers.length === 0 ? (
        <p>No farmers found matching search criteria.</p>
      ) : (
        filteredFarmers.map(farmer => {
          const totalBalance = (farmer.bookings || []).reduce(
            (sum, booking) => sum + (booking.balanceToOwner || 0),
            0
          );
          return (
            <div key={farmer.id} style={{ marginBottom: '20px', border: '1px solid #ccc', borderRadius: '6px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div
                style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', color: '#333' }}
                onClick={() => toggleExpand(farmer.id)}
              >
                {farmer.name} ({farmer.village}) - {farmer.bookings?.length || 0} booking(s)
              </div>
              <p style={{ margin: '8px 0', color: '#555' }}>
                Phone: {farmer.phoneNumbers ? farmer.phoneNumbers.join(', ') : farmer.phoneNumber || 'N/A'}
              </p>
              <button
                onClick={() => handleDeleteFarmer(farmer.id, farmer.name)}
                style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer', marginBottom: '10px' }}
              >
                Delete Farmer
              </button>
              {expandedFarmers[farmer.id] && (
                <table border="1" cellPadding="8" style={{ marginTop: '10px', width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead style={{ backgroundColor: '#f8f8f8' }}>
                    <tr>
                      <th style={{ width: '100px' }}>Date</th>
                      <th style={{ width: '100px' }}>Total Saplings</th>
                      <th style={{ width: '100px' }}>Varieties</th>
                      <th style={{ width: '100px' }}>Saplings by Variety</th>
                      <th style={{ width: '100px' }}>Total Cost</th>
                      <th style={{ width: '100px' }}>Advance Paid</th>
                      <th style={{ width: '100px' }}>Current Paid</th>
                      <th style={{ width: '100px' }}>Balance to Owner</th>
                      <th style={{ width: '100px' }}>Total Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmer.bookings?.map((booking, index) => (
                      <tr key={index}>
                        <td style={{ width: '100px' }}>{booking.date}</td>
                        <td style={{ width: '100px' }}>{booking.saplings}</td>
                        <td style={{ width: '100px' }}>{booking.plantVarieties?.map(plant => plant.name).join(', ')}</td>
                        <td style={{ width: '100px' }}>
                          {booking.plantVarieties?.map((plant, idx) => (
                            <div key={idx}>{plant.name}: {plant.saplingsNumber || 'N/A'}</div>
                          ))}
                        </td>
                        <td style={{ width: '100px' }}>{booking.totalCropCost}</td>
                        <td style={{ width: '100px' }}>{booking.advancePaid}</td>
                        <td style={{ width: '100px' }}>{booking.currentPay}</td>
                        <td style={{ width: '100px' }}>{booking.balanceToOwner}</td>
                        <td style={{ width: '100px' }}>{index === 0 ? totalBalance : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default FarmerDetails;
