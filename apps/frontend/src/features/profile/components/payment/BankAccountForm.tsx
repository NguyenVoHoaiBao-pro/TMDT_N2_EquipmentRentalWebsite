import { useState } from 'react';

export function BankAccountForm() {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">
        Thêm tài khoản ngân hàng
      </h3>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Tên ngân hàng"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />

        <input
          type="text"
          placeholder="Số tài khoản"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />

        <input
          type="text"
          placeholder="Tên chủ tài khoản"
          value={accountHolder}
          onChange={(e) => setAccountHolder(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />

        <button className="rounded-xl bg-slate-900 px-5 py-3 text-white">
          Thêm tài khoản
        </button>
      </div>
    </div>
  );
}
