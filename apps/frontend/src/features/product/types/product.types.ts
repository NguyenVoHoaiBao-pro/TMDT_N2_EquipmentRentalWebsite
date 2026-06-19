export interface Product {
  id: number;
  category: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  badge?: string;
  specs: string[];
}
