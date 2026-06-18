import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

import { ProductFilters } from '@/features/product/components/ProductFilters';
import ProductGrid from '@/features/product/components/ProductGrid';
import { ProductSort } from '@/features/product/components/ProductSort';
import { products } from '@/features/product/data/products.ts';
import Sidebar from '@/components/layout/Sidebar';
import { Fragment } from 'react';
import BackToTop from '@/components/layout/BackToTop.tsx';
import Pagination from '@/features/product/components/Pagination.tsx';
import { useProductFilter } from '@/features/product/hooks/useProducts.ts';

export default function ProductCatalogPage() {

  const {
    selectedCategory,
    setSelectedCategory,
    selectedBrands,
    setSelectedBrands,
    priceRange,
    setPriceRange,
    filteredProducts,
    paginatedProducts,
    resetFilters,
    sortField,
    setSortField,
    sortDirection,
    toggleSortDirection,

    currentPage,
    setCurrentPage,
    totalPages,
  } = useProductFilter(products);

  return (
    <Fragment>
      <Navbar />

      <div className="flex flex-col lg:flex-row">
        <Sidebar>
          <ProductFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedBrands={selectedBrands}
            onBrandChange={setSelectedBrands}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            resetFilters={resetFilters}
          />
        </Sidebar>

        <main className="flex-1 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Product Catalog</h1>

              <p className="text-sm text-gray-500">Our products are carefully selected...</p>
            </div>

            <ProductSort
              totalItems={
                filteredProducts.length
              }
              sortField={sortField}
              sortDirection={sortDirection}
              onSortFieldChange={
                setSortField
              }
              onSortDirectionToggle={
                toggleSortDirection
              }
            />
          </div>

          <ProductGrid
            products={paginatedProducts}
          />


          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>

      <Footer />
      {/* Back to top button */}
      <BackToTop />
    </Fragment>
  );
}
