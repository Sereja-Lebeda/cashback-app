import { useMemo, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import organizations from "../organizations";
import categories from "../categories";

function parsePercentToNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    const withoutPercent = trimmed.endsWith("%")
      ? trimmed.slice(0, -1).trim()
      : trimmed;
    const normalized = withoutPercent.replace(",", ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export default function AddCardModal({ isOpen, onClose, onSubmit }) {
  const [bankSearch, setBankSearch] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [categoryRows, setCategoryRows] = useState([
    { categoryId: "", categoryPercent: "" },
  ]);

  const filteredOrganizations = useMemo(() => {
    const q = bankSearch.toLowerCase().trim();
    return organizations.filter((org) => org.name.toLowerCase().includes(q));
  }, [bankSearch]);

  const selectedOrganization =
    organizations.find((o) => o.id === selectedOrgId) ?? null;

  const hasInvalidPartialRow = categoryRows.some((row) => {
    const hasCategory = !!row.categoryId;
    const hasPercent = row.categoryPercent !== "";
    if (!hasCategory && !hasPercent) return false;
    if (!hasCategory || !hasPercent) return true;
    const pct = parsePercentToNumber(row.categoryPercent);
    return !Number.isFinite(pct) || pct < 0 || pct > 100;
  });

  const hasValidRows = categoryRows.some(
    (row) =>
      row.categoryId &&
      row.categoryPercent !== "" &&
      parsePercentToNumber(row.categoryPercent) >= 0 &&
      parsePercentToNumber(row.categoryPercent) <= 100,
  );

  const canSubmit =
    !!selectedOrganization && hasValidRows && !hasInvalidPartialRow;

  function handleAddRow() {
    setCategoryRows((prev) => [
      ...prev,
      { categoryId: "", categoryPercent: "" },
    ]);
  }

  function handleRemoveRow(index) {
    setCategoryRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }

  function handleRowChange(index, field, value) {
    setCategoryRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit || !selectedOrganization) return;

    const validCategories = categoryRows
      .filter(
        (row) =>
          row.categoryId &&
          row.categoryPercent !== "" &&
          parsePercentToNumber(row.categoryPercent) >= 0 &&
          parsePercentToNumber(row.categoryPercent) <= 100,
      )
      .map((row) => {
        const cat = categories.find((c) => c.id === row.categoryId);
        return {
          categoryId: row.categoryId,
          categoryName: cat?.name ?? row.categoryId,
          categoryPercent: parsePercentToNumber(row.categoryPercent),
        };
      });

    onSubmit({
      organizationId: selectedOrganization.id,
      organizationName: selectedOrganization.name,
      categories: validCategories,
    });
    handleClose();
  }

  function handleClose() {
    setBankSearch("");
    setSelectedOrgId(null);
    setCategoryRows([{ categoryId: "", categoryPercent: "" }]);
    onClose();
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="relative z-50"
      data-add-card-modal
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 overflow-y-auto">
        <DialogPanel
          data-add-card-modal
          className="mx-auto max-w-xl w-full h-[93vh] min-h-[620px] rounded-2xl border border-border bg-bg-primary p-6 shadow-xl my-8 overflow-y-auto"
        >
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-lg font-semibold text-text-primary">
              Добавить карточку
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
                Банк
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-text-secondary" />
                <input
                  type="text"
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  placeholder="Поиск банка..."
                  className="w-full h-10 pl-10 pr-4 py-2.5 rounded-lg border border-border bg-bg-secondary text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>
              <div className="h-56 overflow-y-auto mt-2 rounded-lg border border-border bg-bg-secondary scrollbar-visible">
                {filteredOrganizations.length === 0 ? (
                  <p className="p-2 text-sm text-text-secondary">
                    Нет подходящих банков
                  </p>
                ) : (
                  <ul className="divide-y divide-border px-3 py-2">
                    {filteredOrganizations.map((org) => {
                      const isSelected = selectedOrgId === org.id;
                      return (
                        <li key={org.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedOrgId(org.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-left text-md transition-colors ${
                              isSelected
                                ? "bg-secondary/15 text-secondary font-medium border-l-4 border-secondary -ml-px pl-[calc(1rem-1px)]"
                                : "hover:bg-secondary/10 text-text-primary"
                            }`}
                          >
                            {isSelected && (
                              <CheckIcon className="size-4 shrink-0 text-secondary" />
                            )}
                            <span>{org.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-text-secondary">
                  Категории и проценты
                </label>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="inline-flex items-center gap-1 text-sm text-secondary hover:text-secondary/80 font-medium"
                >
                  <PlusIcon className="size-4" />
                  Добавить
                </button>
              </div>
              <div className="space-y-2 h-72 overflow-y-auto overflow-x-hidden scrollbar-visible w-full border border-bg-secondary rounded-lg p-2">
                {categoryRows.map((row, index) => {
                  const availableCats = categories.filter(
                    (c) => c.id !== "all",
                  );
                  const selectedCat =
                    row.categoryId &&
                    availableCats.find((c) => c.id === row.categoryId);
                  return (
                    <div
                      key={index}
                      className="flex gap-2 items-center p-1 rounded-lg border border-border bg-bg-secondary min-w-0 w-full"
                    >
                      <Listbox
                        as="div"
                        value={selectedCat ?? null}
                        onChange={(cat) =>
                          handleRowChange(index, "categoryId", cat?.id ?? "")
                        }
                        by={(a, b) => a?.id === b?.id}
                        className="flex-1 min-w-0 relative"
                      >
                        <ListboxButton className="flex w-full items-center justify-between gap-2 h-9 px-3 rounded-lg border border-border bg-bg-primary text-left text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent min-w-0">
                          <span className="truncate">
                            {selectedCat?.name ?? "Выберите категорию"}
                          </span>
                          <ChevronUpDownIcon className="size-4 shrink-0 text-text-secondary" />
                        </ListboxButton>
                        <ListboxOptions
                          anchor={{
                            to: "bottom start",
                            gap: 4,
                            padding: 8,
                          }}
                          className="z-60 max-h-60 min-w-(--button-width) overflow-y-auto rounded-lg border border-border bg-bg-primary py-1 shadow-lg scrollbar-visible"
                        >
                          {availableCats.map((cat) => {
                            const usedElsewhere = categoryRows.some(
                              (r, i) => i !== index && r.categoryId === cat.id,
                            );
                            return (
                              <ListboxOption
                                key={cat.id}
                                value={cat}
                                disabled={usedElsewhere}
                                className="cursor-pointer px-3 py-2 text-sm text-text-primary data-focus:bg-bg-secondary data-disabled:cursor-not-allowed data-disabled:opacity-60"
                              >
                                {cat.name}
                                {usedElsewhere ? " (уже выбрано)" : ""}
                              </ListboxOption>
                            );
                          })}
                        </ListboxOptions>
                      </Listbox>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={100}
                        step={0.1}
                        value={row.categoryPercent}
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            "categoryPercent",
                            e.target.value,
                          )
                        }
                        placeholder="%"
                        className="w-16 h-9 px-2 rounded-lg border border-border bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(index)}
                        disabled={categoryRows.length <= 1}
                        className="shrink-0 p-1.5 rounded-lg text-text-secondary hover:bg-bg-primary hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Удалить категорию"
                      >
                        <TrashIcon className="size-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
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
                disabled={!canSubmit}
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
