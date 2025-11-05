import { create } from "zustand";

export const useCartStore = create((set, get) => ({
    items: [], // [{ productId: string, qty: number }]
    isOpen: false,

    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),

    add(id, qty = 1) {
        const items = [...get().items];
        const i = items.findIndex((x) => x.productId === id);
        if (i > -1) {
            items[i].qty += qty;
        } else {
            items.push({ productId: id, qty });
        }
        set({ items });
    },

    dec(id) {
        const items = [...get().items]
            .map((x) => (x.productId === id ? {...x, qty: x.qty - 1 } : x))
            .filter((x) => x.qty > 0);
        set({ items });
    },

    remove(id) {
        set({ items: get().items.filter((x) => x.productId !== id) });
    },

    clear() {
        set({ items: [] });
    },

    // Селекторы для вычисления общей суммы
    getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.qty, 0);
    },

    // Этот селектор требует доступа к useProductsStore,
    // поэтому его лучше вызывать из компонента, передавая `products`
    calculateSubtotal: (products) => {
        return get().items.reduce((acc, item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return acc;
            return acc + product.price * item.qty;
        }, 0);
    },
}));