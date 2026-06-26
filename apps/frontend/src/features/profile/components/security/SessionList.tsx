const sessions = [
  {
    id: 1,
    device: 'Chrome • Windows 11',
    current: true,
    lastActive: 'Hiện tại',
  },
  {
    id: 2,
    device: 'Safari • iPhone',
    current: false,
    lastActive: '2 ngày trước',
  },
  {
    id: 3,
    device: 'Edge • Windows',
    current: false,
    lastActive: '5 ngày trước',
  },
];

export function SessionList() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Phiên đăng nhập
        </h3>

        <button
          className="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-600"
        >
          Đăng xuất tất cả
        </button>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
          >
            <div>
              <div className="font-medium">
                {session.device}
              </div>

              <div className="text-sm text-slate-500">
                {session.lastActive}
              </div>
            </div>

            {session.current ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                Hiện tại
              </span>
            ) : (
              <button
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                Đăng xuất
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
