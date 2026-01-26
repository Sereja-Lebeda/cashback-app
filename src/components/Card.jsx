import DotsIcon from "../icons/DotsIcon";
import DropMenu from "./DropMenu";
import { getBankIconComponent } from "../utils/bankIcons";

export default function Card({ bankIcon, bankIconType, bankName, categories }) {
  // Определяем, что рендерить: компонент или изображение
  const renderIcon = () => {
    if (bankIconType === "component") {
      // Если это компонент, получаем его из маппинга
      const IconComponent = getBankIconComponent(bankIcon);
      if (IconComponent) {
        return <IconComponent className="w-9 h-9" />;
      }
      // Если компонент не найден, возвращаем fallback
      return <div className="w-9 h-9 bg-gray-300 rounded-xl" />;
    } else {
      // Если это изображение, используем обычный <img>
      return (
        <img
          src={bankIcon}
          alt={`${bankName} logo`}
          className="w-9 h-9 object-contain rounded-xl"
        />
      );
    }
  };

  return (
    // Принцип: разделить карточку на 3 колонки
    <div className="relative flex flex-col items-center gap-2 w-24 min-h-96 bg-card-bg border-3 border-card-border rounded-lg py-2 px-1">
      {/* Строка 1: Банк - auto (занимает столько, сколько нужно) */}
      <div className="flex flex-col justify-center items-center w-[60px] gap-2">
        {renderIcon()}
        <span className="flex text-center text-sm font-bold">{bankName}</span>
      </div>

      {/* Строка 2: Категории */}
      <div className="flex flex-col justify-center items-center gap-2 w-auto ">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            {/* Фиксированная высота для названия - всегда 2 строки */}
            <div className="h-10 flex items-center justify-center px-2">
              <span className="text-center wrap-break-words text-sm line-clamp-2">
                {category.name}
              </span>
            </div>
            {/* Процент всегда на одном уровне */}
            <span className="font-semibold text-base mt-1">
              {category.procent}
            </span>
          </div>
        ))}
      </div>

      {/* Абсолют кнопка */}

      <DropMenu className="absolute left-18 top-1">
        <DotsIcon className="w-5 h-5" />
      </DropMenu>
    </div>
  );
}
