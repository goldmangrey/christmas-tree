import { useCartStore } from "../store/useCartStore";
// Иконки (предполагается, что они есть в /assets)
// import SearchIcon from '../assets/search.svg';
// import CartIcon from '../assets/cart.svg';
// import MenuIcon from '../assets/menu.svg';

export default function Header() {
  const totalItems = useCartStore((s) => s.getTotalItems());
  const openCart = useCartStore((s) => s.openCart);

  return (
    <div className="h-[56px] px-4 flex items-center justify-between sticky top-0 z-40 bg-gradient-to-b from-white/80 to-transparent backdrop-blur-sm">
      <button
        aria-label="menu"
        className="w-10 h-10 rounded-lg grid place-items-center"
      >
        {/* <img src={MenuIcon} alt="menu" className="w-6 h-6" /> */}
        <span className="text-xl">☰</span>
      </button>

      <div className="relative flex-1 mx-2">
        <input
          className="h-[44px] w-full rounded-xl px-4 pl-10 bg-white shadow"
          placeholder="Search trees..."
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg opacity-40">
          🔍
        </span>
      </div>

      <button
        aria-label="cart"
        onClick={openCart}
        className="w-10 h-10 rounded-lg relative grid place-items-center"
      >
        {/* <img src={CartIcon} alt="cart" className="w-6 h-6" /> */}
        <span className="text-2xl">🛒</span>

        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 text-[11px] font-bold bg-black text-white rounded-full w-5 h-5 grid place-items-center">
            {totalItems}
          </span>
        )}
      </button>
    </div>
  );
}
