import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useProductsStore } from "../store/useProductsStore";
import { useCartStore } from "../store/useCartStore";
import * as api from "../lib/api"; // для fallback-загрузки

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Для получения state из Link

  // Пытаемся получить продукт из state (быстро) или стора
  const productFromStore = useProductsStore((s) => s.getProductById(id));
  const [product, setProduct] = useState(
    location.state?.product || productFromStore
  );

  const [qty, setQty] = useState(1);
  const [delivery, setDelivery] = useState("free"); // 'free' or 'express'
  const { add, openCart } = useCartStore();

  useEffect(() => {
    // Fallback: если продукта нет ни в state, ни в сторе (прямой заход)
    if (!product) {
      api.getProduct(id).then(setProduct);
    }
    // Восстанавливаем скролл
    window.scrollTo(0, 0);
  }, [id, product]);

  if (!product) {
    return <div className="h-screen grid place-items-center">Loading...</div>;
  }

  const handleBuyNow = () => {
    add(product.id, qty);
    openCart();
  };

  const deliveryCost = delivery === "express" ? 9.99 : 0;
  const expressDays = product.deliveryDays > 1 ? 1 : 0; // 0 = today

  return (
    <div className="pb-[320px]">
      {" "}
      {/* Отступ под плашку */}
      {/* Header (Back button) */}
      <div className="absolute top-0 left-0 z-20 p-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/80 shadow grid place-items-center backdrop-blur-sm"
        >
          &larr;
        </button>
      </div>
      {/* Gallery */}
      <div className="relative h-[56vh] bg-gradient-to-b from-green-50 to-green-100">
        <motion.img
          layoutId={`image-${product.id}`}
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain"
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        />
        {/* Можно добавить индикаторы, если images.length > 1 */}
      </div>
      {/* Sticky Sheet */}
      <motion.div
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.24, delay: 0.08, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 min-h-[320px] max-w-[390px] mx-auto bg-white rounded-t-3xl shadow-md p-5 z-10"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-extrabold">{product.name}</h1>
            <p className="text-base text-gray-500">{product.sizeRange}</p>
          </div>
          <span className="text-2xl font-extrabold">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <p className="text-sm text-gray-600 mt-3">{product.fullDesc}</p>

        {/* Delivery Options */}
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Delivery</h3>
          <label
            className={`flex justify-between items-center p-3 border rounded-lg ${
              delivery === "free"
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
            }`}
          >
            <div>
              <p className="font-medium">
                Free (1–{product.deliveryDays} days)
              </p>
              <p className="text-xs text-gray-500">Standard shipping</p>
            </div>
            <input
              type="radio"
              name="delivery"
              value="free"
              checked={delivery === "free"}
              onChange={(e) => setDelivery(e.target.value)}
            />
          </label>
          <label
            className={`flex justify-between items-center p-3 border rounded-lg ${
              delivery === "express"
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
            }`}
          >
            <div>
              <p className="font-medium">Express (today)</p>
              <p className="text-xs text-gray-500">Ships within 2 hours</p>
            </div>
            <div className="text-right">
              <p className="font-medium">+${deliveryCost.toFixed(2)}</p>
              <input
                type="radio"
                name="delivery"
                value="express"
                checked={delivery === "express"}
                onChange={(e) => setDelivery(e.target.value)}
              />
            </div>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-4 mt-5">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl h-12 px-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="text-xl font-light w-6"
            >
              -
            </button>
            <span className="text-lg font-bold w-5 text-center">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="text-xl font-light w-6"
            >
              +
            </button>
          </div>
          <button
            onClick={handleBuyNow}
            className="flex-1 h-12 rounded-xl bg-green-600 text-white font-semibold shadow-lg shadow-green-500/30"
          >
            BUY NOW
          </button>
        </div>
      </motion.div>
    </div>
  );
}
