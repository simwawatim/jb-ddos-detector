'use client'; // if using Next.js App Router
import { useEffect, useState } from "react";
import { Activity, AlertCircle, BarChart } from "lucide-react";

type Device = {
  mac: string;
  ip: string;
  name: string;
  last_seen: string;
  status: string;
  activity: number;
};

const HomeCards = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/devices")
      .then(res => res.json())
      .then(data => setDevices(data))
      .catch(err => console.error("Failed to fetch devices", err));
  }, []);

  const activeDevices = devices.filter(d => d.status === "Active");
  const notActiveDevices = devices.filter(d => d.status !== "Active");
  const totalActivity = devices.reduce((sum, d) => sum + d.activity, 0);

  return (
    <div className="w-full max-w-7xl mt-4 mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Devices */}
        <div className="p-6 rounded-lg shadow-sm dark:bg-gray-900 text-center">
          <h5 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Active Devices</h5>
          <p className="text-gray-700 dark:text-gray-400">{activeDevices.length}</p>
          <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mt-4" />
        </div>

        {/* Not Active Devices */}
        <div className="p-6 rounded-lg shadow-sm dark:bg-gray-900 text-center">
          <h5 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Not Active Devices</h5>
          <p className="text-gray-700 dark:text-gray-400">{notActiveDevices.length} </p>
          <AlertCircle className="w-8 h-8 text-yellow-500 dark:text-yellow-300 mx-auto mt-4" />
        </div>

        {/* Status Summary */}
        <div className="p-6 rounded-lg shadow-sm dark:bg-gray-900 text-center">
          <h5 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Status Summary</h5>
          <p className="text-gray-700 dark:text-gray-400">
            {devices.length} devices total with {totalActivity} activity points.
          </p>
          <BarChart className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mt-4" />
        </div>
      </div>
    </div>
  );
};

export default HomeCards;
