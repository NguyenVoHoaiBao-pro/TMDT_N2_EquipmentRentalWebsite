import { Link } from 'react-router-dom';

export default function OwnerDashboard() {
  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 min-h-screen bg-gray-50/50">
      <h1 className="text-2xl font-bold mb-4">Owner Dashboard (MVP)</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/dashboard/inventory" className="p-6 bg-white rounded shadow">Your Devices</Link>
        <Link to="/dashboard/calendar" className="p-6 bg-white rounded shadow">Device Calendar</Link>
        <Link to="/dashboard/orders" className="p-6 bg-white rounded shadow">Orders</Link>
      </div>
    </main>
  );
}


