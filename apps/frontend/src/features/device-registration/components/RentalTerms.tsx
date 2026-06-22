// @/features/device-registration/components/RentalTerms.tsx
interface RentalTermsProps {
  price: string;
  onPriceChange: (val: string) => void;
  deposit: string;
  onDepositChange: (val: string) => void;
}

export function RentalTerms({ price, onPriceChange, deposit, onDepositChange }: RentalTermsProps) {
  return (
    <div className="bg-white p-6 border rounded-xl shadow-sm space-y-5 text-left">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Rental Terms</h2>
        <p className="text-xs text-gray-500 mt-0.5">Set up your rental pricing structure and deposit safety
          requirements.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Daily Rental Price (VNĐ) <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-lg shadow-sm">
            <input
              type="number"
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              placeholder="Nhập giá thuê mỗi ngày..."
              className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Security Deposit (VNĐ) <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-lg shadow-sm">
            <input
              type="number"
              value={deposit}
              onChange={(e) => onDepositChange(e.target.value)}
              placeholder="Nhập giá trị đặt cọc máy..."
              className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
