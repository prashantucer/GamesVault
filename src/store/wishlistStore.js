import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (game) => {
        const exists = get().items.find(i => i.id === game.id);
        if (!exists) set((state) => ({ items: [...state.items, game] }));
      },

      removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),

      isWishlisted: (id) => get().items.some(i => i.id === id),

      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),
    }),
    { name: 'gamevault-wishlist' }
  )
);
