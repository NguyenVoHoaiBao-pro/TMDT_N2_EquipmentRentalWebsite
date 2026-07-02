import { useEffect, useState } from 'react';
import apiClient from '@/services/api.ts';

interface Order {
  orderId: number;
  status: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  renterUsername: string;
  renterPhone?: string;
  renterEmail?: string;
  deviceNames: string[];
}

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get('/orders/owner');
      setOrders(data.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleConfirm = async (orderId: number) => {
    setActionLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      const response = await apiClient.post(`/orders/${orderId}/owner/confirm`, {});
      // Update the order in the list
      setOrders(orders.map(o => o.orderId === orderId ? response.data : o));
      alert('Order confirmed successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to confirm order');
    } finally {
      setActionLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleReject = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to reject this order?')) return;

    setActionLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      const response = await apiClient.post(`/orders/${orderId}/owner/reject`, {});
      // Update the order in the list
      setOrders(orders.map(o => o.orderId === orderId ? response.data : o));
      alert('Order rejected successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to reject order');
    } finally {
      setActionLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const canConfirm = (status: string) => status === 'PAID';
  const canReject = (status: string) => status === 'PAID' || status === 'PENDING_PAYMENT';

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 min-h-screen bg-gray-50/50">
      <h1 className="text-2xl font-bold mb-4">Orders for My Devices</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.orderId} className="p-4 bg-white rounded shadow hover:shadow-md transition">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold">Order #{o.orderId}</h3>
                  <p className="text-sm text-gray-600">Renter: {o.renterUsername}</p>
                  <p className="text-sm text-gray-600">
                    Email: {o.renterEmail || 'N/A'} | Phone: {o.renterPhone || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">Dates: {o.startDate} → {o.endDate}</p>
                  <p className="text-sm font-medium">Total: ${o.totalPrice}</p>
                  <p className="text-sm">Devices: {o.deviceNames?.join(', ')}</p>
                </div>
                <div className="text-right">
                  <div className="mb-3">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      o.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      o.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                      o.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {o.status}
                    </span>
                  </div>
                  <div className="space-x-2">
                    {canConfirm(o.status) && (
                      <button
                        onClick={() => handleConfirm(o.orderId)}
                        disabled={actionLoading[o.orderId]}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading[o.orderId] ? 'Confirming...' : 'Confirm'}
                      </button>
                    )}
                    {canReject(o.status) && (
                      <button
                        onClick={() => handleReject(o.orderId)}
                        disabled={actionLoading[o.orderId]}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading[o.orderId] ? 'Rejecting...' : 'Reject'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}


