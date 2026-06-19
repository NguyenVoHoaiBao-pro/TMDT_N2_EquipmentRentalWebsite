import { Fragment } from 'react';
import { ProductFilters } from '@/features/product/components/ProductFilters';
import ProductGrid from '@/features/product/components/ProductGrid';
import { ProductSort } from '@/features/product/components/ProductSort';
import { products } from '@/features/product/data/products';
import Sidebar from '@/components/layout/Sidebar';
import BackToTop from '@/components/layout/BackToTop';
import Pagination from '@/features/product/components/Pagination';
import { useProductFilter } from '@/features/product/hooks/useProducts';
import EmptyState from '@/features/product/components/EmptyState';
import { NOT_FOUND_MESSAGE, NOT_FOUND_TITLE } from '@/features/product/constants/defaultValues';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ProductCatalogPage() {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedBrands,
    setSelectedBrands,
    priceRange,
    setPriceRange,
    searchQuery,
    setSearchQuery,
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
      {/* Header with Logo + Navigation + Search + HeaderActions */}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Filters */}
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

        {/* Main Content */}
        <main className="flex-1 p-4">
          {/* Catalog Title + Sort */}
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Product Catalog</h1>
              <p className="text-sm text-gray-500">
                Our products are carefully selected...
              </p>
            </div>

            <ProductSort
              totalItems={filteredProducts.length}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortFieldChange={setSortField}
              onSortDirectionToggle={toggleSortDirection}
            />
          </div>

          {/* Products Grid or Empty State */}
          {paginatedProducts.length > 0 ? (
            <ProductGrid products={paginatedProducts} />
          ) : (
            <EmptyState
              title={NOT_FOUND_TITLE}
              description={NOT_FOUND_MESSAGE}
              icon="search"
              onAction={resetFilters}
              actionText="Clear Filters"
            />
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Back to top button */}
      <BackToTop />
    </Fragment>
  );
}
