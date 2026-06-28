import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { productService } from '../services/product.service.ts';
import { getMockRelatedProducts } from '../data/productDetail.mock.ts';
import { ProductGallery } from '@/features/product/components/detail/ProductGallery.tsx';
import { ProductInfo } from '@/features/product/components/detail/ProductInfo.tsx';
import { ProductDetailTabs } from '@/features/product/components/detail/ProductDetailTabs.tsx';
import { RentalBookingCard } from '@/features/product/components/detail/RentalBookingCard.tsx';
import { RelatedProducts } from '@/features/product/components/detail/RelatedProducts.tsx';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  // Sử dụng useQuery thay cho useEffect + useState
  const { data: detailData, isLoading, isError } = useQuery({
    queryKey: ['deviceDetail', id],
    queryFn: () => productService.getDeviceDetail(id!),
    enabled: !!id, // Chỉ kích hoạt khi có ID trên URL
  });

  if (isLoading) return <div className="text-center py-20">Đang tải thông tin...</div>;
  if (isError || !detailData) return <div className="text-center py-20 text-red-500">Lỗi tải dữ liệu hoặc thiết bị không
    tồn tại.</div>;

  // Logic sản phẩm liên quan giữ nguyên
  const allRelated = getMockRelatedProducts();
  const filteredProducts = allRelated
    .filter(p => p.categoryName === detailData.product.categoryName && p.id !== detailData.product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid grid-cols-12 gap-8">
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
      <div className="mt-12">
        <RelatedProducts products={filteredProducts} categoryName={detailData.product.categoryName} />
      </div>
    </div>
  );
}
