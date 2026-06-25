const records = [
  {
    id: 1,
    action: 'Tạo yêu cầu KYC',
    date: '10/06/2026',
  },
  {
    id: 2,
    action: 'Upload CCCD',
    date: '10/06/2026',
  },
  {
    id: 3,
    action: 'KYC Approved',
    date: '11/06/2026',
  },
];

export function VerificationHistory() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">
        Lịch sử xác minh
      </h3>

      <div className="space-y-3">
        {records.map((record) => (
          <div
            key={record.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
          >
            <span>{record.action}</span>

            <span className="text-sm text-slate-500">
              {record.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
