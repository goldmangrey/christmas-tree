import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // <-- Убедись, что Link импортирован
import { useProductsStore } from "../store/useProductsStore";
import { useUIStore } from "../store/useUIStore";
import Header from "../components/Header";
import CategoryTabs from "../components/CategoryTabs";
import PromoCard from "../components/PromoCard";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { products, fetch, loading } = useProductsStore();
  const openQuickAdd = useUIStore((s) => s.openQuickAdd);
  const [tab, setTab] = useState("Trees");

  useEffect(() => {
    // Загружаем продукты только если их нет
    if (products.length === 0) {
      fetch();
    }
  }, [fetch, products.length]);

  // Разложить в 2 колонки: промо слева как первый слот
  const left = [<PromoCard key="promo" />],
    right = [];

  // Фильтруем по табу (пока мок, т.к. нет категорий в API)
  const filteredProducts = products.filter((p) => tab === "Trees");

  filteredProducts.forEach((p, i) =>
    (i % 2 === 0 ? right : left).push(
      <ProductCard key={p.id} p={p} onQuickAdd={openQuickAdd} />
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

      {/* ⬇️⬇️ ВОТ НОВАЯ ССЫЛКА ⬇️⬇️
        Добавлена ссылка на модератора внизу
      */}
      <Link
        to="/moderator"
        className="block text-center text-xs text-gray-300 hover:text-gray-500 mt-12"
      >
        Moderator Page
      </Link>
    </div>
  );
}
