import { useCartStore } from "../store/useCartStore";
import { useProductsStore } from "../store/useProductsStore";

export default function Checkout() {
  const { items, calculateSubtotal } = useCartStore();
  const { products } = useProductsStore();
  const subtotal = calculateSubtotal(products);
  const deliveryFee = 0; // TODO: Добавить логику выбора доставки
  const total = subtotal + deliveryFee;

  // --- ЛОГИКА WHATSAPP ---

  // 1. Укажи свой номер (в международном формате, без +)
  const YOUR_PHONE_NUMBER = "77083180696"; // ⬅️ ЗАМЕНИ ЭТО

  // 2. Генерируем текст заказа
  const orderText = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return "";
      return `${product.name} (x${item.qty}) - ₸${(
        product.price * item.qty
      ).toFixed(2)}`;
    })
    .join("\n"); // \n - это перенос строки

  // 3. Собираем полное сообщение
  const fullMessage = `Здравствуйте! Хочу сделать заказ:\n\n${orderText}\n\nДоставка: ...\nИтого: ₸${total.toFixed(
    2
  )}`;

  // 4. Кодируем сообщение для URL
  const whatsappUrl = `https://wa.me/${YOUR_PHONE_NUMBER}?text=${encodeURIComponent(
    fullMessage
  )}`;
  // --- Конец логики ---

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="bg-white rounded-2xl shadow p-4 space-y-3">
        <h2 className="font-semibold">Order Summary</h2>
        {items.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {product?.name} (x{item.qty})
              </span>
              {/* ₸ ВАЛЮТА */}
              <span>₸{(product?.price * item.qty).toFixed(2)}</span>
            </div>
          );
        })}
        <div className="border-t pt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            {/* ₸ ВАЛЮТА */}
            <span>₸{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delivery</span>
            {/* ₸ ВАЛЮТА */}
            <span>₸{deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-1">
            <span>Total</span>
            {/* ₸ ВАЛЮТА */}
            <span>₸{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Кнопка "Confirm Payment" заменена на ссылку WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank" // Открывать в новой вкладке
        rel="noopener noreferrer"
        className="w-full h-12 rounded-xl bg-green-600 text-white font-semibold mt-6 grid place-items-center"
      >
        Заказать по WhatsApp
      </a>
    </div>
  );
}
