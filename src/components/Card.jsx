import DotsIcon from "../icons/DotsIcon";
import DropMenu from "./DropMenu";

export default function Card({
  logo,
  organizationName,
  categories,
  isMoveMode,
  onEnterMoveMode,
}) {
  return (
    <div
      data-card
      className={`relative flex flex-col items-center gap-2 w-26 h-auto bg-card-bg border-3 border-card-border rounded-lg py-2 px-1 ${
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
      <div className="pt-2">
        <div className="grid grid-rows-auto gap-2 w-auto select-none">
          {/* <div className="flex flex-col justify-end items-center gap-2 w-auto "> */}
          {categories.map((category, id) => (
            <div key={id} className="flex flex-col items-center justify-center">
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
        </div>

        {/* Абсолют кнопка */}
        <DropMenu
          className="absolute left-20 top-1"
          onMoveClick={onEnterMoveMode}
        >
          <DotsIcon className="w-5 h-5" />
        </DropMenu>
      </div>
    </div>
  );
}
