import React, { useEffect, useState } from 'react';
import { Eye } from "lucide-react";

interface TrafficEntry {
  id: number;
  source_ip: string;
  dest_ip: string;
  protocol: string;
  port: string;
  packets: number;
  bytes: number;
  status: string;
  action: string;
  is_malicious?: boolean;
  malicious_reason?: string;
}

const Traffic = () => {
  const [trafficData, setTrafficData] = useState<TrafficEntry[]>([]);

  const fetchTrafficData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/traffic');
      const rawData = await response.json();

      // Reverse to show newest first
      const reversedData = rawData.slice().reverse();

      const total = reversedData.length;
      const dataWithIds: TrafficEntry[] = reversedData.map(
        (entry: Omit<TrafficEntry, 'id'>, index: number) => ({
          ...entry,
          id: total - index,
        })
      );

      setTrafficData(dataWithIds);
    } catch (error) {
      console.error('Error fetching traffic data:', error);
    }
  };

  useEffect(() => {
    fetchTrafficData();
    const interval = setInterval(fetchTrafficData, 2000);
    return () => clearInterval(interval);
  }, []);

  const getTrafficColor = (packets: number, isMalicious?: boolean): string => {
    if (isMalicious) return 'bg-red-200 text-red-900 font-bold';
    if (packets > 1000) return 'bg-red-100 text-red-700';
    if (packets > 500) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getProtocolColor = (protocol: string): string => {
    const colorMap: { [key: string]: string } = {
      TCP: "bg-blue-100 text-blue-700",
      UDP: "bg-purple-100 text-purple-700",
      ICMP: "bg-orange-100 text-orange-700",
      DNS: "bg-red-100 text-red-700",
      HTTP: "bg-green-100 text-green-700",
      HTTPS: "bg-green-200 text-green-800",
      SSH: "bg-yellow-100 text-yellow-700",
      FTP: "bg-pink-100 text-pink-700",
      SMTP: "bg-rose-100 text-rose-700",
      POP3: "bg-teal-100 text-teal-700",
      IMAP: "bg-indigo-100 text-indigo-700",
      RDP: "bg-fuchsia-100 text-fuchsia-700",
      MYSQL: "bg-cyan-100 text-cyan-700",
      REDIS: "bg-amber-100 text-amber-700",
      MONGODB: "bg-lime-100 text-lime-700",
      ARP: "bg-slate-100 text-slate-700",
    };
    return colorMap[protocol.toUpperCase()] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg text-white">
      <table className="w-full text-sm text-left dark:bg-gray-900">
        <thead className="text-xs text-gray-700 uppercase text-white dark:bg-gray-900 text-center">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Source IP</th>
            <th className="px-6 py-3">Destination IP</th>
            <th className="px-6 py-3">Protocol</th>
            <th className="px-6 py-3">Port</th>
            <th className="px-6 py-3">Packets</th>
            <th className="px-6 py-3">Bytes</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Malicious</th>
            <th className="px-6 py-3">Reason</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {trafficData.length === 0 ? (
            <tr>
              <td colSpan={11} className="text-center py-4 text-gray-400">
                No traffic data available.
              </td>
            </tr>
          ) : (
            trafficData.map((entry) => (
              <tr
                key={entry.id}
                className={`dark:bg-gray-900 ${entry.is_malicious ? 'bg-red-900 bg-opacity-50' : ''}`}
                title={entry.is_malicious ? `Malicious reason: ${entry.malicious_reason}` : undefined}
              >
                <td className="px-6 py-4">{entry.id}</td>
                <td className="px-6 py-4">{entry.source_ip}</td>
                <td className="px-6 py-4">{entry.dest_ip}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getProtocolColor(entry.protocol)}`}>
                    {entry.protocol}
                  </span>
                </td>
                <td className="px-6 py-4">{entry.port}</td>
                <td className={`px-6 py-4 ${getTrafficColor(entry.packets, entry.is_malicious)}`}>
                  {entry.packets}
                </td>
                <td className="px-6 py-4">{entry.bytes}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      entry.packets > 1000 ? 'bg-red-100 text-red-700' :
                      entry.packets > 500 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {entry.packets > 1000 ? 'High' : entry.packets > 500 ? 'Moderate' : 'Normal'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {entry.is_malicious ? (
                    <span className="text-red-600 font-bold">Yes</span>
                  ) : (
                    <span className="text-green-600 font-semibold">No</span>
                  )}
                </td>
                <td className="px-6 py-4">{entry.malicious_reason || '-'}</td>
                <td className="px-6 py-4 text-center">
                  <a
                    href={`/map?ip=${entry.source_ip}`}
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center justify-center"
                    title="View on map"
                  >
                    <Eye className="w-6 h-6" />
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Traffic;
