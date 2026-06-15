import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

import { ProductFilters } from '@/features/product/components/ProductFilters';
import ProductGrid from '@/features/product/components/ProductGrid';
import { ProductSort } from '@/features/product/components/ProductSort';
import { products } from '@/features/product/data/products.ts';
import Sidebar from '@/components/layout/Sidebar';
import { Fragment, useState } from 'react';
import BackToTop from '@/components/layout/BackToTop.tsx';
import Pagination from '@/features/product/components/Pagination.tsx';

export default function ProductCatalogPage() {

  // const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <Fragment>
      <Navbar />

      <div className="flex flex-col lg:flex-row">
        <Sidebar>
          <ProductFilters />
        </Sidebar>

        <main className="flex-1 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Product Catalog</h1>

              <p className="text-sm text-gray-500">Our products are carefully selected...</p>
            </div>

            <ProductSort />
          </div>

          <ProductGrid products={products} />

          <Pagination />
        </main>
      </div>

      <Footer />
      {/* Back to top button */}
      <BackToTop />
    </Fragment>
  );
}
