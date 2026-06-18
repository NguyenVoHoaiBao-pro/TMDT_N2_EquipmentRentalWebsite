import type { Product } from '@/features/product/types/product.types.ts';
import { useMemo, useState } from 'react';
import { DEFAULT_PRICE_RANGE } from '@/features/product/constants/defaultValues.ts';

export function useProductFilter(products: Product[]) {

  // State for filtering products
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);

  const [sortField, setSortField] =
    useState<'name' | 'price'>('name');

  const [sortDirection, setSortDirection] =
    useState<'asc' | 'desc'>('asc');

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

  const toggleSortDirection = () => {
    setSortDirection((prev) =>
      prev === 'asc' ? 'desc' : 'asc',
    );
  };


  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrands([]);
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSortField('name');
    setSortDirection('asc');
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
    resetFilters,
    sortField,
    setSortField,
    sortDirection,
    toggleSortDirection,
  };
}

