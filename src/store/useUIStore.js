import { create } from "zustand";

export const useUIStore = create((set) => ({
    quickAddProduct: null, // Product object

    openQuickAdd: (product) => set({ quickAddProduct: product }),
    closeQuickAdd: () => set({ quickAddProduct: null }),
}));