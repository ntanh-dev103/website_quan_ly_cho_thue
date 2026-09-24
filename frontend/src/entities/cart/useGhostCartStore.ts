import { create } from 'zustand';
import { toast } from 'sonner';
import { type Product } from '@/entities/product/product.types';

export interface CartItem {
  product: Product;
  days: number;
  addedAt: number;
}

interface GhostCartState {
  items: CartItem[];
  isOpen: boolean;
  lastRemovedItem: CartItem | null;
  addItem: (product: Product, days?: number) => void;
  removeItem: (productId: string) => void;
  updateDays: (productId: string, days: number) => void;
  clearCart: () => void;
  undoRemove: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useGhostCartStore = create<GhostCartState>((set, get) => ({
  items: [],
  isOpen: false,
  lastRemovedItem: null,

  addItem: (product: Product, days = 1) => {
    const existing = get().items.find((item) => item.product.id === product.id);

    if (existing) {
      set((state) => ({
        items: state.items.map((item) =>
          item.product.id === product.id ? { ...item, days: item.days + days } : item
        ),
      }));
    } else {
      set((state) => ({
        items: [...state.items, { product, days, addedAt: Date.now() }],
      }));
    }

    toast.success(`Đã thêm "${product.name}" vào giỏ thuê!`, {
      description: `Thời gian thuê: ${days} ngày`,
      action: {
        label: 'Hoàn tác',
        onClick: () => {
          get().removeItem(product.id);
        },
      },
      duration: 3500,
    });
  },

  removeItem: (productId: string) => {
    const itemToRemove = get().items.find((item) => item.product.id === productId);
    if (!itemToRemove) return;

    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
      lastRemovedItem: itemToRemove,
    }));

    toast.info(`Đã xóa "${itemToRemove.product.name}"`, {
      action: {
        label: 'Khôi phục',
        onClick: () => get().undoRemove(),
      },
    });
  },

  updateDays: (productId: string, days: number) => {
    if (days < 1) return;
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, days } : item
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
    toast.info('Đã làm trống giỏ đồ thuê');
  },

  undoRemove: () => {
    const lastItem = get().lastRemovedItem;
    if (lastItem) {
      set((state) => ({
        items: [...state.items, lastItem],
        lastRemovedItem: null,
      }));
      toast.success(`Đã khôi phục "${lastItem.product.name}" vào giỏ`);
    }
  },

  setIsOpen: (isOpen: boolean) => set({ isOpen }),

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.product.pricePerDay * item.days, 0);
  },

  getTotalItems: () => {
    return get().items.length;
  },
}));
