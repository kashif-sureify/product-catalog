export interface Product {
  id: number;
  name: string;
  description: string;
  price: number | null | string;
  stock: number | null | string;
  image: string;
  created_at: Date;
}
