import DotsIcon from "../icons/DotsIcon";

export default function Card({ bankIcon, bankName, categories }) {
  return (
    // Принцип: разделить карточку на 3 колонки
    <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center w-full bg-card-bg border-3 border-card-border rounded-lg p-2">
      {/* Колонка 1: Банк - auto (занимает столько, сколько нужно) */}
      <div className="flex flex-col justify-center items-center w-[80px] h-full gap-2">
        <img
          src={bankIcon}
          alt={`${bankIcon} logo`}
          className="w-9 h-9 object-contain"
        />
        <span className="flex text-sm">{bankName}</span>
      </div>

      {/* Колонка 2: Категории */}
      <div className="flex justify-center items-center gap-2 w-full ">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center justify-center max-w-[150px]"
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

      {/* Колонка 3: Кнопка - auto */}
      <button className="flex justify-end items-start h-full">
        <DotsIcon />
      </button>
    </div>
  );
}
