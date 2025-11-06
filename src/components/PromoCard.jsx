export default function PromoCard() {
  return (
    // 1. Добавили 'relative' и 'bg-cover bg-center'
    // 2. Убрали 'bg-teal-100'
    // 3. Добавили inline-стиль с путем к твоей картинке
    <div
      className="relative rounded-2xl p-3 min-h-[190px] shadow flex flex-col justify-between overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url(/assets/happyxmas.jpeg)" }}
    >
      {/* 4. Добавили темный оверлей, чтобы текст был читаемым */}
      <div className="absolute inset-0 bg-black/30 rounded-2xl" />

      {/* 5. Добавили 'relative' ко всему контенту, чтобы он был НАД оверлеем */}
      <div className="relative">
        {/* 6. Сделали текст белым */}
        <p className="text-[8px] text-white/80">Купи Елку и получи</p>
        <h3 className="text-[10px] font-bold leading-4 mt-1 text-white">
          Гирлянду в подарок
        </h3>
      </div>

      <a
        href="#" // Заглушка
        className="h-9 rounded-lg bg-white font-semibold grid place-items-center shadow text-sm relative"
      >
        Заказать
      </a>
    </div>
  );
}
