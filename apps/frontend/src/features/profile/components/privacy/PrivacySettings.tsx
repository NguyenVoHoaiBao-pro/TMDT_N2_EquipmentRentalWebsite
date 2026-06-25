import { useState } from 'react';

export function PrivacySettings() {
  const [privacy, setPrivacy] = useState({
    showEmail: false,
    showPhone: false,
    showOnlineStatus: true,
  });

  const toggle = (key: keyof typeof privacy) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">
        Quyền riêng tư
      </h3>

      <div className="space-y-4">
        {Object.entries(privacy).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between"
          >
            <span>{key}</span>

            <input
              type="checkbox"
              checked={value}
              onChange={() =>
                toggle(key as keyof typeof privacy)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
