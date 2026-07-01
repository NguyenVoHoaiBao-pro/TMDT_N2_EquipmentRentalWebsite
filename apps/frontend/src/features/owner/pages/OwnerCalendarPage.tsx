import { useEffect, useState } from 'react';
import apiClient from '@/services/api.ts';

export default function OwnerCalendarPage() {
  const [deviceId, setDeviceId] = useState<number | null>(null);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    if (!deviceId) return;
    apiClient.get(`/devices/${deviceId}/calendar/future`)
      .then((data: any) => setBlockedDates(data))
      .catch(err => { console.error(err); });
  }, [deviceId]);

  const handleBlock = async () => {
    if (!deviceId) return alert('Choose device id');
    try {
      await apiClient.post(`/devices/${deviceId}/calendar/block`, { startDate: start, endDate: end });
      alert('Blocked');
    } catch (e) { console.error(e); alert('Failed'); }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 min-h-screen bg-gray-50/50">
      <h1 className="text-2xl font-bold mb-4">Device Calendar</h1>
      <div className="space-y-4">
        <div className="p-4 bg-white rounded shadow">
          <label className="block">Device ID (enter a number)</label>
          <input className="border p-2 mt-1" value={deviceId ?? ''} onChange={e => setDeviceId(Number(e.target.value) || null)} />
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Future Blocked Dates</h3>
          <ul>
            {blockedDates.map(d => <li key={d}>{d}</li>)}
          </ul>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Block Range</h3>
          <input type="date" value={start} onChange={e => setStart(e.target.value)} className="border p-2 mr-2" />
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="border p-2 mr-2" />
          <button onClick={handleBlock} className="ml-2 bg-teal-700 text-white px-3 py-1 rounded">Block</button>
        </div>
      </div>
    </main>
  );
}


