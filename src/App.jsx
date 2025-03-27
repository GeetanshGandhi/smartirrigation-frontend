// import { useState } from "react";

// const AddDevice = () => {
//     const [devices, setDevices] = useState([]);

//     const scanDevices = async () => {
//         try {
//             const device = await navigator.bluetooth.requestDevice({
//                 acceptAllDevices: true
//             });

//             const deviceInfo = {
//                 name: device.name,
//                 macAddress: device.id, // Web Bluetooth uses 'id' as a unique identifier (similar to MAC)
//             };

//             setDevices((prevDevices) => [...prevDevices, deviceInfo]);
//         } catch (error) {
//             console.error("Bluetooth scan failed:", error);
//         }
//     };

//     return (
//         <div>
//             <h1>Plats Interface</h1>
//             <button onClick={scanDevices}>Scan for Devices</button>
//             <ul>
//                 {devices.map((device, index) => (
//                     <li key={index}>
//                         <strong>{device.name}</strong> - MAC: {device.macAddress}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default AddDevice;


import React, { useEffect, useState } from "react";

const DeviceManager = () => {
  const [devices, setDevices] = useState([]);
  useEffect(()=>{
    fetch("http://localhost:8080/device/add",{
      method: 'GET',headers: {"Content-Type":"application/json"}
    })
  },[])
  const [showAddForm, setShowAddForm] = useState(false);
  const [cropName, setCropName] = useState("");
  const [region, setRegion] = useState("");
  const [deviceToAdd, setDeviceToAdd] = useState({});
  // Function to add a device
  const handleAddDevice = async (e) => {
    e.preventDefault();
    
    if (!cropName || !region) return;

    const newDevice = {
      cropType: cropName,
      region: region,
      temparature:23
    };

    try {
      const response = await fetch("http://localhost:8080/device/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDevice),
      });

      if (!response.ok) {
        throw new Error("Failed to add device");
      }

      const result = await response.text();
      console.log(result);

      // Update UI
      setDevices([...devices, newDevice]);
      setCropName("");
      setRegion("");
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  // Function to update a device
  const handleUpdateDevice = async (device) => {
    const formData = new FormData();
    formData.append("cropType", device.crop); 
    formData.append("region", device.region); 

    try {
      const response = await fetch("http://localhost:8080/device/update", {
        method: "POST",
        body: formData, 
      });

      if (!response.ok) {
        throw new Error("Failed to update device");
      }

      const result = await response.text();
      console.log(result);

      // Update UI
      setDevices(devices.map(d => (d.crop === device.crop ? updatedDevice : d)));
    } catch (error) {
      console.error("Error updating device:", error);
    }
  };

  // Bluetooth Device Scan
  const scanDevices = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true
      });

      const deviceInfo = {
        name: device.name,
        region: '',
        temperature: ''
      };

      setDevices((prevDevices) => [...prevDevices, deviceInfo]);
    } catch (error) {
      console.error("Bluetooth scan failed:", error);
    }
  };

  return (
    <div className="device-manager">
      <h1 className="heading">Plant Interface</h1>

      {/* Add Device Button */}
      <button className="add-device-button" onClick={() => setShowAddForm(true)}>
        Add Device
      </button>

      {/* Device List */}
      <div className="device-list">
        <h2>Your Devices</h2>
        {devices.length === 0 ? (
          <p>No devices added yet.</p>
        ) : (
          <ul>
            {devices.map((device, index) => (
              <li key={index}>
                <strong>Plant Name:</strong> {device.crop}, <strong>Region:</strong> {device.region}
                <button onClick={() => handleUpdateDevice(device)}>Update</button>
                <button>DeleteAll</button> 
                <button>Go Manual</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Device Form */}
      {showAddForm && (
        <div className="form-overlay">
          <form className="add-device-form" onSubmit={handleAddDevice}>
            <h3>Add New Device</h3>
            <label>
              Plant Name:
              <input type="text" value={cropName} onChange={(e) => setCropName(e.target.value)} required />
            </label>
            <label>
              Region:
              <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} required />
            </label>
            <div className="form-buttons">
              <button type="submit">Add</button>
              <button type="button" className="cancel-button" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="button" onClick={scanDevices}>Scan for Devices</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DeviceManager;
