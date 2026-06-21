import { useState } from 'react';

export function RentalTerms() {
  const [price, setPrice] = useState('');
  const [deposit, setDeposit] = useState('');

  return (
    <div className="bg-white p-6 border rounded-xl shadow-sm space-y-5 text-left">
      {/* Header Card */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Rental Terms</h2>
        <p className="text-xs text-gray-500 mt-0.5">Set up your rental pricing structure and deposit safety
          requirements.</p>
      </div>

      {/* Grid chia 2 cột nhập liệu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Field: Daily Rental Price */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Daily Rental Price <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm">$</span>
            </div>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              className="w-full border rounded-lg p-2 pl-7 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-xs">/ day</span>
            </div>
          </div>
        </div>

        {/* Field: Security Deposit */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Security Deposit <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm">$</span>
            </div>
            <input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              placeholder="0.00"
              min="0"
              className="w-full border rounded-lg p-2 pl-7 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

      </div>

      {/* Helper Note */}
      <p className="text-[11px] text-gray-400 leading-normal">
        * Note: EquipRent charges a 10% platform service fee on successful transactions. Your clear payout calculation
        will be generated during transaction processing.
      </p>
    </div>
  );
}
