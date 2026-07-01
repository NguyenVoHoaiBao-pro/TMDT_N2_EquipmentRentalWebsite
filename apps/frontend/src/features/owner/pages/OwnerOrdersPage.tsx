import { useEffect, useState } from 'react';
import apiClient from '@/services/api.ts';

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/orders/owner')
      .then((data: any) => setOrders(data))
      .catch(err => { console.error(err); alert('Failed to load orders'); });
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 min-h-screen bg-gray-50/50">
      <h1 className="text-2xl font-bold mb-4">Orders for My Devices</h1>
      {orders.length === 0 && <p>No orders yet.</p>}

      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.orderId} className="p-4 bg-white rounded shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">Order #{o.orderId}</h3>
                <p>Renter: {o.renterUsername}</p>
                <p>Dates: {o.startDate} → {o.endDate}</p>
                <p>Total: {o.totalPrice}</p>
              </div>
              <div>
                <p className="text-sm">Status: {o.status}</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm">Devices: {o.deviceNames?.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}


