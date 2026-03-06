import DotsIcon from "../icons/DotsIcon";
import PlusIcon from "../icons/PlusIcon";
import DropMenu from "./DropMenu";

export default function Card({
  id,
  logo,
  organizationName,
  categories,
  isMoveMode,
  isEditMode,
  onEnterMoveMode,
  onEditClick,
  onPlusClick,
}) {
  const MAX_VISIBLE_CATEGORIES = 5;
  const hasOverflow = categories.length > MAX_VISIBLE_CATEGORIES;
  const visibleCategories =
    hasOverflow || isEditMode
      ? categories
      : categories.slice(0, MAX_VISIBLE_CATEGORIES);
  const placeholdersCount =
    hasOverflow || isEditMode
      ? 0
      : Math.max(0, MAX_VISIBLE_CATEGORIES - visibleCategories.length);

  return (
    <div
      data-card
      className={`relative flex flex-col items-center gap-2 shrink-0 min-w-[calc(100vw/3-1.5rem)] max-w-[calc(100vw/3-1.5rem)] h-[420px] bg-card-bg border-3 border-card-border rounded-lg py-2 px-1 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
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

      {/* Строка 2: Категории (фиксированный грид — 5 строк по 52px) */}
      <div
        className={`relative pt-2 ${isEditMode ? "h-[270px]" : "h-[310px]"}`}
      >
        <div
          className={`grid auto-rows-[52px] gap-2 w-full select-none h-full ${
            hasOverflow || isEditMode ? "overflow-y-auto no-scrollbar pb-4" : ""
          }`}
        >
          {visibleCategories.map((category, index) => (
            <div
              key={category.categoryId ?? index}
              className="flex flex-col items-center justify-center min-h-0"
            >
              <div className="h-8 flex items-center justify-center px-2">
                <span className="text-center wrap-break-words text-sm line-clamp-2">
                  {category.categoryName}
                </span>
              </div>
              <span className="font-semibold text-base">
                {category.categoryProcent}
              </span>
            </div>
          ))}
          {!hasOverflow &&
            !isEditMode &&
            Array.from({ length: placeholdersCount }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="flex flex-col items-center justify-center opacity-0 pointer-events-none min-h-0"
              >
                <div className="h-8 flex items-center justify-center px-2">
                  <span className="text-sm">-</span>
                </div>
                <span className="text-base">-</span>
              </div>
            ))}
        </div>

        {(hasOverflow || isEditMode) && (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-b from-card-bg to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-card-bg via-card-bg/80 to-transparent z-10" />
          </>
        )}
      </div>

      {/* Плюс — последний элемент карточки, вне грида категорий */}
      {isEditMode && (
        <button
          type="button"
          onClick={onPlusClick}
          className="flex items-center justify-center w-full py-3 rounded-lg border-2 border-dashed border-card-border hover:bg-card-hover/30 transition-colors shrink-0"
          aria-label="Добавить категорию"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      )}

      {/* Абсолют кнопка (позиционируется относительно всей карточки) */}
      <DropMenu
        className="absolute left-20 top-1"
        onMoveClick={onEnterMoveMode}
        onEditClick={onEditClick}
      >
        <DotsIcon className="w-5 h-5" />
      </DropMenu>
    </div>
  );
}
