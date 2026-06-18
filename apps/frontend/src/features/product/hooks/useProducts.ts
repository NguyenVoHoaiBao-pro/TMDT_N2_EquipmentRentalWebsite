import type { Product } from '@/features/product/types/product.types.ts';
import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_PRICE_RANGE, ITEMS_PER_PAGE } from '@/features/product/constants/defaultValues.ts';

export function useProductFilter(products: Product[]) {

  // State for filtering products
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);

  const [sortField, setSortField] =
    useState<'name' | 'price'>('name');

  const [sortDirection, setSortDirection] =
    useState<'asc' | 'desc'>('asc');

  // Current page state
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrands, priceRange, sortField, sortDirection]);

  const filteredProducts = useMemo(() => {
    const result = products.filter((p) => {
      const categoryMatch =
        selectedCategory === 'All' || p.category === selectedCategory;

      const brandMatch =
        selectedBrands.length === 0 || selectedBrands.includes(p.brand);

      const priceMatch =
        p.price >= priceRange[0] && p.price <= priceRange[1];

      return categoryMatch && brandMatch && priceMatch;
    });

    const productSorted = [...result];

    productSorted.sort((a, b) => {
      if (sortField === 'price') {
        return sortDirection === 'asc'
          ? a.price - b.price
          : b.price - a.price;
      }

      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });

    return productSorted;

  }, [products, selectedCategory, selectedBrands, priceRange, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const toggleSortDirection = () => {
    setSortDirection((prev) =>
      prev === 'asc' ? 'desc' : 'asc',
    );
  };

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);


  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrands([]);
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSortField('name');
    setSortDirection('asc');
    setCurrentPage(1); // Reset to first page
  };

  // Export state for UI components
  return {
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

    // Pagination state
    currentPage,
    setCurrentPage,
    totalPages,
  };
}

