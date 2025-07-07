import React, { useState, useEffect } from "react";

interface Device {
  ip: string;
  mac: string;
  status: "active" | "blocked";
}

const DevicesTable = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:8000/devices")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((d: { ip: string; mac: string; blocked: boolean }) => ({
          ip: d.ip,
          mac: d.mac,
          status: d.blocked ? "blocked" : "active",
        }));
        setDevices(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch devices:", err);
        setLoading(false);
      });
  }, []);

  const handleAction = async (device: Device) => {
    const newStatus = device.status === "blocked" ? "active" : "blocked";
    const endpoint =
      newStatus === "blocked"
        ? `http://localhost:8000/block-device/${device.ip}`
        : `http://localhost:8000/unblock-device/${device.ip}`;

    try {
      const response = await fetch(endpoint, { method: "POST" });
      if (!response.ok) throw new Error("Failed request");

      const updatedDevices = devices.map((d) =>
        d.mac === device.mac ? { ...d, status: newStatus as "active" | "blocked" } : d
      );
      setDevices(updatedDevices);
    } catch (error) {
      console.error("Error updating device status:", error);
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-lg sm:rounded-xl bg-gray-900 border border-gray-700">
      <div className="p-4 border-b border-gray-700 rounded-t-xl bg-gray-800">
        <h2 className="text-xl font-semibold text-white">Devices</h2>
      </div>
      {loading ? (
        <div className="p-6 text-center text-white">Loading devices...</div>
      ) : (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">IP</th>
              <th className="px-6 py-3">MAC</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.length > 0 ? (
              devices.map((device, i) => (
                <tr
                  key={i}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td className="px-6 py-4">{device.ip}</td>
                  <td className="px-6 py-4">{device.mac}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        device.status === "blocked"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {device.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleAction(device)}
                      className={`px-3 py-1 rounded-md text-white text-xs font-medium ${
                        device.status === "blocked"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {device.status === "blocked" ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No devices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DevicesTable;
