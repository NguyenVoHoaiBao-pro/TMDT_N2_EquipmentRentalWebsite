import { ProductGallery } from '@/features/product/components/detail/ProductGallery.tsx';
import { ProductInfo } from '@/features/product/components/detail/ProductInfo.tsx';
import { ProductDetailTabs } from '@/features/product/components/detail/ProductDetailTabs.tsx';
import { RentalBookingCard } from '@/features/product/components/detail/RentalBookingCard.tsx';
import { RelatedProducts } from '@/features/product/components/detail/RelatedProducts.tsx';

export function ProductDetailPage() {
  return (<>
    <div className="mx-auto max-w-7xl px-6 py-8">

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-8">

        {/* Left */}
        <div className="col-span-8 space-y-6">

          <ProductGallery />

          <ProductInfo />

          <ProductDetailTabs />

        </div>

        {/* Right */}
        <div className="col-span-4">
          <div className="sticky top-24">
            <RentalBookingCard />
          </div>
        </div>

      </div>

      {/* Related */}
      <div className="mt-12">
        <RelatedProducts />
      </div>

    </div>
  </>);
}
