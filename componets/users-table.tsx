import React, { useEffect, useState } from 'react';
import { Plus, X } from "lucide-react";

interface User {
  id: number;
  email: string;
  profileImage: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/users');
      const data = await response.json();

      const usersWithImages: User[] = data.map((user: any, index: number) => ({
        ...user,
        profileImage: `https://randomuser.me/api/portraits/lego/${index % 10}.jpg`, // Default random image
      }));

      setUsers(usersWithImages);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user via API
  const addUser = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.detail || 'Registration failed');
      }

      setFormData({ email: '', password: '' });
      setIsModalOpen(false);
      fetchUsers(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-lg sm:rounded-xl bg-gray-900 border border-gray-700 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Users</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="text-center text-red-400 mt-2">{error}</div>
      )}

      {/* Table */}
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs uppercase bg-gray-800 text-gray-400 text-center">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Profile</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-6 text-gray-500">No users found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="bg-gray-900 hover:bg-gray-800 transition text-center">
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-gray-600 mx-auto"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
    {isModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Add New User</h3>
            <button onClick={() => {
            setIsModalOpen(false);
            setFormData({ email: '', password: '' });
            setError('');
            }} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
            </button>
        </div>

        <div className="space-y-4">
            <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {!/\S+@\S+\.\S+/.test(formData.email) && formData.email && (
            <p className="text-red-400 text-sm">Enter a valid email.</p>
            )}

            <input
            type="password"
            placeholder="Password (min 6 characters)"
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {formData.password.length > 0 && formData.password.length < 6 && (
            <p className="text-red-400 text-sm">Password must be at least 6 characters.</p>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
            onClick={addUser}
            disabled={
                loading ||
                !/\S+@\S+\.\S+/.test(formData.email) ||
                formData.password.length < 6
            }
            className={`w-full px-4 py-2 rounded-md font-medium ${
                loading ||
                !/\S+@\S+\.\S+/.test(formData.email) ||
                formData.password.length < 6
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-cyan-600 hover:bg-cyan-700 text-white'
            }`}
            >
            {loading ? 'Saving...' : 'Save User'}
            </button>
        </div>
        </div>
    </div>
    )}

    </div>
  );
};

export default Users;
