import { useEffect, useMemo, useState } from "react";
import {
  Checkbox,
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
} from "@heroicons/react/16/solid";
import organizations from "../organizations";
import { ResetDayInput } from "./ResetDayInput";

export default function ChangeBankModal({
  isOpen,
  onClose,
  onSubmit,
  currentOrganizationId = null,
  initialResetCategoriesEnabled = false,
  initialResetCategoriesDay = null,
}) {
  const [search, setSearch] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState(currentOrganizationId);
  const [resetCategoriesEnabled, setResetCategoriesEnabled] = useState(
    initialResetCategoriesEnabled,
  );
  const [resetCategoriesDay, setResetCategoriesDay] = useState(
    initialResetCategoriesDay ?? 1,
  );
  const [resetCategoriesMode, setResetCategoriesMode] = useState(() => {
    const day = initialResetCategoriesDay ?? 1;
    return day === 1 ? "first" : day === 31 ? "last" : "specific";
  });
  const [specificDayInput, setSpecificDayInput] = useState(() =>
    String(initialResetCategoriesDay ?? 15),
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedOrgId(currentOrganizationId);
      setResetCategoriesEnabled(initialResetCategoriesEnabled);
      const day = initialResetCategoriesDay ?? 1;
      setResetCategoriesDay(day);
      setResetCategoriesMode(
        day === 1 ? "first" : day === 31 ? "last" : "specific",
      );
      setSpecificDayInput(String(day >= 2 && day <= 30 ? day : 15));
    }
  }, [
    isOpen,
    currentOrganizationId,
    initialResetCategoriesEnabled,
    initialResetCategoriesDay,
  ]);

  const filteredOrganizations = useMemo(() => {
    const q = search.toLowerCase().trim();
    return organizations.filter((org) => org.name.toLowerCase().includes(q));
  }, [search]);

  const selectedOrganization =
    organizations.find((o) => o.id === selectedOrgId) ?? null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedOrganization) return;
    onSubmit({
      organizationId: selectedOrganization.id,
      resetCategoriesEnabled,
      resetCategoriesDay: resetCategoriesEnabled ? resetCategoriesDay : null,
    });
    handleClose();
  }

  function handleClose() {
    setSearch("");
    setSelectedOrgId(currentOrganizationId);
    setResetCategoriesEnabled(initialResetCategoriesEnabled);
    setResetCategoriesDay(initialResetCategoriesDay ?? 1);
      setResetCategoriesMode(
        (initialResetCategoriesDay ?? 1) === 1
          ? "first"
          : (initialResetCategoriesDay ?? 1) === 31
            ? "last"
            : "specific",
      );
      const day = initialResetCategoriesDay ?? 1;
      setSpecificDayInput(
        String(day >= 2 && day <= 30 ? day : 15),
      );
    onClose();
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="relative z-50"
      data-change-bank-modal
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          data-change-bank-modal
          className="mx-auto max-w-md w-full rounded-2xl border border-border bg-bg-primary p-6 shadow-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-lg font-semibold text-text-primary">
              Изменить банк
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
                Поиск банка
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
                Банк
              </label>
              <div className="h-64 overflow-y-scroll rounded-lg border border-border bg-bg-secondary scrollbar-visible">
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
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Обнуление категорий
              </label>
              <div className="space-y-2 border border-bg-secondary rounded-lg p-2">
                <label
                  onClick={() =>
                    setResetCategoriesEnabled((prev) => !prev)
                  }
                  className="flex items-center gap-3 h-9 px-3 rounded-lg border border-border bg-bg-secondary cursor-pointer hover:bg-bg-primary transition-colors focus-within:ring-2 focus-within:ring-accent focus-within:outline-none"
                >
                  <Checkbox
                    checked={resetCategoriesEnabled}
                    onChange={setResetCategoriesEnabled}
                    onClick={(e) => e.stopPropagation()}
                    className="group flex size-4 shrink-0 items-center justify-center rounded border-2 border-border bg-bg-secondary transition-colors data-checked:border-accent data-checked:bg-accent focus:outline-none focus:ring-0"
                  >
                    <CheckIcon className="size-2.5 text-white opacity-0 group-data-checked:opacity-100" />
                  </Checkbox>
                  <span className="text-sm text-text-primary">
                    Обнулять категории?
                  </span>
                </label>
                {resetCategoriesEnabled ? (
                  <div className="space-y-2">
                    <label className="block text-xs text-text-secondary mb-1">
                      День месяца для обнуления
                    </label>
                    <Listbox
                      as="div"
                      value={resetCategoriesMode}
                      onChange={(mode) => {
                        setResetCategoriesMode(mode);
                        if (mode === "first") setResetCategoriesDay(1);
                        else if (mode === "last") setResetCategoriesDay(31);
                        else {
                          const day =
                            resetCategoriesDay >= 2 &&
                            resetCategoriesDay <= 30
                              ? resetCategoriesDay
                              : 15;
                          setResetCategoriesDay(day);
                          setSpecificDayInput(String(day));
                        }
                      }}
                      className="relative"
                    >
                      <ListboxButton className="flex w-full items-center justify-between gap-2 h-9 px-3 rounded-lg border border-border bg-bg-primary text-left text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent min-w-0">
                        <span className="pl-3">
                          {resetCategoriesMode === "first"
                            ? "Первый день месяца"
                            : resetCategoriesMode === "last"
                              ? "Последний день месяца"
                              : "Конкретное число"}
                        </span>
                        <ChevronUpDownIcon className="size-4 shrink-0 text-text-secondary" />
                      </ListboxButton>
                      <ListboxOptions
                        anchor={{ to: "bottom start", gap: 4, padding: 8 }}
                        className="z-60 min-w-(--button-width) overflow-y-auto rounded-lg border border-border bg-bg-primary py-1 shadow-lg"
                      >
                        <ListboxOption
                          value="first"
                          className="cursor-pointer px-3 py-2 text-sm text-text-primary data-focus:bg-bg-secondary"
                        >
                          Первый день месяца
                        </ListboxOption>
                        <ListboxOption
                          value="last"
                          className="cursor-pointer px-3 py-2 text-sm text-text-primary data-focus:bg-bg-secondary"
                        >
                          Последний день месяца
                        </ListboxOption>
                        <ListboxOption
                          value="specific"
                          className="cursor-pointer px-3 py-2 text-sm text-text-primary data-focus:bg-bg-secondary"
                        >
                          Конкретное число
                        </ListboxOption>
                      </ListboxOptions>
                    </Listbox>
                    {resetCategoriesMode === "specific" && (
                      <div>
                        <label className="block text-xs text-text-secondary mb-1">
                          Число (1–31)
                        </label>
                        <ResetDayInput
                          inputValue={specificDayInput}
                          onInputChange={setSpecificDayInput}
                          dayValue={resetCategoriesDay}
                          onDayChange={setResetCategoriesDay}
                          onSwitchToLast={() => {
                            setResetCategoriesMode("last");
                            setResetCategoriesDay(31);
                          }}
                          className="w-full h-9 px-3 rounded-lg border border-border bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <p className="mt-1 text-xs text-text-secondary">
                          {resetCategoriesDay === 31
                            ? "Обнуление 28–31 числа в зависимости от месяца"
                            : `${resetCategoriesDay}-е число каждого месяца`}
                        </p>
                      </div>
                    )}
                    {resetCategoriesMode === "first" && (
                      <p className="text-xs text-text-secondary">
                        1-е число каждого месяца
                      </p>
                    )}
                    {resetCategoriesMode === "last" && (
                      <p className="text-xs text-text-secondary">
                        Обнуление 28–31 числа в зависимости от месяца
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-text-secondary">
                    Опция не выбрана. Включите, чтобы категории автоматически
                    обнулялись в выбранный день месяца.
                  </p>
                )}
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
                disabled={!selectedOrganization}
                className="flex-1 py-2.5 rounded-lg bg-[#556b2f] text-white font-medium disabled:cursor-not-allowed hover:bg-card-hover transition-colors"
              >
                Сохранить
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
