import type { Product } from '@/features/product/types/product.types.ts';

interface RelatedProductProps {
  products: Product[];
  categoryName: string | null;
}

export function RelatedProducts({ products, categoryName }: RelatedProductProps) {
  return (
    <div className="space-y-6">
      {/* Tiêu đề lọc động theo Category dạng chuỗi sạch */}
      <h2 className="text-2xl font-bold text-gray-900">
        Sản phẩm {categoryName ? `thuộc danh mục ${categoryName}` : ''} liên quan
      </h2>

      {/* Grid 4 cột hiển thị danh sách sản phẩm mẫu */}
      <div className="grid grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id}
               className="group rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition cursor-pointer">

            {/* Khung ảnh cố định tỷ lệ aspect-[4/3] chống méo và vỡ layout */}
            <div className="aspect-4/3 w-full overflow-hidden rounded-lg bg-gray-50 mb-3">
              <img
                src={product.primaryImageUrl || '/placeholder.png'}
                alt={product.name}
                className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            {/* Chi tiết nội dung của Card */}
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition">
                {product.name}
              </h3>
              <p className="text-xs text-gray-400 font-medium">{product.brandName}</p>
              <p className="text-blue-600 font-bold text-sm pt-1">
                Từ {product.minPricePerDay.toLocaleString()}đ/ngày
              </p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
