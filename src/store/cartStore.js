import { create } from 'zustand';

export const useCartStore = create((set) => ({
  items: [],
  isOpen: false,
  
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  
  addItem: (game) => set((state) => {
    // Check if item already in cart
    const existing = state.items.find((item) => item.id === game.id);
    if (existing) {
      return state; // In game stores, you usually only buy one copy a time
    }
    return { items: [...state.items, game], isOpen: true }; // Auto open cart on add
  }),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  })),
  
  clearCart: () => set({ items: [] })
}));
