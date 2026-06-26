const accounts = [
  {
    id: 1,
    bank: 'Vietcombank',
    accountNumber: '****1234',
    accountHolder: 'NGUYEN VAN A',
    isDefault: true,
  },
  {
    id: 2,
    bank: 'ACB',
    accountNumber: '****5678',
    accountHolder: 'NGUYEN VAN A',
    isDefault: false,
  },
];

export function BankAccountList() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">
        Tài khoản đã liên kết
      </h3>

      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="rounded-xl border border-slate-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {account.bank}
                </div>

                <div className="text-sm text-slate-500">
                  {account.accountNumber}
                </div>

                <div className="text-sm text-slate-500">
                  {account.accountHolder}
                </div>
              </div>

              {account.isDefault && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">
                  Mặc định
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
