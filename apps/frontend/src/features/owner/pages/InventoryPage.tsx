import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deviceService } from '../services/deviceService.ts';
import type { DeviceManage } from '../types/device.types.ts';

export default function InventoryPage() {
  const [items, setItems] = useState<DeviceManage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    deviceService.getMyInventory()
      .then((data) => {
        setItems(data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load inventory');
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading inventory...</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 min-h-screen bg-gray-50/50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Device Inventory</h1>
        <p className="text-gray-600 text-sm mt-1">Manage your rental devices</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No devices in your inventory yet.</p>
          <Link to="/register-device" className="mt-4 inline-block text-teal-700 hover:underline">
            Register your first device →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded shadow p-5 hover:shadow-md transition">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{item.productName}</h3>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Serial Number</p>
                      <p className="font-medium">{item.serialNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Price/Day</p>
                      <p className="font-medium">${item.pricePerDay}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Deposit</p>
                      <p className="font-medium">${item.depositValue}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Condition</p>
                      <p className="font-medium">{item.conditionPercent}%</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/dashboard/device/${item.id}/edit`}
                    className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded text-sm font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
