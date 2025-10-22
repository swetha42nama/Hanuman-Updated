// src/components/Calculator.js
import React, { useState } from 'react';

const Calculator = () => {
  const [acres, setAcres] = useState('');
  const [result, setResult] = useState(null);

  const calculateTrays = () => {
    const saplingsPerAcre = 13000;
    const saplingsNeeded = acres * saplingsPerAcre;
    const traysNeeded = Math.floor(saplingsNeeded / 100);
    const bonusTrays = Math.floor(traysNeeded / 100); // 1 extra tray per 100 trays
    const totalTrays = traysNeeded + bonusTrays;

    setResult({ saplingsNeeded, traysNeeded, bonusTrays, totalTrays });
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Tray Calculator</h2>
      <input
        type="number"
        placeholder="Enter acres"
        value={acres}
        onChange={e => setAcres(e.target.value)}
        style={{ padding: '5px', marginRight: '10px' }}
      />
      <button onClick={calculateTrays} style={{ padding: '5px 10px' }}>Calculate</button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <p>Saplings Needed: {result.saplingsNeeded}</p>
          <p>Trays Needed: {result.traysNeeded}</p>
          <p>Bonus Trays: {result.bonusTrays}</p>
          <p><strong>Total Trays Given: {result.totalTrays}</strong></p>
        </div>
      )}
    </div>
  );
};

export default Calculator;
