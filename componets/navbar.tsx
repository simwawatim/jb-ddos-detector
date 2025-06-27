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
    router.push('/login');
  };

  const goToUsers = () => {
    router.push('/users');
  };

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-green-500 shadow-lg px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 font-mono">
        
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2">
          <img
            src="https://img.icons8.com/fluency/48/hacker.png"
            alt="Logo"
            className="h-10 w-10"
          />
          <span className="text-2xl font-bold text-green-400 tracking-widest">
            CYBER-NTM
          </span>
        </a>

        {/* Welcome + Time */}
        {email && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-6 text-sm sm:text-base text-green-300">
            <span>🛡️ User: <span className="font-semibold text-green-400">{email}</span></span>
            <span>⏱️ {currentTime}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={goToUsers}
            className="px-3 py-1 rounded border border-green-500 text-green-400 hover:bg-green-600 hover:text-black transition duration-200"
          >
            Users
          </button>

          {email && (
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-red-700 hover:bg-red-600 text-white font-bold tracking-wide transition duration-200"
            >
              Logout
            </button>
          )}

          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-green-500"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
