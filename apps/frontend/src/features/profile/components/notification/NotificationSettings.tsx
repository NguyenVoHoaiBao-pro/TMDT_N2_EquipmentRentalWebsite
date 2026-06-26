import { useState } from 'react';

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailBooking: true,
    emailPayment: true,
    smsBooking: false,
    smsOtp: true,
    pushNotification: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">
        Cài đặt thông báo
      </h3>

      <div className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between"
          >
            <span>{key}</span>

            <input
              type="checkbox"
              checked={value}
              onChange={() =>
                toggle(key as keyof typeof settings)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
