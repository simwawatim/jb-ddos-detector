import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  exp: number;
}

const Navbar = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setEmail(decoded.sub);
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm dark:bg-gray-900 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2">
          <img
            src="https://img.icons8.com/external-flat-icons-vectorslab/68/external-File-Share-network-and-communication-flat-icons-vectorslab.png"
            alt="Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-gray-800 dark:text-white">NTM</span>
        </a>

        {/* Welcome & Time */}
        {email && (
          <div className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
            <span className="font-medium">Welcome, {email}</span>
            <span className="ml-4">Time: {currentTime}</span>
          </div>
        )}

        {/* Profile Avatar */}
        <div className="relative">
          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="User"
            className="w-9 h-9 rounded-full border-2 border-gray-200 dark:border-gray-600 cursor-pointer"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
