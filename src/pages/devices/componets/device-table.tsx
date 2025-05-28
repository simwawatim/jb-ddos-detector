import { useEffect, useState } from "react";

type Device = {
  mac: string;
  ip: string;
  name: string;
  last_seen: string;
  status: string;
  activity: string;
};

const DevicesTable = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch("http://localhost:8000/devices");
        const data = await response.json();
        setDevices(data);
      } catch (err) {
        console.error("Error fetching devices:", err);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 60000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl relative overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800 p-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Devices</h2>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">MAC Address</th>
              <th className="px-6 py-3">IP Address</th>
              <th className="px-6 py-3">Device Name</th>
              <th className="px-6 py-3">Last Seen</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Activity</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device, i) => (
              <tr
                key={i}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <td className="px-6 py-4">{device.mac}</td>
                <td className="px-6 py-4">{device.ip}</td>
                <td className="px-6 py-4">{device.name}</td>
                <td className="px-6 py-4">{device.last_seen}</td>
                <td className="px-6 py-4">{device.status}</td>
                <td className="px-6 py-4">{device.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DevicesTable;
