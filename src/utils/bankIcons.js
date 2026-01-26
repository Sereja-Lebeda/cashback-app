// Маппинг компонентов иконок банков
// Здесь хранятся все JSX компоненты иконок

import AlphaIcon from "../icons/AlphaIcon";

// Объект-маппинг: ключ - идентификатор из data.json, значение - компонент
export const bankIconComponents = {
  alphaBank: AlphaIcon,
  // Здесь можно добавить другие компоненты иконок
  // sberBank: SberIcon,
};

// Функция для получения компонента по идентификатору
export function getBankIconComponent(iconId) {
  return bankIconComponents[iconId] || null;
}
