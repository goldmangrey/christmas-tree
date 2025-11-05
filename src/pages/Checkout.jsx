import { useCartStore } from "../store/useCartStore";
import { useProductsStore } from "../store/useProductsStore";

export default function Checkout() {
  const { items, calculateSubtotal } = useCartStore();
  const { products } = useProductsStore();
  const subtotal = calculateSubtotal(products);
  const deliveryFee = 0; // TODO: Добавить логику выбора доставки
  const total = subtotal + deliveryFee;

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
              <span>${(product?.price * item.qty).toFixed(2)}</span>
            </div>
          );
        })}
        <div className="border-t pt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delivery</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-1">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* TODO: Add RHF Form for Address/Payment */}
      <button className="w-full h-12 rounded-xl bg-green-600 text-white font-semibold mt-6">
        Confirm Payment
      </button>
    </div>
  );
}
