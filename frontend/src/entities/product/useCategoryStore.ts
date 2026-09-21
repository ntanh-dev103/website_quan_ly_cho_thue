import { create } from 'zustand';
import { categories as mockCategories } from './product.mock';
import type { Category } from './product.types';

interface CategoryStore {
  categories: Category[];
  setCategories: (cats: Category[]) => void;
  addCategory: (cat: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [...mockCategories],
  
  setCategories: (cats) => set({ categories: cats }),
  
  addCategory: (cat) => set((state) => ({
    categories: [...state.categories, cat]
  })),

  updateCategory: (_id, _data) => set((state) => {
    // Recursive update for nested categories is complex, 
    // for simplicity in Demo we assume flat or just root level updates, 
    // but Dnd-kit will likely require replacing the whole tree via setCategories.
    return state;
  }),
}));
