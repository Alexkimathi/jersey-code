import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/lib/supabase/types";

function itemKey(item: CartItem): string {
  return item.cartKey ?? item.variantId;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const key = itemKey(item);
          const existing = state.items.find((i) => itemKey(i) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i) === key
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter((i) => itemKey(i) !== key),
        })),

      updateQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => itemKey(i) !== key)
              : state.items.map((i) =>
                  itemKey(i) === key ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce(
          (sum, item) =>
            sum + (item.price + (item.customization?.addOnPrice ?? 0)) * item.quantity,
          0
        ),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "cart-storage",
    }
  )
);
