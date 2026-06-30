import { useCart } from '../hooks/useCart';
import { Trash2, ArrowLeft, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function CartPage() {
  const navigate = useNavigate();
  const { cart, isLoading, isError, removeFromCart } = useCart();

  // 1. Trạng thái đang tải dữ liệu
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500">Thùng xe đẩy đang được tải...</p>
      </div>
    );
  }

  // 2. Trạng thái lỗi hoặc giỏ hàng trống trống
  if (isError || !cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20 max-w-md mx-auto space-y-4">
        <h3 className="text-2xl font-bold text-gray-800">Giỏ hàng của bạn đang trống</h3>
        <p className="text-gray-500 text-sm">Hãy quay lại danh mục sản phẩm và lựa chọn những thiết bị nhiếp ảnh ưng ý
          nhất cho hành trình của mình.</p>
        <Link to="/products"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
          <ArrowLeft className="w-4 h-4" /> <span>Tiếp tục khám phá</span>
        </Link>
      </div>
    );
  }

  // 3. Hàm xử lý xóa món đồ khỏi giỏ
  const handleDeleteItem = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa thiết bị này khỏi giỏ hàng?')) {
      try {
        await removeFromCart(id);

      } catch {
        alert('Không thể xóa món đồ, vui lòng thử lại!');
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng của bạn</h1>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* CỘT TRÁI: DANH SÁCH CÁC THIẾT BỊ ĐÃ CHỌN THUÊ */}
        <div className="col-span-8 space-y-4">
          {cart.items.map((item) => (
            <div key={item.cartItemId}
                 className="flex bg-white border rounded-2xl p-4 shadow-sm group hover:border-gray-300 transition">
              {/* Ảnh thiết bị */}
              <img
                src={item.device.primaryImageUrl}
                alt={item.device.name}
                className="w-24 h-24 object-cover rounded-xl bg-gray-50 border shrink-0"
              />

              {/* Thông tin chi tiết */}
              <div className="ml-4 flex-1 flex flex-col justify-between text-left">
                <div>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                    Chủ máy: {item.device.ownerName}
                  </span>
                  <h3 className="font-semibold text-lg text-slate-800 mt-1 line-clamp-1">
                    {item.device.name}
                  </h3>

                  {/* Khoảng ngày thuê */}
                  <div className="flex items-center space-x-1.5 text-xs text-gray-500 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {new Date(item.startDate).toLocaleDateString('vi-VN')} - {new Date(item.endDate).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="text-teal-600 font-medium ml-1">({item.rentalDays} ngày)</span>
                  </div>
                </div>

                {/* Đơn giá từng món */}
                <div className="text-sm font-medium text-gray-400 mt-2">
                  Giá: <span
                  className="text-slate-700 font-semibold">{item.device.pricePerDay.toLocaleString('vi-VN')} đ</span> /ngày
                </div>
              </div>

              {/* Cột giá tổng item và nút xóa */}
              <div className="ml-6 flex flex-col justify-between items-end shrink-0">
                <button
                  onClick={() => handleDeleteItem(item.cartItemId)}
                  className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Tiền thuê tạm tính:</div>
                  <div className="font-bold text-teal-600 text-lg">
                    {item.subTotalRentalFee.toLocaleString('vi-VN')} ₫
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CỘT PHẢI: TÓM TẮT HÓA ĐƠN & TIẾN HÀNH CHECKOUT */}
        <div className="col-span-4 bg-gray-50 border rounded-2xl p-6 space-y-6 sticky top-28">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3">Tóm tắt đơn thuê</h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tổng tiền thuê máy:</span>
              <span className="font-medium text-gray-900">{cart.totalRentalFeeAll.toLocaleString('vi-VN')} ₫</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tổng tiền cọc thiết bị:</span>
              <span className="font-medium text-gray-900">{cart.totalDepositAll.toLocaleString('vi-VN')} ₫</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">* Tiền đặt cọc riêng của máy sẽ được chủ máy hoàn
              trả lại 100% cho bạn ngay sau khi hoàn thành bàn giao thiết bị sạch sẽ.</p>

            <div className="border-t pt-4 flex justify-between font-bold text-gray-900 text-lg">
              <span>Tổng chi phí:</span>
              <span className="text-teal-600">{cart.grandTotal.toLocaleString('vi-VN')} ₫</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')} // 💡 SẴN SÀNG CHUYỂN SANG LUỒNG THANH TOÁN TIẾP THEO
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition shadow-sm"
          >
            Tiến hành thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
