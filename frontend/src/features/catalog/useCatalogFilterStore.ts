import { create } from 'zustand';

interface CatalogFilterState {
  query: string;
  categorySlug: string;
  districtFilter: string;
  merchantTier: string;
  rating: number | null;
  sortBy: string;
  minPrice: number | null;
  maxPrice: number | null;
  viewMode: 'grid' | 'table';
  eavFilters: Record<string, string>;

  setQuery: (q: string) => void;
  setCategorySlug: (slug: string) => void;
  setDistrictFilter: (district: string) => void;
  setMerchantTier: (tier: string) => void;
  setRating: (rating: number | null) => void;
  setSortBy: (sort: string) => void;
  setMinPrice: (v: number | null) => void;
  setMaxPrice: (v: number | null) => void;
  setViewMode: (mode: 'grid' | 'table') => void;
  toggleEavFilter: (attrId: string, value: string) => void;
  resetFilters: () => void;
}

export const useCatalogFilterStore = create<CatalogFilterState>((set) => ({
  query: '',
  categorySlug: '',
  districtFilter: '',
  merchantTier: '',
  rating: null,
  sortBy: 'newest',
  minPrice: null,
  maxPrice: null,
  viewMode: 'grid',
  eavFilters: {},

  setQuery: (q) => set({ query: q }),
  setCategorySlug: (slug) => set({ categorySlug: slug, eavFilters: {} }),
  setDistrictFilter: (district) => set({ districtFilter: district }),
  setMerchantTier: (tier) => set({ merchantTier: tier }),
  setRating: (rating) => set({ rating }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setMinPrice: (v) => set({ minPrice: v }),
  setMaxPrice: (v) => set({ maxPrice: v }),
  setViewMode: (mode) => set({ viewMode: mode }),

  toggleEavFilter: (attrId, value) =>
    set((state) => ({
      eavFilters: {
        ...state.eavFilters,
        [attrId]: state.eavFilters[attrId] === value ? '' : value,
      },
    })),

  resetFilters: () =>
    set({
      query: '',
      categorySlug: '',
      districtFilter: '',
      merchantTier: '',
      rating: null,
      sortBy: 'newest',
      minPrice: null,
      maxPrice: null,
      viewMode: 'grid',
      eavFilters: {},
    }),
}));

