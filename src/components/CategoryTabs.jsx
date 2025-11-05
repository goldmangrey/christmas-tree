export default function CategoryTabs({ active, onChange }) {
  const tabs = ["Trees", "Decorations", "Stands", "Garlands"];

  return (
    // Добавляем sticky, чтобы табы "прилипали" под хедером
    <div className="sticky top-[56px] z-30 h-[40px] px-4 overflow-x-auto flex gap-6 items-end border-b bg-white/90 backdrop-blur-sm">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`pb-2 whitespace-nowrap text-sm ${
            active === t
              ? "border-b-2 border-green-600 font-semibold text-green-700"
              : "text-gray-500"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
