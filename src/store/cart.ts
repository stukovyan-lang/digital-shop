import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  slug: string;
  optionId?: string;
  amount?: number;
  recipient: Record<string, string>;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'id'>) => void;
  remove: (id: string) => void;
  clear: () => void;
};

/**
 * Хранится в localStorage. skipHydration: на сервере и при первом рендере
 * корзина пуста, а <StoreHydrator /> подтягивает данные после монтирования —
 * так нет hydration mismatch.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) => set((s) => ({ items: [...s.items, { ...item, id: crypto.randomUUID() }] })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'shop-cart', skipHydration: true },
  ),
);

export const useCartCount = () => useCartStore((s) => s.items.length);
