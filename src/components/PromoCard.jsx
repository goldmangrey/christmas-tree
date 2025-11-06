export default function PromoCard() {
  return (
    <div
      className="relative rounded-2xl p-4 min-h-[190px] shadow-lg flex flex-col justify-between overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url(/assets/happyxmas.jpeg)" }}
    >
      {/* Полупрозрачный затемняющий слой */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[px] rounded-2xl" />

      {/* Контент поверх оверлея */}
      <div className="relative z-10">
        <p className="text-[8px] text-white/80 tracking-wide">
          Купи ёлку и получи
        </p>
        <h3 className="text-[12px] font-bold leading-4 mt-1 text-white drop-shadow-md">
          Гирлянду в подарок
        </h3>
      </div>

      {/* Кнопка WhatsApp — улучшенные отступы и баланс */}
      <a
        href="https://wa.me/77083180696"
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 mt-4 py-2 px-4 rounded-xl font-semibold text-white text-sm 
                     flex items-center justify-center gap-2 shadow-md transition-all 
                     bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                     hover:shadow-emerald-500/40 active:scale-[0.97]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-4 h-4"
        >
          <path d="M20.52 3.48A11.77 11.77 0 0 0 12 0a11.77 11.77 0 0 0-8.52 3.48A11.77 11.77 0 0 0 0 12c0 2.08.55 4.09 1.6 5.88L0 24l6.25-1.62A11.77 11.77 0 0 0 12 24a11.77 11.77 0 0 0 8.52-3.48A11.77 11.77 0 0 0 24 12a11.77 11.77 0 0 0-3.48-8.52zM12 22a9.77 9.77 0 0 1-4.94-1.34l-.35-.2-3.72.96.99-3.62-.23-.37A9.8 9.8 0 0 1 2 12a9.8 9.8 0 0 1 2.86-6.86A9.8 9.8 0 0 1 12 2a9.8 9.8 0 0 1 6.86 2.86A9.8 9.8 0 0 1 22 12a9.8 9.8 0 0 1-2.86 6.86A9.8 9.8 0 0 1 12 22zm5.41-7.59c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.17.2-.36.22-.66.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.74-1.65-2.03-.17-.3-.02-.46.13-.61.14-.14.3-.36.45-.53.15-.17.2-.29.3-.48.1-.2.05-.36-.02-.51-.07-.15-.68-1.62-.94-2.22-.25-.6-.5-.52-.68-.53h-.58c-.2 0-.51.07-.78.36s-1.02.99-1.02 2.43 1.05 2.82 1.19 3.01c.15.2 2.07 3.17 5.03 4.44.7.3 1.25.47 1.67.6.7.22 1.33.19 1.83.12.56-.08 1.77-.73 2.02-1.43.25-.7.25-1.29.18-1.43-.07-.14-.25-.22-.55-.36z" />
        </svg>
        WhatsApp
      </a>
    </div>
  );
}
