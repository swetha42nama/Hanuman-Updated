import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const FarmerTrays = () => {
  const [trays, setTrays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTrays = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'farmerTrays'));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrays(list);
    } catch (err) {
      console.error('Error fetching trays:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrays();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteDoc(doc(db, 'farmerTrays', id));
        setTrays(prev => prev.filter(tray => tray.id !== id));
      } catch (error) {
        alert("Failed to delete record");
        console.error(error);
      }
    }
  };

  if (loading) return <p>Loading tray data...</p>;

  // Filter trays by search query (name)
  const filteredTrays = trays.filter(tray =>
    tray.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ overflowX: 'auto', maxWidth: 1200, margin: 'auto', padding: 20 }}>
      <h1>Farmer Trays Data</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by Name"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{ padding: 8, width: '100%', marginBottom: 20 }}
      />

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f0f0f0' }}>
          <tr>
            <th>Name</th>
            <th>Village</th>
            <th>Phone Number</th>
            <th>Type of Seed</th>
            <th>Weight of Seed</th>
            <th>No. of Trays per Variety</th>
            <th>Total Trays</th>
            <th>Total Amount</th>
            <th>Advance Amount</th>
            <th>Current Amount</th>
            <th>Balance</th>
            <th>Total Balance</th>
            <th>Action</th>
          </tr>
        </thead>
      <tbody>
  {filteredTrays.map(tray => (
    tray.seeds && tray.seeds.length > 0 ? (
      tray.seeds.map((seed, i) => (
        <tr key={tray.id + '-' + i}>
          <td>{tray.name}</td>
          <td>{tray.village}</td>
          <td>{tray.phone}</td>
          <td>{seed.seedType}</td>
          <td>{seed.seedWeight}</td>
          <td>{seed.noOfTrays}</td>
          {/* Show common columns only in the first seed row */}
          {i === 0 && (
            <>
              <td rowSpan={tray.seeds.length}>{tray.totalTraysPerVariety}</td>
              <td rowSpan={tray.seeds.length}>{tray.totalAmount}</td>
              <td rowSpan={tray.seeds.length}>{tray.advanceAmount}</td>
              <td rowSpan={tray.seeds.length}>{tray.currentAmount}</td>
              <td rowSpan={tray.seeds.length}>{tray.balance}</td>
              <td rowSpan={tray.seeds.length}>{tray.totalBalance}</td>
              <td rowSpan={tray.seeds.length}>
                <button
                  style={{ background: 'red', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: 4 }}
                  onClick={() => handleDelete(tray.id)}
                >
                  Delete
                </button>
              </td>
            </>
          )}
        </tr>
      ))
    ) : (
      // If no seeds, show one row with everything
      <tr key={tray.id}>
        <td>{tray.name}</td>
        <td>{tray.village}</td>
        <td>{tray.phone}</td>
        <td colSpan="3" style={{ textAlign: 'center' }}>No seeds data</td>
        <td>{tray.totalTraysPerVariety}</td>
        <td>{tray.totalAmount}</td>
        <td>{tray.advanceAmount}</td>
        <td>{tray.currentAmount}</td>
        <td>{tray.balance}</td>
        <td>{tray.totalBalance}</td>
        <td>
          <button
            style={{ background: 'red', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: 4 }}
            onClick={() => handleDelete(tray.id)}
          >
            Delete
          </button>
        </td>
      </tr>
    )
  ))}
</tbody>

      </table>
    </div>
  );
};

export default FarmerTrays;
