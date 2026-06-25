const loginHistory = [
  {
    id: 1,
    device: 'Chrome • Windows 11',
    ip: '192.168.xxx.xxx',
    time: 'Hôm nay 08:30',
  },
  {
    id: 2,
    device: 'Safari • iPhone',
    ip: '192.168.xxx.xxx',
    time: 'Hôm qua 22:15',
  },
  {
    id: 3,
    device: 'Edge • Windows',
    ip: '192.168.xxx.xxx',
    time: '3 ngày trước',
  },
];

export function LoginHistory() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">
        Lịch sử đăng nhập
      </h3>

      <div className="space-y-3">
        {loginHistory.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 p-4"
          >
            <div className="font-medium">
              {item.device}
            </div>

            <div className="mt-1 text-sm text-slate-500">
              IP: {item.ip}
            </div>

            <div className="text-sm text-slate-500">
              {item.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
