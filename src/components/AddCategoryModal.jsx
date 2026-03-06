import { useMemo, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import categories from "../categories";

export default function AddCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode = "add", // "add" | "edit"
  organizationName = "",
  existingCategoryIds = [],
  initialCategoryId = null,
  initialPercent = null,
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (mode !== "edit") return null;
    return categories.find((c) => c.id === initialCategoryId) ?? null;
  });
  const [percentInput, setPercentInput] = useState(() => {
    if (mode !== "edit") return "";
    return initialPercent === null || initialPercent === undefined
      ? ""
      : String(initialPercent);
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase().trim();
    return categories.filter((cat) => cat.name.toLowerCase().includes(q));
  }, [search]);

  const titleText = mode === "edit" ? "Изменить категорию" : "Добавить категорию";

  const percentNumber = Number(percentInput);
  const isPercentValid =
    percentInput.trim().length > 0 &&
    Number.isFinite(percentNumber) &&
    percentNumber >= 0 &&
    percentNumber <= 100;

  const canSubmit =
    !!selectedCategory &&
    isPercentValid &&
    !(
      selectedCategory &&
      existingCategoryIds.includes(selectedCategory.id) &&
      selectedCategory.id !== initialCategoryId
    );

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      categoryPercent: percentNumber,
    });
    handleClose();
  }

  function handleClose() {
    setSearch("");
    setSelectedCategory(null);
    setPercentInput("");
    setConfirmDelete(false);
    onClose();
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => handleClose()}
      className="relative z-50"
      data-add-category-modal
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          data-add-category-modal
          className="mx-auto max-w-md w-full rounded-2xl border border-border bg-bg-primary p-6 shadow-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-lg font-semibold text-text-primary">
              {titleText}
              {organizationName && (
                <span className="block text-sm font-normal text-text-secondary mt-0.5">
                  для {organizationName}
                </span>
              )}
            </DialogTitle>

            <button
              type="button"
              onClick={handleClose}
              className="shrink-0 inline-flex items-center justify-center rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Закрыть"
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Поиск категории
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-text-secondary" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Введите название..."
                  className="w-full h-10 pl-10 pr-4 py-2.5 rounded-lg border border-border bg-bg-secondary text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Категория
              </label>
              <div className="h-64 overflow-y-scroll rounded-lg border border-border bg-bg-secondary scrollbar-visible">
                {filteredCategories.length === 0 ? (
                  <p className="p-2 text-sm text-text-secondary">
                    Нет подходящих категорий
                  </p>
                ) : (
                  <ul className="divide-y divide-border px-3 py-2">
                    {filteredCategories.map((cat) => {
                      const isSelected = selectedCategory?.id === cat.id;
                      const isDisabled =
                        existingCategoryIds.includes(cat.id) &&
                        cat.id !== initialCategoryId;
                      return (
                        <li key={cat.id}>
                          <button
                            type="button"
                            disabled={isDisabled}
                            onClick={() => !isDisabled && setSelectedCategory(cat)}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-left text-md transition-colors ${
                              isDisabled
                                ? "text-text-secondary/60 cursor-not-allowed"
                                : "hover:bg-secondary/10 text-text-primary"
                            } ${
                              isSelected && !isDisabled
                                ? "bg-secondary/15 text-secondary font-medium border-l-4 border-secondary -ml-px pl-[calc(1rem-1px)]"
                                : ""
                            }`}
                          >
                            {isSelected && !isDisabled && (
                              <CheckIcon className="size-4 shrink-0 text-secondary" />
                            )}
                            <span>{cat.name}</span>
                            {isDisabled && (
                              <span className="ml-auto text-xs text-text-secondary/70">
                                уже выбрано
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              {mode === "edit" && (
                <p className="mt-1 text-xs text-text-secondary">
                  Подсказка: категории, которые уже используются в этой карточке,
                  отмечены как “уже выбрано”.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Процент кэшбэка
              </label>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                step={0.1}
                value={percentInput}
                onChange={(e) => setPercentInput(e.target.value)}
                placeholder="Например: 10"
                className="w-full h-10 px-4 py-2.5 rounded-lg border border-border bg-bg-secondary text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              />
              {!isPercentValid && percentInput.trim().length > 0 && (
                <p className="mt-1 text-xs text-red-600">
                  Введите число от 0 до 100
                </p>
              )}
            </div>

            {confirmDelete && mode === "edit" ? (
              <div className="pt-2 space-y-2">
                <div className="rounded-lg border border-border bg-bg-secondary p-3 text-sm text-text-primary">
                  Точно удалить категорию{" "}
                  <span className="font-semibold">
                    {selectedCategory?.name ?? ""}
                  </span>
                  ?
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-2.5 rounded-lg border border-border text-text-secondary hover:bg-bg-secondary transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!onDelete) return;
                      onDelete();
                      handleClose();
                    }}
                    className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 rounded-lg border border-border text-text-secondary hover:bg-bg-secondary transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex-1 py-2.5 rounded-lg bg-[#556b2f] text-white font-medium disabled:cursor-not-allowed hover:bg-card-hover transition-colors"
                >
                  {mode === "edit" ? "Сохранить" : "Добавить"}
                </button>
              </div>
            )}

            {!confirmDelete && mode === "edit" && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="w-full py-2.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
              >
                Удалить категорию
              </button>
            )}
          </form>

          {/* keep old layout markers for click-outside logic */}
          <div className="hidden" aria-hidden="true" />
        </DialogPanel>
      </div>
    </Dialog>
  );
}

/* Old version removed */
