import { Link } from 'react-router-dom'; // 1. NHỚ IMPORT LINK
import { type Product } from '@/features/product/types/product.types.ts';

interface ProductProps {
  product: Product;
}

export default function ProductCard({ product }: ProductProps) {
  return (
    // 2. Đổi thẻ div ngoài cùng thành thẻ Link
    <Link
      to={`/products/${product.id}`}
      className="bg-white border rounded-xl overflow-hidden flex flex-col group hover:shadow-lg transition cursor-pointer"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
        <img
          src={product.primaryImageUrl || 'https://placehold.co'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <span className={`absolute top-3 left-3 text-white px-2 py-1 text-xs rounded font-medium ${
          product.status === 'AVAILABLE' ? 'bg-green-500' : 'bg-gray-500'
        }`}>
          {product.status === 'AVAILABLE' ? 'Còn máy' : 'Hết máy'}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 space-y-2 text-left">
        <span className="text-blue-600 uppercase text-xs font-semibold tracking-wider">
          {product.brandName || 'Đang cập nhật'}
        </span>

        <h3 className="font-semibold text-base text-slate-800 line-clamp-2 min-h-12">
          {product.name}
        </h3>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium">Giá thuê từ:</span>
            <span className="font-bold text-teal-600 text-lg">
              {product.minPricePerDay ? `${product.minPricePerDay.toLocaleString('vi-VN')} ₫` : '0 ₫'}
              <span className="text-xs text-gray-400 font-normal">/ngày</span>
            </span>
          </div>

          {/* 3. Đổi button thành span để tránh lỗi lồng thẻ tương tác (Interactive Content) */}
          <span
            className="bg-blue-600 group-hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shrink-0">
            Xem chi tiết
          </span>
        </div>
      </div>
    </Link>
  );
}
