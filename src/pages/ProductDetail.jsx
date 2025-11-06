import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
// 1. Импортируем AnimatePresence для лайтбокса
import { motion, AnimatePresence } from "framer-motion";
import { useProductsStore } from "../store/useProductsStore";
import { useCartStore } from "../store/useCartStore";
import * as api from "../lib/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const productFromStore = useProductsStore((s) => s.getProductById(id));
  const [product, setProduct] = useState(
    location.state?.product || productFromStore
  );

  // 2. Состояние для лайтбокса (просмотра фото)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [qty, setQty] = useState(1);
  const [delivery, setDelivery] = useState("free");
  const { add, openCart } = useCartStore();

  useEffect(() => {
    if (!product) {
      api.getProduct(id).then(setProduct);
    }
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

  // 3. Высота, на которой плашка "открыта" (в vh от верха экрана)
  const sheetOpenY = 25; // 25vh
  // 4. Высота, на которой плашка "закрыта" (по умолчанию)
  const sheetClosedY = 62; // 62vh

  return (
    // 5. Обертка AnimatePresence для анимации лайтбокса
    <AnimatePresence>
      <div className="relative h-screen max-h-[-webkit-fill-available] overflow-hidden">
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
        <div className="relative h-[65vh] bg-gray-100">
          {/* 6. Обертка-кнопка для открытия лайтбокса */}
          <button
            className="w-full h-full"
            onClick={() => setIsLightboxOpen(true)}
          >
            <motion.img
              layoutId={`image-${product.id}`}
              src={product.images[0]}
              alt={product.name}
              // 7. Картинка теперь 'object-cover' (заполняет), а не 'object-contain'
              className="w-full h-full object-cover"
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            />
          </button>
        </div>

        {/* 8. Подвижная плашка (Draggable Sheet) */}
        <motion.div
          drag="y" // Включаем drag по оси Y
          dragConstraints={{
            top: sheetOpenY * (window.innerHeight / 100),
            bottom: sheetClosedY * (window.innerHeight / 100),
          }}
          dragElastic={0.2} // "Пружинистость" на краях
          dragSnapToOrigin={false} // Не возвращаться в начало
          initial={{ y: sheetClosedY * (window.innerHeight / 100) }} // 9. Начальная позиция (низко)
          // Анимация при отпускании (привязка к верху или низу)
          onDragEnd={(event, info) => {
            if (info.offset.y < -100) {
              // Если потянули вверх, привязать к верху
              info.panSession.target.style.transform = `translateY(${sheetOpenY}vh)`;
            } else if (info.offset.y > 100) {
              // Если потянули вниз, привязать к низу
              info.panSession.target.style.transform = `translateY(${sheetClosedY}vh)`;
            }
          }}
          className="absolute top-0 left-0 right-0 h-auto max-h-[90vh] max-w-[390px] mx-auto bg-white rounded-t-3xl shadow-md z-10"
        >
          {/* 10. "Ручка" для перетаскивания */}
          <div className="w-full py-3 flex justify-center cursor-grab">
            <div className="w-10 h-1.5 rounded-full bg-gray-300" />
          </div>

          {/* 11. Контент плашки с overflow-y-auto */}
          <div
            className="p-4 pt-0 overflow-y-auto"
            style={{ maxHeight: "calc(90vh - 100px)" }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-extrabold">{product.name}</h1>
                <p className="text-base text-gray-500">{product.sizeRange}</p>
              </div>
              <span className="text-2xl font-extrabold flex-shrink-0 ml-2">
                ₸{product.price.toFixed(2)}
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
            <div className="flex items-center gap-4 mt-5 pb-4">
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
          </div>
        </motion.div>
      </div>

      {/* 12. Компонент Лайтбокса (Fullscreen Image Viewer) */}
      {isLightboxOpen && (
        <motion.div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Анимация layoutId переносит картинку с карточки сюда */}
          <motion.img
            layoutId={`image-${product.id}`}
            src={product.images[0]}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
