// @/pages/home/HomePage.tsx
import { Link } from 'react-router-dom';
import { Camera, ShieldCheck, Zap } from 'lucide-react';

export function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Thuê Thiết Bị Nhiếp Ảnh Chuyên Nghiệp Giá Tốt
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Khám phá kho máy ảnh, ống kính và phụ kiện chất lượng cao sẵn sàng đồng hành cùng mọi dự án sáng tạo của
            bạn.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/products"
              className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition-colors shadow-md"
            >
              Xem danh sách thiết bị
            </Link>
            <Link
              to="/register-device"
              className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-3 rounded-md transition-colors border border-blue-400"
            >
              Cho thuê thiết bị của bạn
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12">
          Tại sao nên chọn dịch vụ của chúng tôi?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tính năng 1 */}
          <div className="bg-white p-6 rounded-lg border shadow-sm flex flex-col items-center text-center">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-4">
              <Camera className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-800">Thiết bị chính hãng</h3>
            <p className="text-sm text-gray-500">
              Toàn bộ máy ảnh và ống kính đều được kiểm định chất lượng, vệ sinh sạch sẽ trước khi bàn giao.
            </p>
          </div>

          {/* Tính năng 2 */}
          <div className="bg-white p-6 rounded-lg border shadow-sm flex flex-col items-center text-center">
            <div className="p-3 bg-green-100 text-green-600 rounded-full mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-800">Bảo hiểm an tâm</h3>
            <p className="text-sm text-gray-500">
              Chính sách bảo vệ và hỗ trợ người thuê rõ ràng, giảm thiểu rủi ro tối đa trong quá trình sử dụng.
            </p>
          </div>

          {/* Tính năng 3 */}
          <div className="bg-white p-6 rounded-lg border shadow-sm flex flex-col items-center text-center">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-800">Thủ tục nhanh gọn</h3>
            <p className="text-sm text-gray-500">
              Đặt lịch online, duyệt hồ sơ nhanh chóng, nhận máy trong ngày không tốn thời gian chờ đợi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
