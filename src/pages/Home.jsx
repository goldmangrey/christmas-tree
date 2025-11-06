import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductsStore } from "../store/useProductsStore";
// 1. Убираем импорт useUIStore
// import { useUIStore } from "../store/useUIStore";
// 2. Убедимся, что импортирован useCartStore
import { useCartStore } from "../store/useCartStore";

import Header from "../components/Header";
import CategoryTabs from "../components/CategoryTabs";
import PromoCard from "../components/PromoCard";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { products, fetch, loading } = useProductsStore();

  // 3. Получаем функции 'add' и 'openCart' из стора корзины
  const { add, openCart } = useCartStore();

  // 4. Убираем эту строку
  // const openQuickAdd = useUIStore((s) => s.openQuickAdd);

  const [tab, setTab] = useState("Trees");

  useEffect(() => {
    if (products.length === 0) {
      fetch();
    }
  }, [fetch, products.length]);

  // 5. Создаем новую функцию-обработчик
  const handleQuickAdd = (product) => {
    add(product.id, 1); // Добавляем 1 товар
    openCart(); // Открываем шторку корзины
  };

  // Разложить в 2 колонки
  const left = [<PromoCard key="promo" />],
    right = [];

  const filteredProducts = products.filter((p) => tab === "Trees");

  filteredProducts.forEach((p, i) =>
    (i % 2 === 0 ? right : left).push(
      <ProductCard
        key={p.id}
        p={p}
        // 6. Передаем нашу новую функцию в ProductCard
        onQuickAdd={handleQuickAdd}
      />
    )
  );

  return (
    <div className="pb-20">
      <Header />
      <CategoryTabs active={tab} onChange={setTab} />

      {loading && <p className="text-center p-10">Loading...</p>}

      <div className="grid grid-cols-2 gap-3 px-4 pt-3">
        <div className="flex flex-col gap-3">{left}</div>
        <div className="flex flex-col gap-3">{right}</div>
      </div>

      <Link
        to="/moderator"
        className="block text-center text-xs text-gray-300 hover:text-gray-500 mt-12"
      >
        Moderator Page
      </Link>
    </div>
  );
}
