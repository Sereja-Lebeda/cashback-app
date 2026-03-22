/**
 * Storage service — абстрактный слой для хранения данных.
 * Использует Telegram Cloud Storage в Mini App и localStorage в браузере.
 */

const STORAGE_KEY = "cardsData";

/**
 * Проверяет, запущено ли приложение внутри Telegram Mini App.
 * Telegram инжектирует window.Telegram.WebApp при открытии Mini App.
 */
function isTelegramEnvironment() {
  return (
    typeof window !== "undefined" &&
    window.Telegram?.WebApp?.initData != null &&
    window.Telegram.WebApp.initData !== ""
  );
}

/**
 * Загружает данные из хранилища.
 * @returns {Promise<{ userOrganizations: Array } | null>}
 */
export async function loadStorage() {
  if (typeof window === "undefined") return null;

  if (!isTelegramEnvironment()) {
    return loadFromLocalStorage();
  }

  try {
    const {
      getCloudStorageItem,
      setCloudStorageItem,
    } = await import("@telegram-apps/sdk");
    if (getCloudStorageItem.isAvailable?.()) {
      const value = await getCloudStorageItem(STORAGE_KEY);
      if (value) return JSON.parse(value);

      // Миграция: если Cloud пуст, пробуем перенести из localStorage
      const local = loadFromLocalStorage();
      if (local?.userOrganizations?.length > 0 && setCloudStorageItem.isAvailable?.()) {
        await setCloudStorageItem(STORAGE_KEY, JSON.stringify(local));
        localStorage.removeItem(STORAGE_KEY);
        return local;
      }
      return null;
    }
  } catch {
    return loadFromLocalStorage();
  }

  return loadFromLocalStorage();
}

/**
 * Сохраняет данные в хранилище.
 * @param {Object} data - { userOrganizations: Array }
 */
export async function saveStorage(data) {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify(data);

  if (!isTelegramEnvironment()) {
    saveToLocalStorage(payload);
    return;
  }

  try {
    const { setCloudStorageItem } = await import("@telegram-apps/sdk");
    if (setCloudStorageItem.isAvailable?.()) {
      await setCloudStorageItem(STORAGE_KEY, payload);
      return;
    }
  } catch {
    saveToLocalStorage(payload);
    return;
  }

  saveToLocalStorage(payload);
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveToLocalStorage(payload) {
  try {
    localStorage.setItem(STORAGE_KEY, payload);
  } catch {
    // Storage может быть переполнен или заблокирован
  }
}
