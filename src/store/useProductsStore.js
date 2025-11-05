import { create } from "zustand";
import * as api from "../lib/api";

export const useProductsStore = create((set, get) => ({
    products: [],
    loading: false,

    async fetch() {
        set({ loading: true });
        const data = await api.listProducts();
        data.sort((a, b) => a.orderIndex - b.orderIndex);
        set({ products: data, loading: false });
    },

    // Добавим getById для страницы ProductDetail
    getProductById(id) {
        return get().products.find((p) => p.id === id) || null;
    },

    async upsert(p) {
        await api.upsertProduct(p);
        await get().fetch();
    },

    async remove(id) {
        await api.deleteProduct(id);
        await get().fetch();
    },

    // reorder для D&D
    reorder(movedList) {
        set({ products: movedList });
        // Как в спеке: после отпускания D&D, обновляем orderIndex
        // и отправляем на "бэк"
        movedList.forEach(async(p, index) => {
            if (p.orderIndex !== index) {
                await api.upsertProduct({...p, orderIndex: index });
            }
        });
    },
}));