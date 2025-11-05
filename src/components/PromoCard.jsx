export default function PromoCard() {
  return (
    // ИСПРАВЛЕНИЕ:
    // Я убрал 'h-full' отсюда.
    // Теперь у промо-карты есть только 'min-h-[190px]',
    // и она не будет растягиваться, сжимая другие карточки.
    <div className="rounded-2xl p-3 min-h-[190px] bg-teal-100 shadow flex flex-col justify-between">
      <div>
        <p className="text-[12px] opacity-70">Buy Two Pines</p>
        <h3 className="text-[20px] font-bold leading-6 mt-1">Take a Gift</h3>
      </div>
      <a
        href="#" // Заглушка
        className="h-9 rounded-lg bg-white font-semibold grid place-items-center shadow text-sm"
      >
        LEARN MORE
      </a>
    </div>
  );
}
