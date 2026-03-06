import DotsIcon from "../icons/DotsIcon";
import DropMenu from "./DropMenu";

export default function Card({
  logo,
  organizationName,
  categories,
  isMoveMode,
  onEnterMoveMode,
}) {
  const MAX_VISIBLE_CATEGORIES = 5;
  const hasOverflow = categories.length > MAX_VISIBLE_CATEGORIES;
  const visibleCategories = hasOverflow
    ? categories
    : categories.slice(0, MAX_VISIBLE_CATEGORIES);
  const placeholdersCount = hasOverflow
    ? 0
    : Math.max(0, MAX_VISIBLE_CATEGORIES - visibleCategories.length);

  return (
    <div
      data-card
      className={`relative flex flex-col items-center gap-2 shrink-0 min-w-[calc(100vw/3-1.5rem)] max-w-[calc(100vw/3-1.5rem)] bg-card-bg border-3 border-card-border rounded-lg py-2 px-1 ${
        isMoveMode ? "animate-shake" : ""
      }`}
    >
      {/* Строка 1: Банк - auto (занимает столько, сколько нужно) */}
      <div className="flex flex-col justify-center items-center w-[60px] gap-2 min-h-12">
        {logo &&
          (() => {
            const IconComponent = logo;
            return <IconComponent className="w-9 h-9" />;
          })()}
        <span className="flex text-center text-sm font-bold">
          {organizationName}
        </span>
      </div>

      {/* Строка 2: Категории */}
      <div className="relative pt-2">
        <div
          className={`grid grid-rows-auto gap-2 w-full select-none ${
            hasOverflow ? "max-h-[310px] overflow-y-auto no-scrollbar pb-4" : ""
          }`}
        >
          {visibleCategories.map((category, index) => (
            <div
              key={category.categoryId ?? index}
              className="flex flex-col items-center justify-center"
            >
              {/* Фиксированная высота для названия - всегда 2 строки */}
              <div className="h-8 flex items-center justify-center px-2">
                <span className="text-center wrap-break-words text-sm line-clamp-2">
                  {category.categoryName}
                </span>
              </div>
              {/* Процент всегда на одном уровне */}
              <span className="font-semibold text-base">
                {category.categoryProcent}
              </span>
            </div>
          ))}
          {!hasOverflow &&
            Array.from({ length: placeholdersCount }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="flex flex-col items-center justify-center opacity-0 pointer-events-none"
              >
                <div className="h-8 flex items-center justify-center px-2">
                  <span className="text-sm">-</span>
                </div>
                <span className="text-base">-</span>
              </div>
            ))}
        </div>

        {/* Градиент внизу, подсказывающий, что список прокручиваемый */}
        {hasOverflow && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-linear-to-t from-card-bg to-transparent" />
        )}
      </div>

      {/* Абсолют кнопка (позиционируется относительно всей карточки) */}
      <DropMenu
        className="absolute left-20 top-1"
        onMoveClick={onEnterMoveMode}
      >
        <DotsIcon className="w-5 h-5" />
      </DropMenu>
    </div>
  );
}
