// @/features/product/hooks/useProducts.ts
import type { Product } from '@/features/product/types/product.types.ts';
import { useMemo } from 'react';
import { DEFAULT_PRICE_RANGE, ITEMS_PER_PAGE } from '@/features/product/constants/defaultValues.ts';
import { useSearchParams } from 'react-router-dom';

export function useProductFilter(products: Product[]) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('keyword') || '';

  // --- 1. Read URL Params ---
  const currentPage = Number(searchParams.get('page')) || 1;
  const selectedCategory = searchParams.get('category') || 'All';

  const selectedBrands = useMemo(() => {
    const brandsRaw = searchParams.get('brands');
    return brandsRaw ? brandsRaw.split(',') : [];
  }, [searchParams]);

  const priceRange = useMemo<[number, number]>(() => {
    const min = searchParams.get('minPrice');
    const max = searchParams.get('maxPrice');
    return min && max ? [Number(min), Number(max)] : DEFAULT_PRICE_RANGE;
  }, [searchParams]);

  const sortField = (searchParams.get('sortField') as 'name' | 'price') || 'name';
  const sortDirection = (searchParams.get('sortDirection') as 'asc' | 'desc') || 'asc';


  // --- 2. Method to update URL Params ---
  const setUrlParam = (key: string, value: string | null) => {
    setSearchParams((prev) => {
      if (!value || value === 'All' || value === '') {
        prev.delete(key);
      } else {
        prev.set(key, value);
      }
      if (key !== 'page') {
        prev.set('page', '1');
      }
      return prev;
    });
  };

  const setSearchQuery = (
    keyword: string,
  ) => {
    setUrlParam(
      'keyword',
      keyword,
    );
  };


  const setCurrentPage = (page: number) => {
    setUrlParam('page', page.toString());
  };

  const setSelectedCategory = (category: string) => {
    setUrlParam('category', category);
  };

  const setSelectedBrands = (brands: string[]) => {
    setUrlParam('brands', brands.length > 0 ? brands.join(',') : null);
  };

  const setPriceRange = (range: [number, number]) => {
    setSearchParams((prev) => {
      prev.set('minPrice', range[0].toString());
      prev.set('maxPrice', range[1].toString());
      prev.set('page', '1');
      return prev;
    });
  };

  const setSortField = (field: 'name' | 'price') => {
    setUrlParam('sortField', field);
  };

  const toggleSortDirection = () => {
    const nextDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setUrlParam('sortDirection', nextDirection);
  };

  const resetFilters = () => {
    setSearchParams({}); // Clear all URL params
  };


  // --- 3. Compute filtered, sorted, and paginated products ---
  const filteredProducts = useMemo(() => {
    const result = products.filter((p) => {
      const categoryMatch = selectedCategory === 'All' || p.category === selectedCategory;
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];

      const keyword = searchQuery.toLowerCase();

      const searchMatch =
        p.name.toLowerCase().includes(keyword) ||
        p.brand.toLowerCase().includes(keyword) ||
        p.category.toLowerCase().includes(keyword);

      return categoryMatch && brandMatch && priceMatch && searchMatch;
    });

    const productSorted = [...result];
    productSorted.sort((a, b) => {
      if (sortField === 'price') {
        return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
      }
      return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });

    return productSorted;
  }, [products, selectedCategory, selectedBrands, priceRange, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);


  // --- 4. Export results ---
  return {
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
  };
}
