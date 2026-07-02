import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '@/services/api.ts';

interface OwnerStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  activeRentals: number;
  totalRevenue: number;
}

export default function OwnerDashboard() {
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiClient.get('/orders/owner/overview');
        setStats(data.data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const StatCard = ({ title, value, color }: { title: string; value: number | string; color: string }) => (
    <div className={`p-4 rounded shadow text-white ${color}`}>
      <p className="text-sm font-medium opacity-90">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 min-h-screen bg-gray-50/50">
      <h1 className="text-3xl font-bold mb-8">Owner Dashboard</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Stats Section */}
      {loading ? (
        <div className="text-gray-600 mb-8">Loading dashboard data...</div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Total Orders" value={stats.totalOrders} color="bg-blue-600" />
          <StatCard title="Pending Orders" value={stats.pendingOrders} color="bg-yellow-600" />
          <StatCard title="Confirmed" value={stats.confirmedOrders} color="bg-green-600" />
          <StatCard title="Active Rentals" value={stats.activeRentals} color="bg-purple-600" />
          <StatCard
            title="Total Revenue"
            value={typeof stats.totalRevenue === 'number' ? `$${stats.totalRevenue.toFixed(2)}` : stats.totalRevenue}
            color="bg-indigo-600"
          />
        </div>
      ) : null}

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/dashboard/inventory"
          className="p-6 bg-white rounded shadow hover:shadow-lg transition text-center hover:text-blue-600"
        >
          <div className="text-3xl mb-2">📦</div>
          <div className="font-semibold">Manage Devices</div>
          <div className="text-sm text-gray-600 mt-1">View and edit your devices</div>
        </Link>

        <Link
          to="/dashboard/calendar"
          className="p-6 bg-white rounded shadow hover:shadow-lg transition text-center hover:text-blue-600"
        >
          <div className="text-3xl mb-2">📅</div>
          <div className="font-semibold">Calendar</div>
          <div className="text-sm text-gray-600 mt-1">Block and manage availability</div>
        </Link>

        <Link
          to="/dashboard/orders"
          className="p-6 bg-white rounded shadow hover:shadow-lg transition text-center hover:text-blue-600"
        >
          <div className="text-3xl mb-2">📋</div>
          <div className="font-semibold">Orders</div>
          <div className="text-sm text-gray-600 mt-1">Confirm or reject rental requests</div>
        </Link>

        <Link
          to="/dashboard/incidents"
          className="p-6 bg-white rounded shadow hover:shadow-lg transition text-center hover:text-blue-600"
        >
          <div className="text-3xl mb-2">⚠️</div>
          <div className="font-semibold">Incidents</div>
          <div className="text-sm text-gray-600 mt-1">Report and track equipment issues</div>
        </Link>

        <Link
          to="/invoices"
          className="p-6 bg-white rounded shadow hover:shadow-lg transition text-center hover:text-blue-600"
        >
          <div className="text-3xl mb-2">🧾</div>
          <div className="font-semibold">Invoices</div>
          <div className="text-sm text-gray-600 mt-1">View your rental invoices</div>
        </Link>
      </div>
    </main>
  );
}


