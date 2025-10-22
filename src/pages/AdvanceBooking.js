import React, { useState, useEffect } from 'react';
import {
  collection, query, where, getDocs, doc,
  updateDoc, arrayUnion, setDoc
} from 'firebase/firestore';
import { db } from '../firebase';

const plantVarieties = [
  { name: "Arjun" },
  { name: "Keerthi" },
  { name: "Red Hot" },
  { name: "Mahyco" },
  { name: "Yeshaswini" },
  { name: "2222" },
  { name: "Armor" },
  { name: "855" },
  { name: "Venus" },
  { name: "912" },
  { name: "2233" },
];

const AdvanceBooking = () => {
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [village, setVillage] = useState('');
  const [date, setDate] = useState('');
  const [acres, setAcres] = useState('');
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [saplingsPerVariety, setSaplingsPerVariety] = useState({});
  const [pricesPerVariety, setPricesPerVariety] = useState({});
  const [advancePaid, setAdvancePaid] = useState('');
  const [result, setResult] = useState(null);

  const handlePlantChange = (e) => {
    const { value, checked } = e.target;
    if(checked) {
      setSelectedPlants([...selectedPlants, value]);
    } else {
      setSelectedPlants(selectedPlants.filter(p => p !== value));
      setSaplingsPerVariety(prev => {
        const copy = { ...prev };
        delete copy[value];
        return copy;
      });
      setPricesPerVariety(prev => {
        const copy = { ...prev };
        delete copy[value];
        return copy;
      });
    }
  };

  const handleSaplingsChange = (variety, value) => {
    setSaplingsPerVariety(prev => ({ ...prev, [variety]: Number(value) }));
  };

  const handlePriceChange = (variety, value) => {
    setPricesPerVariety(prev => ({ ...prev, [variety]: Number(value) }));
  };

  const calculateBooking = () => {
    if(!name || !fatherName || !phoneNumber || !village || !date) {
      alert('Please fill all required fields.');
      return;
    }
    if(selectedPlants.length === 0) {
      alert('Select at least one plant variety.');
      return;
    }
    for(let v of selectedPlants) {
      if(!saplingsPerVariety[v] || saplingsPerVariety[v] <= 0) {
        alert(`Enter valid saplings count for ${v}`);
        return;
      }
      if(!pricesPerVariety[v] || pricesPerVariety[v] <= 0) {
        alert(`Enter valid price per plant for ${v}`);
        return;
      }
    }

    const totalSaplings = selectedPlants.reduce((acc, v) => acc + (saplingsPerVariety[v] || 0), 0);
    const traysNeeded = Math.floor(totalSaplings / 100);
    const bonusTrays = Math.floor(traysNeeded / 10);
    const totalTrays = traysNeeded + bonusTrays;

    const plantDetails = selectedPlants.map(v => {
      const cost = pricesPerVariety[v];
      const saplings = saplingsPerVariety[v];
      return {
        name: v,
        costPerPlant: cost,
        saplingsNumber: saplings,
        cropCost: cost * saplings,
      }
    });

    const totalCropCost = plantDetails.reduce((acc, p) => acc + p.cropCost, 0);
    const balance = totalCropCost - Number(advancePaid || 0);

    setResult({
      name,
      fatherName,
      phoneNumber,
      village,
      date,
      acres,
      saplingsPerVariety,
      totalSaplings,
      traysNeeded,
      bonusTrays,
      totalTrays,
      plantDetails,
      totalCropCost,
      advancePaid: Number(advancePaid || 0),
      balance,
    });
  };

  const handleConfirm = async () => {
    if(!result) {
      alert('Please calculate before confirming.');
      return;
    }

    try {
      const farmersCol = collection(db, 'advanceBookedFarmers');
      const q = query(farmersCol, where('phoneNumber', '==', result.phoneNumber));
      const existingSnap = await getDocs(q);

      const bookingEntry = {
        date: result.date,
        saplingsPerVariety: result.saplingsPerVariety,
        totalSaplings: result.totalSaplings,
        traysNeeded: result.traysNeeded,
        bonusTrays: result.bonusTrays,
        totalTrays: result.totalTrays,
        plantDetails: result.plantDetails,
        totalCropCost: result.totalCropCost,
        advancePaid: result.advancePaid,
        balance: result.balance,
      };

      if (!existingSnap.empty) {
        const farmerDoc = existingSnap.docs[0];
        const farmerRef = doc(db, 'advanceBookedFarmers', farmerDoc.id);
        // Append new booking, keep name/fatherName/phone etc unchanged
        await updateDoc(farmerRef, {
          bookings: arrayUnion(bookingEntry),
        });
      } else {
        // Create new farmer document
        const farmerRef = doc(db, 'advanceBookedFarmers', result.phoneNumber);
        await setDoc(farmerRef, {
          name: result.name,
          fatherName: result.fatherName,
          phoneNumber: result.phoneNumber,
          village: result.village,
          acres: result.acres,
          bookings: [bookingEntry],
        });
      }

      alert('Booking saved to Advance Booked Farmers!');
      // Reset form
      setName('');
      setFatherName('');
      setPhoneNumber('');
      setVillage('');
      setDate('');
      setAcres('');
      setSelectedPlants([]);
      setSaplingsPerVariety({});
      setPricesPerVariety({});
      setAdvancePaid('');
      setResult(null);

    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Failed to save booking.');
    }
  };


  return (
    <div style={{ padding:'20px', maxWidth:'900px', margin:'auto' }}>
      <h1>Advance Booking</h1>

      <div style={{ marginBottom: '15px' }}>
        <label>Name:</label><br/>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter name" />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Father's Name:</label><br/>
        <input type="text" value={fatherName} onChange={e => setFatherName(e.target.value)} placeholder="Enter father's name" />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Phone Number:</label><br/>
        <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Enter phone number" />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Village:</label><br/>
        <input type="text" value={village} onChange={e => setVillage(e.target.value)} placeholder="Enter village" />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Date of Advance Payment:</label><br/>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Acres (info only):</label><br/>
        <input type="number" value={acres} onChange={e => setAcres(e.target.value)} placeholder="Enter acres" />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <p>Select Plant Varieties:</p>
        {plantVarieties.map(plant => (
          <div key={plant.name} style={{ marginBottom: '10px' }}>
            <label>
              <input
                type="checkbox"
                value={plant.name}
                checked={selectedPlants.includes(plant.name)}
                onChange={handlePlantChange}
              />
              {plant.name}
            </label>
            {selectedPlants.includes(plant.name) && (
              <>
                <input
                  type="number"
                  placeholder="Saplings count"
                  value={saplingsPerVariety[plant.name] || ''}
                  onChange={e => handleSaplingsChange(plant.name, e.target.value)}
                  style={{ marginLeft: 10, width: 120 }}
                />
                <input
                  type="number"
                  placeholder="Price per plant ₹"
                  value={pricesPerVariety[plant.name] || ''}
                  onChange={e => handlePriceChange(plant.name, e.target.value)}
                  style={{ marginLeft: 10, width: 120 }}
                />
              </>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Advance Paid:</label><br/>
        <input
          type="number"
          value={advancePaid}
          onChange={e => setAdvancePaid(e.target.value)}
          placeholder="Enter advance amount"
        />
      </div>

      <button onClick={calculateBooking} style={{ marginRight: 10 }}>Calculate</button>
      <button onClick={handleConfirm}>Confirm & Next Buyer</button>

      {result && (
        <div style={{ marginTop: 20, border: '1px solid #ccc', padding: 15, borderRadius: 8 }}>
          <h3>Booking Summary (Current Buyer)</h3>
          <p>Name: {result.name}</p>
          <p>Father's Name: {result.fatherName}</p>
          <p>Phone Number: {result.phoneNumber}</p>
          <p>Village: {result.village}</p>
          <p>Date: {result.date}</p>
          <p>Acres: {result.acres}</p>
          <p><strong>Total Saplings:</strong> {result.totalSaplings}</p>
          <p>Trays Needed: {result.traysNeeded}</p>
          <p>Bonus Trays: {result.bonusTrays}</p>
          <p>Total Trays: {result.totalTrays}</p>
          <h4>Plant Details:</h4>
          <ul>
            {result.plantDetails.map((plant, idx) => (
              <li key={idx}>{plant.name}: {plant.saplingsNumber} plants × ₹{plant.costPerPlant} = ₹{plant.cropCost}</li>
            ))}
          </ul>
          <p>Total Crop Cost: ₹{result.totalCropCost}</p>
          <p>Advance Paid: ₹{result.advancePaid}</p>
          <p>Balance: ₹{result.balance}</p>
        </div>
      )}
    </div>
  );
};

export default AdvanceBooking;
