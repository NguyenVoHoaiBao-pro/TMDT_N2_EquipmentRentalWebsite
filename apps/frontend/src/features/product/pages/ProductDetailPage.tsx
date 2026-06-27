import { ProductGallery } from '@/features/product/components/detail/ProductGallery.tsx';
import { ProductInfo } from '@/features/product/components/detail/ProductInfo.tsx';
import { ProductDetailTabs } from '@/features/product/components/detail/ProductDetailTabs.tsx';
import { RentalBookingCard } from '@/features/product/components/detail/RentalBookingCard.tsx';
import { RelatedProducts } from '@/features/product/components/detail/RelatedProducts.tsx';

import { getMockRelatedProducts, mockDeviceDetails } from '../data/productDetail.mock.ts';

export function ProductDetailPage() {
  const detailData = mockDeviceDetails[0];
  const allRelated = getMockRelatedProducts();

  const filteredProducts = allRelated
    .filter(p => p.categoryName === detailData.product.categoryName && p.id !== detailData.product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Cấu trúc Grid chính */}
      <div className="grid grid-cols-12 gap-8">

        {/* Cột Trái (Chiếm 8/12) - Thêm min-w-0 và tăng space-y lên 8 */}
        <div className="col-span-8 min-w-0 space-y-8">
          <ProductGallery images={detailData.device.images} />

          <ProductInfo
            product={detailData.product}
            owner={detailData.owner}
            conditionPercent={detailData.device.conditionPercent}
          />

          <ProductDetailTabs
            specifications={detailData.product.specifications}
            includedItems={detailData.product.includedItems}
            reviews={detailData.reviews}
          />
        </div>

        {/* Cột Phải (Chiếm 4/12) */}
        <div className="col-span-4">
          <div className="sticky top-24">
            <RentalBookingCard
              pricePerDay={detailData.device.pricePerDay}
              depositValue={detailData.device.depositValue}
              insurance={detailData.device.insurance}
              availability={detailData.device.availability}
            />
          </div>
        </div>

      </div>

      {/* Khối sản phẩm liên quan tách biệt bên dưới */}
      <div className="mt-12">
        <RelatedProducts products={filteredProducts} categoryName={detailData.product.categoryName} />
      </div>
    </div>
  );
}
