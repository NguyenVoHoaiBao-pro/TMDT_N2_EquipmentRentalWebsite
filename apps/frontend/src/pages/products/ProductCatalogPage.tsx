// @/features/product/pages/ProductCatalogPage.tsx
import { Fragment } from 'react';
import { ProductFilters } from '@/features/product/components/ProductFilters';
import ProductGrid from '@/features/product/components/ProductGrid';
import { ProductSort } from '@/features/product/components/ProductSort';
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
    selectedCategory, setSelectedCategory,
    selectedBrands, setSelectedBrands,
    priceRange, setPriceRange,
    searchQuery, setSearchQuery,
    paginatedProducts,
    filteredProducts,
    resetFilters,
    sortField, setSortField,
    sortDirection, toggleSortDirection,
    currentPage, setCurrentPage,
    totalPages,
    isLoading,
    isError,
  } = useProductFilter();

  // Handling Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-500 font-medium">Đang tải danh sách thiết bị...</span>
      </div>
    );
  }

  // Handling Error State
  if (isError) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-red-600">Mất kết nối với máy chủ</h3>
        <p className="text-gray-500 mt-2">Vui lòng kiểm tra lại kết nối tới server.
        </p>
      </div>
    );
  }

  return (
    <Fragment>
      <Header showSearch={true} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

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
              <h2 className="text-3xl font-bold">Product Catalog</h2>
              <p className="text-sm text-gray-500">Các thiết bị nhiếp ảnh chuyên nghiệp sẵn sàng cho thuê</p>
            </div>
            <ProductSort
              totalItems={filteredProducts.length}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortFieldChange={setSortField}
              onSortDirectionToggle={toggleSortDirection}
            />
          </div>

          {paginatedProducts.length > 0 ? (
            <ProductGrid products={paginatedProducts} />
          ) : (
            <EmptyState
              title={NOT_FOUND_TITLE}
              description={NOT_FOUND_MESSAGE}
              icon="search"
              onAction={resetFilters}
              actionText="Xóa bộ lọc"
            />
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages} // Retrieve from backend
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
      <Footer />
      <BackToTop />
    </Fragment>
  );
}

