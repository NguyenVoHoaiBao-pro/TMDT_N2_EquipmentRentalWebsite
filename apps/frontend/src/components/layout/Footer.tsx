import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ChevronRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-4">EquipRent</h3>
            <p className="text-gray-400 leading-relaxed">
              Nền tảng thuê thiết bị chuyên nghiệp hàng đầu Việt Nam. 
              Chúng tôi cung cấp giải pháp thuê thiết bị tối ưu cho mọi nhu cầu của bạn.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors text-xl">
                📘
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors text-xl">
                🐦
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors text-xl">
                📷
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors text-xl">
                💼
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liên Kết Nhanh</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/home" className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link to="/products" className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Sản Phẩm
                </Link>
              </li>
              <li>
                <Link to="/about" className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Liên Hệ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Danh Mục</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Máy Xây Dựng
                </Link>
              </li>
              <li>
                <Link to="/products" className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Thiết Bị IT
                </Link>
              </li>
              <li>
                <Link to="/products" className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Âm Thanh & Ánh Sáng
                </Link>
              </li>
              <li>
                <Link to="/products" className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Thiết Bị Sự Kiện
                </Link>
              </li>
              <li>
                <Link to="/products" className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Văn Phòng Phẩm
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liên Hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Nguyễn Huệ, Quận 1,<br />
                  TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <a href="tel:+842812345678" className="text-gray-400 hover:text-white transition-colors">
                  +84 28 1234 5678
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <a href="mailto:info@equiprent.vn" className="text-gray-400 hover:text-white transition-colors">
                  info@equiprent.vn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 EquipRent Marketplace. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Chính Sách Bảo Mật
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Điều Khoản Sử Dụng
              </Link>
              <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
