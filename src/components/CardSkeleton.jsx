/**
 * Скелетон карточки — показывается во время загрузки данных.
 * Повторяет размеры Card (110x420px) для консистентного layout.
 */
export default function CardSkeleton() {
  return (
    <div
      className="flex flex-col items-center gap-2 shrink-0 w-[110px] h-[420px] bg-card-bg/60 border-3 border-card-border rounded-lg py-2 px-1 animate-pulse"
      data-skeleton
    >
      {/* Лого + название банка */}
      <div className="flex flex-col justify-center items-center w-[60px] gap-2 min-h-12">
        <div className="w-9 h-9 rounded-lg bg-card-border/50" />
        <div className="h-4 w-16 rounded bg-card-border/50" />
      </div>

      {/* Блоки категорий */}
      <div className="pt-2 h-[310px] w-full flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-[52px] w-[88%] mx-auto rounded-lg bg-card-border/50"
          />
        ))}
      </div>
    </div>
  );
}
