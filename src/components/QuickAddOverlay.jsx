import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUIStore } from "../store/useUIStore";
import { useCartStore } from "../store/useCartStore";

export default function QuickAddOverlay() {
  const { quickAddProduct, closeQuickAdd } = useUIStore();
  const { add, dec, items } = useCartStore();
  const [qty, setQty] = useState(1);

  const productInCart = items.find(
    (item) => item.productId === quickAddProduct?.id
  );
  const currentQty = productInCart?.qty || 0;

  useEffect(() => {
    // Устанавливаем кол-во в 1, если товара еще нет в корзине
    setQty(currentQty > 0 ? currentQty : 1);
  }, [quickAddProduct, currentQty]);

  if (!quickAddProduct) return null;

  const handleAdd = () => {
    add(quickAddProduct.id, 1);
    setQty(qty + 1);
  };

  const handleDec = () => {
    if (qty > 1) {
      dec(quickAddProduct.id);
      setQty(qty - 1);
    } else if (currentQty === 1) {
      // Если 1 в корзине и жмем минус, удаляем
      dec(quickAddProduct.id);
      setQty(0);
    }
  };

  const handleBuyNow = () => {
    // "BUY NOW" в этом контексте означает "Добавить N штук в корзину"
    // Сначала установим 0, если уже есть
    if (currentQty > 0) {
      add(quickAddProduct.id, -currentQty); // (хак для установки в 0)
    }
    // Добавляем новое кол-во
    add(quickAddProduct.id, qty);
    closeQuickAdd();
  };

  const handleQtyChange = (newQty) => {
    if (newQty > 0) setQty(newQty);
    else setQty(1);
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={closeQuickAdd}
        className="fixed inset-0 bg-black/40 z-50"
      />

      {/* Panel */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] bg-white rounded-2xl shadow-md p-5"
      >
        <h3 className="text-lg font-bold text-center">
          {quickAddProduct.name}
        </h3>
        <p className="text-sm text-gray-500 text-center mb-4">
          {quickAddProduct.sizeRange}
        </p>

        <div className="flex items-center justify-center gap-4 my-4">
          <button
            onClick={handleDec}
            className="w-12 h-12 rounded-full bg-gray-100 text-2xl font-light grid place-items-center"
          >
            -
          </button>
          <span className="text-3xl font-bold w-16 text-center">{qty}</span>
          <button
            onClick={handleAdd}
            className="w-12 h-12 rounded-full bg-gray-100 text-2xl font-light grid place-items-center"
          >
            +
          </button>
        </div>

        <button
          onClick={handleBuyNow}
          className="w-full h-12 rounded-xl bg-green-600 text-white font-semibold shadow-lg shadow-green-500/30"
        >
          {currentQty > 0 ? `Update Cart (${qty})` : `Add ${qty} to Cart`}
        </button>
      </motion.div>
    </>
  );
}
