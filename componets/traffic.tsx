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
  const [filterText, setFilterText] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const [failCount, setFailCount] = useState(0);

  const fetchTrafficData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/traffic');
      if (!response.ok) throw new Error('Server returned an error');

      const rawData = await response.json();
      const reversedData = rawData.slice().reverse();
      const total = reversedData.length;

      const dataWithIds: TrafficEntry[] = reversedData.map(
        (entry: Omit<TrafficEntry, 'id'>, index: number) => ({
          ...entry,
          id: total - index,
        })
      );

      setTrafficData(dataWithIds);
      setFailCount(0); // Reset fail count on success
    } catch (error) {
      setFailCount(prev => prev + 1); // Increment fail count on error
    }
  };

  useEffect(() => {
    fetchTrafficData();
    const interval = setInterval(fetchTrafficData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Only show loading/error UI if failCount >= 5
  if (failCount >= 5) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-900 text-red-500 text-3xl font-mono select-none">
        <span className="animate-pulse">⚠️ Unable to fetch traffic data ⚠️</span>
        <small className="mt-2 text-gray-400">Check your network or server status</small>
      </div>
    );
  }

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

  const filteredTraffic = trafficData.filter(entry =>
    entry.source_ip.includes(filterText) ||
    entry.dest_ip.includes(filterText) ||
    entry.protocol.toLowerCase().includes(filterText.toLowerCase()) ||
    entry.port.includes(filterText)
  );

  const sortedTraffic = [...filteredTraffic].sort((a, b) => {
    if (a.is_malicious === b.is_malicious) return 0;
    return a.is_malicious ? -1 : 1;
  });

  const visibleTraffic = sortedTraffic.slice(0, visibleCount);

  return (
    <div className="relative overflow-x-auto shadow-lg sm:rounded-xl bg-gray-900 border border-gray-700">
      {/* Filter input */}
      <div className="p-4 bg-gray-800 flex items-center gap-4 rounded-t-xl border-b border-gray-700">
        <input
          type="text"
          placeholder="🔍 Filter by IP, Protocol, or Port..."
          className="flex-grow px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setVisibleCount(20);
          }}
        />
      </div>

      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs uppercase bg-gray-800 text-gray-400 text-center">
          <tr>
            {[
              "ID", "Source IP", "Destination IP", "Protocol", "Port", "Packets",
              "Bytes", "Status", "Malicious", "Reason", "Action"
            ].map((head) => (
              <th key={head} className="px-6 py-3">{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleTraffic.length === 0 ? (
            <tr>
              <td colSpan={11} className="text-center py-6 text-gray-500">
                No matching traffic found.
              </td>
            </tr>
          ) : (
            visibleTraffic.map((entry) => (
              <tr
                key={entry.id}
                className={`bg-gray-900 hover:bg-gray-800 transition ${
                  entry.is_malicious ? 'bg-red-900 bg-opacity-30' : ''
                }`}
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
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    entry.packets > 1000 ? 'bg-red-100 text-red-700' :
                    entry.packets > 500 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {entry.packets > 1000 ? 'High' : entry.packets > 500 ? 'Moderate' : 'Normal'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {entry.is_malicious ? (
                    <span className="text-red-500 font-bold">Yes</span>
                  ) : (
                    <span className="text-green-500 font-semibold">No</span>
                  )}
                </td>
                <td className="px-6 py-4">{entry.malicious_reason || '-'}</td>
                <td className="px-6 py-4 text-center">
                  <a
                    href={`/map?ip=${entry.source_ip}`}
                    className="text-cyan-400 hover:text-cyan-300 inline-flex items-center justify-center"
                    title="View on map"
                  >
                    <Eye className="w-5 h-5" />
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Load More Button */}
      {sortedTraffic.length > visibleCount && (
        <div className="text-center my-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + 20)}
            className="px-5 py-2 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white font-medium shadow-md transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Traffic;
