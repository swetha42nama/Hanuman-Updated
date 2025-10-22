// import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// const NurseryLeafletMap = () => {
//   const position = [17.030363, 80.441667]; // Replace with your nursery lat,lng

//   return (
//     <MapContainer center={position} zoom={16} style={{ height: '400px', width: '100%' }}>
//       {/* <TileLayer
//         attribution='&copy; OpenStreetMap contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       /> */}
//       <TileLayer
//   attribution='Tiles &copy; Esri | Source: Esri & partners'
//   url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
// />

//       <Marker position={position}>
//         <Popup>
//           Sri Hanuman Rythu Mithra mirchi Nursery
//         </Popup>
//       </Marker>
//     </MapContainer>
//   );
// };

// export default NurseryLeafletMap;
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const NurseryLeafletMap = () => (
  <MapContainer center={[17.030732, 80.441774]} zoom={16} style={{ height: '400px', width: '100%' }}>
    <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    {/* <TileLayer
      attribution='Tiles &copy; Esri | Source: Esri & partners'
      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    /> */}
    <Marker position={[17.030732, 80.441774]}>
      <Popup>
        <img src="/hanuman.png" alt="Nursery" style={{ width: 120, borderRadius: 8 }} /><br />
        <strong>Sri Hanuman Rythu Mithra mirchi Nursery</strong>
      </Popup>
    </Marker>
  </MapContainer>
);

export default NurseryLeafletMap;
