export interface Product {
  id: number;
  brand: string;
  name: string;
  image: string;
  price: number;
  badge?: string;
  specs: string[];
}
