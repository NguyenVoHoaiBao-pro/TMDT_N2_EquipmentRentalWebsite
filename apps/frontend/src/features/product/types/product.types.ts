interface ProductBase {
  id: number;
  name: string;
  slug: string;
  categoryName: string | null;
  brandName: string | null;
}

export interface Product extends ProductBase {
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

export interface ProductImage {

  id: number;
  imageUrl: string;
  isPrimary: boolean;

}

export interface Review {
  id: number;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Specification {
  label: string;
  value: string;
}


export type ProductCondition =
  | 'NEW'
  | 'EXCELLENT'
  | 'GOOD'
  | 'FAIR';

export interface ProductDetail extends ProductBase {
  availability: 'AVAILABLE' | 'RESERVED' | 'RENTED' | 'MAINTENANCE';
  condition: ProductCondition;
  rating: number;
  reviewCount: number;
  deposit: number;
  insurance: number;
  description: string;
  images: ProductImage[];
  specifications: Specification[];
  includedItems: string[];
  reviews: Review[];
}

