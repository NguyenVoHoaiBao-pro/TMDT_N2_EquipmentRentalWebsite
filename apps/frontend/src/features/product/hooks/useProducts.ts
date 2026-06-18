import type { Product } from '@/features/product/types/product.types.ts';
import { useMemo, useState } from 'react';
import { DEFAULT_PRICE_RANGE } from '@/features/product/constants/defaultValues.ts';

export function useProductFilter(products: Product[]) {

  // State for filtering products
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const categoryMatch =
        selectedCategory === 'All' || p.category === selectedCategory;

      const brandMatch =
        selectedBrands.length === 0 || selectedBrands.includes(p.brand);

      const priceMatch =
        p.price >= priceRange[0] && p.price <= priceRange[1];

      return categoryMatch && brandMatch && priceMatch;
    });
  }, [products, selectedCategory, selectedBrands, priceRange]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrands([]);
    setPriceRange(DEFAULT_PRICE_RANGE);
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
  };
}

