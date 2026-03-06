import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/16/solid";
import categories from "../categories";

export default function AddCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  organizationName = "",
  existingCategoryIds = [],
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [percent, setPercent] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase().trim()),
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (
      !selectedCategory ||
      !percent.trim() ||
      existingCategoryIds.includes(selectedCategory.id)
    )
      return;
    onSubmit({
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      categoryProcent: percent.trim().endsWith("%")
        ? percent.trim()
        : `${percent.trim()}%`,
    });
    setSearch("");
    setSelectedCategory(null);
    setPercent("");
    onClose();
  }

  function handleClose() {
    setSearch("");
    setSelectedCategory(null);
    setPercent("");
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
          <DialogTitle className="text-lg font-semibold text-text-primary">
            Добавить категорию
            {organizationName && (
              <span className="block text-sm font-normal text-text-secondary mt-0.5">
                для {organizationName}
              </span>
            )}
          </DialogTitle>

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
                      const isDisabled = existingCategoryIds.includes(cat.id);
                      return (
                        <li key={cat.id}>
                          <button
                            type="button"
                            disabled={isDisabled}
                            onClick={() =>
                              !isDisabled && setSelectedCategory(cat)
                            }
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
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Процент кэшбэка
              </label>
              <input
                type="text"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
                placeholder="Например: 10 или 10%"
                className="w-full h-10 px-4 py-2.5 rounded-lg border border-border bg-bg-secondary text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              />
            </div>

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
                disabled={!selectedCategory || !percent.trim()}
                className="flex-1 py-2.5 rounded-lg bg-[#556b2f] text-white font-medium disabled:cursor-not-allowed hover:bg-card-hover transition-colors"
              >
                Добавить
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
