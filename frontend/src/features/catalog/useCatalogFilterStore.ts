import { create } from 'zustand';

interface CatalogFilterState {
  query: string;
  categorySlug: string;
  districtFilter: string;
  sortBy: string;
  eavFilters: Record<string, string>;
  
  setQuery: (q: string) => void;
  setCategorySlug: (slug: string) => void;
  setDistrictFilter: (district: string) => void;
  setSortBy: (sort: string) => void;
  toggleEavFilter: (attrId: string, value: string) => void;
  resetFilters: () => void;
}

export const useCatalogFilterStore = create<CatalogFilterState>((set) => ({
  query: '',
  categorySlug: '',
  districtFilter: '',
  sortBy: 'newest',
  eavFilters: {},

  setQuery: (q) => set({ query: q }),
  setCategorySlug: (slug) => set({ categorySlug: slug, eavFilters: {} }), // Reset EAV when category changes
  setDistrictFilter: (district) => set({ districtFilter: district }),
  setSortBy: (sort) => set({ sortBy: sort }),
  
  toggleEavFilter: (attrId, value) => set((state) => ({
    eavFilters: {
      ...state.eavFilters,
      [attrId]: state.eavFilters[attrId] === value ? '' : value
    }
  })),
  
  resetFilters: () => set({
    query: '',
    categorySlug: '',
    districtFilter: '',
    sortBy: 'newest',
    eavFilters: {}
  })
}));
