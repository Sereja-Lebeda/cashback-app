import { useMemo, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import organizations from "../organizations";

export default function ChangeBankModal({
  isOpen,
  onClose,
  onSubmit,
  currentOrganizationId = null,
}) {
  const [search, setSearch] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState(currentOrganizationId);

  const filteredOrganizations = useMemo(() => {
    const q = search.toLowerCase().trim();
    return organizations.filter((org) =>
      org.name.toLowerCase().includes(q),
    );
  }, [search]);

  const selectedOrganization =
    organizations.find((o) => o.id === selectedOrgId) ?? null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedOrganization) return;
    onSubmit(selectedOrganization.id);
    handleClose();
  }

  function handleClose() {
    setSearch("");
    setSelectedOrgId(currentOrganizationId);
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

