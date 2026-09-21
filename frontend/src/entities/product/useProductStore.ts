import { create } from 'zustand';
import { mockProducts } from './product.mock';
import type { Product } from './product.types';

interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [...mockProducts],
  
  addProduct: (productData) => set((state) => ({
    products: [{ ...productData, id: `prod-${Date.now()}` }, ...state.products]
  })),

  updateProduct: (id, data) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...data } : p)
  })),

  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),
}));
