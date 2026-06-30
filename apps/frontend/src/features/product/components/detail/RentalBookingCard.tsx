// @/features/product/components/detail/RentalBookingCard.tsx
interface RentalBookingCardProps {
  pricePerDay: number;
  depositValue: number;
  insurance: number;
  availability: string;
}

export function RentalBookingCard({ pricePerDay, depositValue, insurance, availability }: RentalBookingCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
      <div>
        <span className="text-3xl font-bold text-blue-600">{pricePerDay.toLocaleString()}đ</span>
        <span className="text-gray-500 text-sm"> / ngày</span>
      </div>

      <div className="flex justify-between items-center py-2 border-b border-gray-100 text-sm">
        <span className="text-gray-500">Trạng thái máy:</span>
        <span className={`font-semibold ${availability === 'AVAILABLE' ? 'text-green-600' : 'text-red-500'}`}>
          {availability === 'AVAILABLE' ? 'Sẵn sàng cho thuê' : 'Đã có lịch'}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Tiền đặt cọc:</span>
          <span className="font-medium text-gray-900">{depositValue.toLocaleString()}đ</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Phí bảo hiểm hư hại:</span>
          <span className="font-medium text-gray-900">{insurance.toLocaleString()}đ</span>
        </div>
      </div>

      <button
        disabled={availability !== 'AVAILABLE'}
        className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:bg-gray-200 disabled:text-gray-400"
      >
        Đặt lịch thuê ngay
      </button>
    </div>
  );
}
