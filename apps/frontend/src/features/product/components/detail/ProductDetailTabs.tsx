import type { Review, Specification } from '@/features/product/types/product.types.ts';

interface ProductDetailTabsProps {
  specifications: Specification[];
  includedItems: string[];
  reviews: Review[];
}

export function ProductDetailTabs({ specifications, includedItems, reviews }: ProductDetailTabsProps) {
  return (
    <div className="rounded-xl border bg-white p-6 space-y-6">
      {/* 1. Phần Thông số kỹ thuật */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Thông số kỹ thuật</h2>
        <table className="w-full text-sm">
          <tbody>
          {specifications.map((spec) => (
            <tr key={spec.label} className="border-b border-gray-100 last:border-0">
              <td className="py-3 font-medium text-gray-500 w-1/3">{spec.label}</td>
              <td className="py-3 text-gray-900">{spec.value}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* 2. Phần Phụ kiện đi kèm */}
      <div className="pt-4 border-t border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Vật phẩm đi kèm</h2>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          {includedItems.map((item, index) => (
            <li className="text-left" key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 3. Phần Đánh giá từ người dùng */}
      <div className="pt-4 border-t border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Đánh giá thực tế</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm text-gray-800">{review.username}</span>
                <span className="text-yellow-500 text-sm">★ {review.rating}/5</span>
              </div>
              <p className="text-sm text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
