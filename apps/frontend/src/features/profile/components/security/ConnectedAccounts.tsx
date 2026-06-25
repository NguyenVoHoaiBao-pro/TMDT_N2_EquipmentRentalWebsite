const accounts = [
  {
    provider: 'Google',
    connected: true,
  },
  {
    provider: 'Facebook',
    connected: false,
  },
  {
    provider: 'Github',
    connected: false,
  },
];

export function ConnectedAccounts() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">
        Tài khoản liên kết
      </h3>

      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.provider}
            className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
          >
            <div>
              <div className="font-medium">
                {account.provider}
              </div>

              <div className="text-sm text-slate-500">
                {account.connected
                  ? 'Đã liên kết'
                  : 'Chưa liên kết'}
              </div>
            </div>

            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium
                ${
                account.connected
                  ? 'bg-red-50 text-red-600'
                  : 'bg-slate-900 text-white'
              }`}
            >
              {account.connected
                ? 'Hủy liên kết'
                : 'Liên kết'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
