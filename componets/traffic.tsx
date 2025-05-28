import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";


interface TrafficEntry {
  source_ip: string;
  dest_ip: string;
  protocol: string;
  port: string;
  packets: number;
  bytes: number;
  status: string;
  action: string;
}

const Traffic = () => {
  const [trafficData, setTrafficData] = useState<TrafficEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchTrafficData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/traffic');
      const data = await response.json();
      setTrafficData(data.reverse());
    } catch (error) {
      console.error('Error fetching traffic data:', error);
    }
  };

  useEffect(() => {
    fetchTrafficData();
    const interval = setInterval(fetchTrafficData, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Reset to first page if new data is shorter than expected
    const totalPages = Math.ceil(trafficData.length / itemsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [trafficData]);

  const getTrafficColor = (packets: number): string => {
    if (packets > 1000) return 'bg-red-100 text-red-700';
    if (packets > 500) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getProtocolColor = (protocol: string): string => {
    switch (protocol.toUpperCase()) {
      case 'TCP':
        return 'bg-blue-100 text-blue-700';
      case 'UDP':
        return 'bg-purple-100 text-purple-700';
      case 'ICMP':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const totalPages = Math.max(1, Math.ceil(trafficData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = trafficData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg text-white">
      <table className="w-full text-sm text-left dark:bg-gray-900">
        <thead className="text-xs text-gray-700 uppercase p-6 rounded-lg shadow-sm text-white dark:bg-gray-900 text-center">
          <tr>
            <th className="px-6 py-3">Source IP</th>
            <th className="px-6 py-3">Destination IP</th>
            <th className="px-6 py-3">Protocol</th>
            <th className="px-6 py-3">Port</th>
            <th className="px-6 py-3">Packets</th>
            <th className="px-6 py-3">Bytes</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4 text-gray-400">
                No traffic data available.
              </td>
            </tr>
          ) : (
            paginatedData.map((entry, index) => (
              <tr key={index} className="dark:bg-gray-900">
                <td className="px-6 py-4 text-white">{entry.source_ip}</td>
                <td className="px-6 py-4 text-white">{entry.dest_ip}</td>
                <td className="px-6 py-4 text-white">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getProtocolColor(entry.protocol)}`}>
                    {entry.protocol}
                  </span>
                </td>
                <td className="px-6 py-4 text-white">{entry.port}</td>
                <td className="px-6 py-4 text-white">{entry.packets}</td>
                <td className="px-6 py-4 text-white">{entry.bytes}</td>
                <td className="px-6 py-4 text-white">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTrafficColor(entry.packets)}`}>
                    {entry.packets > 1000 ? 'High' : entry.packets > 500 ? 'Moderate' : 'Normal'}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <a
                    href={`/map?ip=${entry.source_ip}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    View
                  </a>
                  <a href="#" className="font-medium text-blue-600 hover:underline">
                    Edit
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {trafficData.length > itemsPerPage && (
       <div className="flex justify-center mt-4 space-x-2">
        <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
           
        >
            <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="px-4 py-2">{currentPage} / {totalPages}</span>
        
        <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
           
        >
            <ChevronRight className="w-5 h-5" />
        </button>
        </div>

      )}
    </div>
  );
};

export default Traffic;
