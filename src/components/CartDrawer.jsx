import { motion } from "framer-motion";
import { useCartStore } from "../store/useCartStore";
import { useProductsStore } from "../store/useProductsStore";
import { Link } from "react-router-dom";

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    add,
    dec,
    remove,
    clear,
    calculateSubtotal,
  } = useCartStore();
  const { products } = useProductsStore(); // Нужны для получения цен и картинок

  const subtotal = calculateSubtotal(products);

  const drawerVariants = {
    hidden: { y: "100%" },
    visible: { y: "0%" },
  };

  if (!isOpen) return null; // AnimatePresence обработает выход

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24 }}
        onClick={closeCart}
        className="fixed inset-0 bg-black/50 z-50"
      />

      {/* Drawer */}
      <motion.div
        key="cart-drawer"
        variants={drawerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
        className="fixed bottom-0 left-0 right-0 h-[80%] max-w-[390px] mx-auto bg-white rounded-t-3xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Корзина</h2>
          <button onClick={closeCart} className="text-2xl opacity-50">
            &times;
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 && (
            <p className="text-gray-500 text-center mt-10">Корзина пустая.</p>
          )}

          {items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;

            return (
              <div
                key={item.productId}
                className="flex items-center h-[88px] gap-4"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg bg-gray-100 object-contain"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{product.name}</h4>
                  <p className="text-xs text-gray-500">{product.sizeRange}</p>
                  <p className="font-bold text-sm mt-1">
                    ₸{(product.price * item.qty).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dec(item.productId)}
                    className="w-6 h-6 rounded bg-gray-100 text-lg grid place-items-center"
                  >
                    -
                  </button>
                  <span className="font-semibold w-4 text-center">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => add(item.productId)}
                    className="w-6 h-6 rounded bg-gray-100 text-lg grid place-items-center"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => remove(item.productId)}
                  className="text-red-500 text-xs ml-2"
                >
                  Удалить
                </button>
              </div>
            );
          })}
        </div>

        {items.length > 0 && (
          <button
            onClick={clear}
            className="text-center text-xs text-red-500 p-2"
          >
            Очистить корзину
          </button>
        )}

        {/* Footer */}
        <div className="p-4 border-t shadow-[0_-8px_24px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600">Итог</span>
            <span className="text-xl font-bold">₸{subtotal.toFixed(2)}</span>
          </div>
          <Link to="/checkout" onClick={closeCart}>
            <button className="w-full h-12 rounded-xl bg-green-600 text-white font-semibold">
              Перейти к оформлению заказа
            </button>
          </Link>
        </div>
      </motion.div>
    </>
  );
}
