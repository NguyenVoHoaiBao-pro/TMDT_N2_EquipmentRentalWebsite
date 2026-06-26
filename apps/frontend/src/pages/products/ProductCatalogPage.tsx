import { useMemo } from 'react';
import SiteLayout from '@/components/layout/SiteLayout';
import { ProductFilters } from '@/features/product/components/ProductFilters';
import ProductGrid from '@/features/product/components/ProductGrid';
import { ProductSort } from '@/features/product/components/ProductSort';
import Sidebar from '@/components/layout/Sidebar';
import Pagination from '@/features/product/components/Pagination';
import { useProductFilter } from '@/features/product/hooks/useProducts';
import EmptyState from '@/features/product/components/EmptyState';
import { NOT_FOUND_MESSAGE, NOT_FOUND_TITLE } from '@/features/product/constants/defaultValues';
import { useProducts } from '@/hooks/useProducts';
import {
  mapApiProductsToLocal,
  deriveCategories,
  deriveBrands,
} from '@/features/product/utils/product.mapper';
import { Loader2 } from 'lucide-react';

export default function ProductCatalogPage() {
  const { data, isLoading, isError } = useProducts(0, 200);

  const products = useMemo(
    () => mapApiProductsToLocal(data?.content ?? []),
    [data],
  );

  const categories = useMemo(() => deriveCategories(products), [products]);
  const brands = useMemo(() => deriveBrands(products), [products]);
  const maxPrice = useMemo(
    () => (products.length > 0 ? Math.max(...products.map((p) => p.price)) : 1000000),
    [products],
  );

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
    <SiteLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
        <Sidebar>
          <ProductFilters
            categories={categories}
            brands={brands}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedBrands={selectedBrands}
            onBrandChange={setSelectedBrands}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            maxPrice={maxPrice}
            resetFilters={resetFilters}
          />
        </Sidebar>

        <main className="flex-1 p-6 lg:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8">
            <div>
              <p className="font-sora text-cine-cyan text-sm font-medium uppercase tracking-widest mb-2">
                Inventory
              </p>
              <h1 className="font-sora text-3xl font-bold text-white">Browse Equipment</h1>
              <p className="text-sm text-gray-500 mt-1">
                Professional cinema gear — curated and field-tested.
              </p>
            </div>

            {!isLoading && !isError && (
              <ProductSort
                totalItems={filteredProducts.length}
                sortField={sortField}
                sortDirection={sortDirection}
                onSortFieldChange={setSortField}
                onSortDirectionToggle={toggleSortDirection}
              />
            )}
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <Loader2 className="w-10 h-10 text-cine-cyan animate-spin" />
              <p className="font-sora text-gray-500">Loading equipment from database...</p>
            </div>
          )}

          {isError && (
            <EmptyState
              title="Failed to load products"
              description="Could not connect to the server. Please check your connection and try again."
              icon="package"
            />
          )}

          {!isLoading && !isError && paginatedProducts.length > 0 && (
            <ProductGrid products={paginatedProducts} />
          )}

          {!isLoading && !isError && paginatedProducts.length === 0 && (
            <EmptyState
              title={NOT_FOUND_TITLE}
              description={NOT_FOUND_MESSAGE}
              icon="search"
              onAction={resetFilters}
              actionText="Clear Filters"
            />
          )}

          {!isLoading && !isError && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
      </div>
    </SiteLayout>
  );
}
