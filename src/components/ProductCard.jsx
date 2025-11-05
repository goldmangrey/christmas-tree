// [ANCHOR: PRODUCT_CARD]
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductCard({ p, onQuickAdd }) {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <button
        onClick={() => onQuickAdd(p)}
        className="absolute left-3 top-3 w-8 h-8 rounded-lg bg-white/80 shadow grid place-items-center text-lg font-bold z-10 backdrop-blur-sm"
      >
        +
      </button>

      <Link to={`/product/${p.id}`} state={{ product: p }}>
        {/*
          ИЗМЕНЕНИЕ 1:
          Вернул 'aspect-[4/5]', чтобы карточки снова стали "длинными".
        */}
        <div className="aspect-[3/5]">
          <motion.img
            layoutId={`image-${p.id}`}
            src={p.images[0]}
            alt={p.name}
            className="w-full h-full object-cover"
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </div>

        {/*
          ИЗМЕНЕНИЕ 2:
          Фон оверлея сделан 100% прозрачным.
          - Убраны: 'bg-white/85', 'backdrop-blur', 'rounded-t-xl'
          - Добавлен: 'text-white' (чтобы весь текст стал белым)
        */}
        <div className="absolute left-0 right-0 bottom-0 h-14 px-3 py-2 text-black">
          <div className="flex items-end h-full">
            <div className="flex-1">
              {/* Добавил 'drop-shadow-md' для читаемости */}
              <div className="text-[14px] font-semibold leading-4 truncate drop-shadow-md">
                {p.name}
              </div>
              <div className="text-[12px] opacity-70 leading-4 drop-shadow-md">
                {p.sizeRange}
              </div>
            </div>
            <div className="text-right">
              {/* Добавил 'drop-shadow-md' для читаемости */}
              <div className="text-[18px] font-bold leading-5 drop-shadow-md">
                ${p.price.toFixed(2)}
              </div>
              <div className="text-[11px] opacity-60 leading-4 drop-shadow-md">
                per item
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
