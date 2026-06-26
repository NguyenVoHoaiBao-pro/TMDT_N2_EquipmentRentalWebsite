export interface Product {
  id: number;
  name: string;
  slug: string;
  categoryName: string | null;
  brandName: string | null;
  primaryImageUrl: string | null;
  minPricePerDay: number;
  status: 'AVAILABLE' | 'OUT_OF_STOCK';
}

export interface SpringPageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Starts from 0
}

export type LookupItem = { id: number; name: string };

export interface PriceRange {
  minPrice: number;
  maxPrice: number;
}
