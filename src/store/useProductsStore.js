import { create } from "zustand";
import * as api from "../lib/api";

export const useProductsStore = create((set, get) => ({
    products: [],
    loading: false,

    async fetch() {
        set({ loading: true });
        try {
            const data = await api.listProducts();
            // data уже отсортирован из Firebase по orderIndex
            set({ products: data, loading: false });
        } catch (error) {
            console.error("Failed to fetch products:", error);
            set({ loading: false });
        }
    },

    getProductById(id) {
        return get().products.find((p) => p.id === id) || null;
    },

    async upsert(p, id = null) {
        // Вызываем нашу чистую API-функцию
        await api.upsertProduct(p, id);
        await get().fetch(); // Обновляем список
    },

    async remove(id) {
        await api.deleteProduct(id);
        await get().fetch(); // Обновляем список
    },

    // ⬇️⬇️ ВОТ НОВАЯ, ИСПРАВЛЕННАЯ ФУНКЦИЯ ⬇️⬇️
    reorder(movedList) {
        // 'movedList' - это массив в новом визуальном порядке.

        // 1. Создаем НОВЫЙ список, в котором 'orderIndex'
        //    уже обновлен в соответствии с новой позицией.
        const newListWithUpdatedIndexes = movedList.map((p, index) => ({
            ...p,
            orderIndex: index, // Присваиваем правильный индекс 0, 1, 2...
        }));

        // 2. Немедленно (оптимистично) обновляем UI,
        //    используя этот новый, 100% правильный список.
        set({ products: newListWithUpdatedIndexes });

        // 3. В фоновом режиме отправляем обновления в Firebase.
        const batchUpdates = newListWithUpdatedIndexes.map(async(p) => {
            // p.id - это ID документа
            // p.orderIndex - это его новый порядок (0, 1, 2...)
            await api.upsertProduct({ orderIndex: p.orderIndex }, p.id);
        });

        // 4. Нам НЕ НУЖНО вызывать fetch()!
        //    Наш UI (state) уже в правильном состоянии.
        Promise.all(batchUpdates)
            .then(() => {
                console.log("✅ Порядок успешно сохранен в Firebase!");
            })
            .catch((err) => {
                console.error("❌ Ошибка сохранения порядка! Перезагружаемся...", err);
                // Только если произошла ошибка, мы перезагружаем
                // данные с сервера, чтобы исправить UI.
                get().fetch();
            });
    },
}));