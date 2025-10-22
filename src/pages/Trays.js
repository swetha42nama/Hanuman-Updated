import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Trays = () => {
  const [personData, setPersonData] = useState({
    name: '',
    village: '',
    phone: '',
    advanceAmount: '',
    currentAmount: '',
  });

  const [seeds, setSeeds] = useState([{ seedType: '', seedWeight: '', noOfTrays: '', trayCost: '' }]);
  const [loading, setLoading] = useState(false);

  const handlePersonChange = (e) => {
    const { name, value } = e.target;
    setPersonData((prev) => ({ ...prev, [name]: value }));
  };

  // NEW: Handle change for any seed row/field
  const handleSeedChange = (index, e) => {
    const { name, value } = e.target;
    setSeeds((prevSeeds) =>
      prevSeeds.map((seed, i) => (i === index ? { ...seed, [name]: value } : seed))
    );
  };

  // NEW: Add/Remove seed row handlers
  const addSeedRow = () => {
    setSeeds((prevSeeds) => [
      ...prevSeeds,
      { seedType: '', seedWeight: '', noOfTrays: '', trayCost: '' },
    ]);
  };

  const removeSeedRow = (index) => {
    setSeeds((prevSeeds) => prevSeeds.filter((_, i) => i !== index));
  };

  // Calculations
  const totalTraysPerVariety = seeds.reduce((sum, seed) => sum + Number(seed.noOfTrays || 0), 0);
  const totalSeedWeight = seeds.reduce((sum, seed) => sum + Number(seed.seedWeight || 0), 0);
  const totalAmount = seeds.reduce(
    (sum, seed) => sum + Number(seed.noOfTrays || 0) * Number(seed.trayCost || 0),
    0
  );

  const advanceAmountNum = Number(personData.advanceAmount) || 0;
  const currentAmountNum = Number(personData.currentAmount) || 0;
  const balance = totalAmount - advanceAmountNum - currentAmountNum;
  const totalBalance = balance;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dataToSave = {
      ...personData,
      seeds,
      totalSeedWeight,
      totalTraysPerVariety,
      totalAmount,
      advanceAmount: advanceAmountNum,
      currentAmount: currentAmountNum,
      balance,
      totalBalance,
    };
    try {
      await addDoc(collection(db, 'farmerTrays'), dataToSave);
      alert('Data saved successfully!');
      setPersonData({ name: '', village: '', phone: '', advanceAmount: '', currentAmount: '' });
      setSeeds([{ seedType: '', seedWeight: '', noOfTrays: '', trayCost: '' }]);
    } catch (error) {
      alert('Error saving data');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      {/* Existing fields for Name, Village, Phone */}
      <label>Name:</label><br />
      <input name="name" value={personData.name} onChange={handlePersonChange} required style={{ width: '100%', padding: 8 }} />
      <br /><br />
      <label>Village:</label><br />
      <input name="village" value={personData.village} onChange={handlePersonChange} required style={{ width: '100%', padding: 8 }} />
      <br /><br />
      <label>Phone Number:</label><br />
      <input type="tel" name="phone" value={personData.phone} onChange={handlePersonChange} required style={{ width: '100%', padding: 8 }} />
      <br /><br />

      {/* New fields */}
      <label>Advance Amount:</label><br />
      <input
        type="number"
        name="advanceAmount"
        value={personData.advanceAmount}
        onChange={handlePersonChange}
        style={{ width: '100%', padding: 8 }}
      />
      <br /><br />
      <label>Current Amount:</label><br />
      <input
        type="number"
        name="currentAmount"
        value={personData.currentAmount}
        onChange={handlePersonChange}
        style={{ width: '100%', padding: 8 }}
      />
      <br /><br />

      {/* Dynamic Seeds Section */}
      <h4>Seed Varieties</h4>
      {seeds.map((seed, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 12, borderRadius: 5 }}>
          <label>Type of Seed:</label>
          <input
            name="seedType"
            value={seed.seedType}
            onChange={e => handleSeedChange(index, e)}
            required
            style={{ width: '22%', marginRight: 8 }}
          />
          <label>Seed Weight (g):</label>
          <input
            type="number"
            name="seedWeight"
            value={seed.seedWeight}
            onChange={e => handleSeedChange(index, e)}
            required
            style={{ width: '17%', marginRight: 8 }}
          />
          <label>No. of Trays:</label>
          <input
            type="number"
            name="noOfTrays"
            value={seed.noOfTrays}
            onChange={e => handleSeedChange(index, e)}
            required
            style={{ width: '16%', marginRight: 8 }}
          />
          <label>Amount per Tray:</label>
          <input
            type="number"
            name="trayCost"
            value={seed.trayCost}
            onChange={e => handleSeedChange(index, e)}
            required
            style={{ width: '17%', marginRight: 8 }}
          />
          {seeds.length > 1 && (
            <button type="button" onClick={() => removeSeedRow(index)} style={{ color: 'red' }}>
              Remove
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addSeedRow} style={{ marginBottom: '14px' }}>
        Add Another Seed Variety
      </button>

      {/* Display Calculated totals and balances */}
      <div>
        <strong>Total Seed Weight:</strong> {totalSeedWeight} <br />
        <strong>Total No. of Trays:</strong> {totalTraysPerVariety} <br />
        <strong>Total Tray Amount:</strong> ₹{totalAmount} <br />
        <strong>Balance:</strong> ₹{balance} <br />
        <strong>Total Balance:</strong> ₹{totalBalance}
      </div>
      <br />
      <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
        {loading ? 'Saving...' : 'Submit'}
      </button>
    </form>
  );
};

export default Trays;
