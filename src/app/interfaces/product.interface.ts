export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string; // Aquí guardamos el nombre del archivo o la URL
}