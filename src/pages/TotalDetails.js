import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // adjust relative path if needed

const TotalDetails = () => {
  const [totalData, setTotalData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'nurseries', 'nurseryData');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTotalData(docSnap.data());
      } else {
        setTotalData(null);
      }
    } catch (error) {
      console.error('Error loading nursery data:', error);
      setTotalData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading total nursery details...</p>;
  if (!totalData) return <p>No nursery data found.</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Total Nursery Details</h1>
      <button onClick={fetchData} style={{ marginBottom: '15px' }}>
        Refresh Total Details
      </button>
      <p>Total Trays Sold: {totalData.traysSold || 0}</p>
      <p>Total Acres Mentioned: {totalData.acresMentioned || 0}</p>
      <p>Total Advance Paid: ₹{totalData.advancePaid || 0}</p>
      <p>Total Current Paid: ₹{totalData.currentPaid || 0}</p>
      <p>Total Crop Cost: ₹{totalData.totalCropCost || 0}</p>
      <p>Total Amount to be Paid: ₹{totalData.totalAmountToBePaid || 0}</p>
      <p>Total Balance to Owner: ₹{totalData.balanceToOwner || 0}</p>
      <p>Total Balance to User: ₹{totalData.balanceToUser || 0}</p>
    </div>
  );
};

export default TotalDetails;
