import React, { useState, useEffect } from 'react';
import {
  collection, query, where, getDocs, doc,
  updateDoc, arrayUnion, setDoc, getDoc
} from 'firebase/firestore';
import { db } from '../firebase';

const plantVarieties = [
  { name: 'Arjun' },
  { name: 'Keerthi' },
  { name: 'Red Hot' },
  { name: 'Mahyco' },
  { name: 'Yeshaswini' },
  { name: '2222' },
  { name: 'Armor' },
  { name: '855' },
  { name: 'Venus' },
  { name: '912' },
  { name: '2233' },
];

let totalData = {
  saplingsPerVariety: {},
  traysSold: 0,
  acresMentioned: 0,
  advancePaid: 0,
  currentPaid: 0,
  totalCropCost: 0,
  balanceToOwner: 0,
  balanceToUser: 0,
  totalAmountToBePaid: 0,
};

const Booking = () => {
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [date, setDate] = useState('');
  const [acres, setAcres] = useState('');
  const [saplingsPerVariety, setSaplingsPerVariety] = useState({});
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [prices, setPrices] = useState({});
  const [advancePaid, setAdvancePaid] = useState('');
  const [currentPay, setCurrentPay] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'nurseries', 'nurseryData');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) Object.assign(totalData, docSnap.data());
      } catch (err) {
        console.error('Error fetching Firestore data:', err);
      }
    };
    fetchData();
  }, []);

  const saveDataToFirestore = async (data) => {
    try {
      const docRef = doc(db, 'nurseries', 'nurseryData');
      await setDoc(docRef, data, { merge: true });
    } catch (err) {
      console.error('Error saving to Firestore:', err);
    }
  };

  const handlePlantChange = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    setSelectedPlants(prev =>
      checked ? [...prev, value] : prev.filter((p) => p !== value)
    );
  };

  const handlePriceChange = (plantName, value) => {
    setPrices(prev => ({ ...prev, [plantName]: Number(value) }));
  };

  const handleSaplingsPerVarietyChange = (varietyName, value) => {
    setSaplingsPerVariety(prev => ({ ...prev, [varietyName]: Number(value) }));
  };

  const calculateBooking = () => {
    for (let variety of selectedPlants) {
      const count = saplingsPerVariety[variety];
      if (!count || count <= 0) {
        alert(`Enter a valid sapling count for ${variety}`);
        return;
      }
    }
    const saplingsNumber = selectedPlants.reduce((sum, variety) =>
      sum + (saplingsPerVariety[variety] || 0), 0);

    const traysPerVariety = {};
    selectedPlants.forEach(variety => {
      const count = saplingsPerVariety[variety];
      traysPerVariety[variety] = Math.floor(count / 100);
    });

    const totalTrays = Object.values(traysPerVariety).reduce((a, b) => a + b, 0);
    const bonusTrays = Math.floor(totalTrays / 10);

    const plantDetails = selectedPlants.map(variety => {
      const cost = prices[variety] || 0;
      const count = saplingsPerVariety[variety];
      return {
        name: variety,
        costPerPlant: cost,
        saplingsNumber: count,
        cropCost: count * cost,
      };
    });

    const totalCropCost = plantDetails.reduce((acc, item) => acc + item.cropCost, 0);
    const totalPaid = Number(advancePaid) + Number(currentPay);
    const balanceToOwner = totalPaid < totalCropCost ? totalCropCost - totalPaid : 0;
    const balanceToUser = totalPaid > totalCropCost ? totalPaid - totalCropCost : 0;
    const totalAmountToBePaid = totalCropCost - Number(advancePaid);

    setResult({
      saplingsNumber,
      traysPerVariety,
      totalTrays,
      bonusTrays,
      plantDetails,
      totalCropCost,
      balanceToOwner,
      balanceToUser,
      totalAmountToBePaid,
    });
  };

  const handleConfirm = async () => {
    if (!result) {
      alert('Please calculate booking first.');
      return;
    }
    if (!name || !phoneNumber || !village) {
      alert('Please fill all required details.');
      return;
    }
    try {
      const farmersCol = collection(db, 'farmers');
      // Here match only by phone number to avoid overwriting on spelling mistakes
      const q = query(
        farmersCol,
        where('phoneNumbers', 'array-contains', phoneNumber)
      );
      const existingSnap = await getDocs(q);

      const bookingEntry = {
        date,
        saplings: result.saplingsNumber,
        plantVarieties: result.plantDetails,
        advancePaid: Number(advancePaid),
        currentPay: Number(currentPay),
        totalCropCost: result.totalCropCost,
        balanceToOwner: result.balanceToOwner,
        balanceToUser: result.balanceToUser,
        totalAmountToBePaid: result.totalAmountToBePaid,
      };

      if (!existingSnap.empty) {
        const farmerDoc = existingSnap.docs[0];
        const farmerRef = doc(db, 'farmers', farmerDoc.id);
        // Append phone number if not already there
        await updateDoc(farmerRef, {
          phoneNumbers: arrayUnion(phoneNumber),
          bookings: arrayUnion(bookingEntry),
        });
      } else {
        const farmerRef = doc(db, 'farmers', phoneNumber.trim());
        // Create new farmer document with merging enabled
        await setDoc(
          farmerRef,
          {
            name,
            village,
            phoneNumbers: [phoneNumber],
            bookings: [bookingEntry],
          },
          { merge: true }
        );
      }

      selectedPlants.forEach(name => {
        const count = saplingsPerVariety[name] || 0;
        totalData.saplingsPerVariety[name] = (totalData.saplingsPerVariety[name] || 0) + count;
      });

      totalData.traysSold += result.totalTrays;
      totalData.acresMentioned += Number(acres) || 0;
      totalData.advancePaid += Number(advancePaid) || 0;
      totalData.currentPaid += Number(currentPay) || 0;
      totalData.totalCropCost += result.totalCropCost;
      totalData.balanceToOwner += result.balanceToOwner;
      totalData.balanceToUser += result.balanceToUser;
      totalData.totalAmountToBePaid += result.totalAmountToBePaid;

      await saveDataToFirestore(totalData);

      alert('Booking saved successfully!');
      setName('');
      setVillage('');
      setPhoneNumber('');
      setDate('');
      setAcres('');
      setSaplingsPerVariety({});
      setSelectedPlants([]);
      setPrices({});
      setAdvancePaid('');
      setCurrentPay('');
      setResult(null);
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Error saving booking.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <h1>Nursery Booking</h1>

      <div style={{ marginBottom: '15px' }}>
        <label>Name:</label><br />
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter farmer's name" />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Village:</label><br />
        <input value={village} onChange={e => setVillage(e.target.value)} placeholder="Enter village name" />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Phone Number:</label><br />
        <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Enter phone number" />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Date:</label><br />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Acres (just info):</label><br />
        <input type="number" value={acres} onChange={e => setAcres(e.target.value)} placeholder="Enter acres" />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <p>Select Plant Varieties & Enter Sapling Count & Prices:</p>
        {plantVarieties.map(plant => (
          <div key={plant.name} style={{ marginBottom: '12px' }}>
            <label>
              <input
                type="checkbox"
                value={plant.name}
                checked={selectedPlants.includes(plant.name)}
                onChange={handlePlantChange}
                style={{ marginRight: '8px' }}
              />
              {plant.name}
            </label>
            {selectedPlants.includes(plant.name) && (
              <>
                <input
                  type="number"
                  placeholder="Saplings count"
                  value={saplingsPerVariety[plant.name] || ''}
                  onChange={e => handleSaplingsPerVarietyChange(plant.name, e.target.value)}
                  style={{ marginLeft: 12, width: 120 }}
                />
                <input
                  type="number"
                  placeholder="Price per plant ₹"
                  value={prices[plant.name] || ''}
                  onChange={e => handlePriceChange(plant.name, e.target.value)}
                  style={{ marginLeft: 12, width: 120 }}
                />
              </>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Advance Paid:</label><br />
        <input type="number" value={advancePaid} onChange={e => setAdvancePaid(e.target.value)} placeholder="Enter advance amount" />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Current Pay:</label><br />
        <input type="number" value={currentPay} onChange={e => setCurrentPay(e.target.value)} placeholder="Enter current pay" />
      </div>

      <div>
        <button onClick={calculateBooking} style={{ marginRight: '10px' }}>Calculate</button>
        <button onClick={handleConfirm}>Confirm Next User</button>
      </div>

      {result && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '12px', borderRadius: '6px' }}>
          <h3>Booking Summary</h3>
          <p>Total Saplings: {result.saplingsNumber}</p>
          <p>Trays per Variety:</p>
          <ul>
            {Object.entries(result.traysPerVariety).map(([name, trays]) => (
              <li key={name}>{name}: {trays} tray(s)</li>
            ))}
          </ul>
          <p>Total Trays: {result.totalTrays}</p>
          <p>Bonus Trays (1 per 10 trays): {result.bonusTrays}</p>
          <h4>Plant Details</h4>
          <ul>
            {result.plantDetails.map((plant, idx) => (
              <li key={idx}>{plant.name} – {plant.saplingsNumber} plants @ ₹{plant.costPerPlant} ➔ ₹{plant.cropCost}</li>
            ))}
          </ul>
          <p>Total Crop Cost: ₹{result.totalCropCost}</p>
          <p>Advance Paid: ₹{advancePaid}</p>
          <p>Current Pay: ₹{currentPay}</p>
          <p>Balance to Owner: ₹{result.balanceToOwner}</p>
        </div>
      )}
    </div>
  );
};

export default Booking;
