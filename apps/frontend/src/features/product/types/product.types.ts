export interface Product {
  id: number;
  slug?: string;
  category: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  badge?: string;
  specs: string[];
}
