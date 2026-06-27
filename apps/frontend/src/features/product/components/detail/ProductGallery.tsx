import type { ProductImage } from '@/features/product/types/product.types.ts';

interface ProductGalleryProps {
  images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  // Tìm ảnh chính, nếu không có thì lấy ảnh đầu tiên
  const primaryImage = images.find((img) => img.isPrimary) || images[0];
  // Lấy danh sách ảnh phụ làm thumbnail (tối đa 5 ảnh)
  const thumbnails = images.slice(0, 5);

  return (
    <div className="rounded-xl border bg-white p-4 space-y-4">
      {/* Khung ảnh lớn chính - Sử dụng aspect ratio */}
      <div className="aspect-4/3 w-full overflow-hidden rounded-xl bg-gray-100">
        {primaryImage ? (
          <img
            src={primaryImage.imageUrl}
            alt="Product Primary"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">No Image</div>
        )}
      </div>

      {/* Danh sách ảnh nhỏ Thumbnail bên dưới */}
      <div className="grid grid-cols-5 gap-3">
        {thumbnails.map((image) => (
          <div
            key={image.id}
            className={`aspect-square overflow-hidden rounded-lg border bg-gray-50 cursor-pointer hover:opacity-80 transition ${
              image.isPrimary ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200'
            }`}
          >
            <img
              src={image.imageUrl}
              alt="Thumbnail"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
