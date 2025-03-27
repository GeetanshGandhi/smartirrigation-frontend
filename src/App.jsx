import { useState } from "react";

const AddDevice = () => {
    const [devices, setDevices] = useState([]);

    const scanDevices = async () => {
        try {
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true
            });

            const deviceInfo = {
                name: device.name,
                macAddress: device.id, // Web Bluetooth uses 'id' as a unique identifier (similar to MAC)
            };

            setDevices((prevDevices) => [...prevDevices, deviceInfo]);
        } catch (error) {
            console.error("Bluetooth scan failed:", error);
        }
    };

    return (
        <div>
            <h2>Nearby ESP32 Devices</h2>
            <button onClick={scanDevices}>Scan for Devices</button>
            <ul>
                {devices.map((device, index) => (
                    <li key={index}>
                        <strong>{device.name}</strong> - MAC: {device.macAddress}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AddDevice;
