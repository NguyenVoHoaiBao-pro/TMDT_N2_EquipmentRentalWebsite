import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '@/services/api.ts';

interface AdminStats {
  totalUsers: number;
  totalOwners: number;
  totalRenters: number;
  activeUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiClient.get('/admin/overview');
        setStats(data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const StatCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
    <div className={`p-4 rounded shadow text-white ${color}`}>
      <p className="text-sm font-medium opacity-90">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 min-h-screen bg-gray-50/50">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Stats Section */}
      {loading ? (
        <div className="text-gray-600 mb-8">Loading dashboard data...</div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers} color="bg-blue-600" />
          <StatCard title="Total Owners" value={stats.totalOwners} color="bg-green-600" />
          <StatCard title="Total Renters" value={stats.totalRenters} color="bg-purple-600" />
          <StatCard title="Active Users" value={stats.activeUsers} color="bg-indigo-600" />
        </div>
      ) : null}

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Management Panels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/admin/users"
          className="p-6 bg-white rounded shadow hover:shadow-lg transition text-center hover:text-blue-600"
        >
          <div className="text-3xl mb-2">👥</div>
          <div className="font-semibold">Manage Users</div>
          <div className="text-sm text-gray-600 mt-1">View, filter, and edit user roles</div>
        </Link>

        <Link
          to="/admin/devices"
          className="p-6 bg-white rounded shadow hover:shadow-lg transition text-center hover:text-blue-600"
        >
          <div className="text-3xl mb-2">✅</div>
          <div className="font-semibold">Device Approval</div>
          <div className="text-sm text-gray-600 mt-1">Review and approve pending devices</div>
        </Link>
      </div>
    </main>
  );
}

