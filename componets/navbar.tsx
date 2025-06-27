import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';

interface DecodedToken {
  sub: string;
  exp: number;
}

const Navbar = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setEmail(decoded.sub);
      } catch (e) {
        console.error('Failed to decode token', e);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setEmail(null);
    router.push('/login'); // ⬅️ Redirect to login page
  };

  const goToUsers = () => {
    router.push('/users');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2">
          <img
            src="https://img.icons8.com/external-flat-icons-vectorslab/68/external-File-Share-network-and-communication-flat-icons-vectorslab.png"
            alt="Logo"
            className="h-8 w-8"
          />
          <span className="text-2xl font-bold text-gray-800 dark:text-white">NTM</span>
        </a>

        {/* Welcome + Time */}
        {email && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-6 text-sm sm:text-base text-gray-800 dark:text-white">
            <span>👋 Welcome, <span className="font-semibold">{email}</span></span>
            <span className="text-gray-600 dark:text-gray-300">🕒 {currentTime}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={goToUsers}
            className="text-sm sm:text-base font-medium text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Users
          </button>

          {email && (
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition"
            >
              Logout
            </button>
          )}

          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
