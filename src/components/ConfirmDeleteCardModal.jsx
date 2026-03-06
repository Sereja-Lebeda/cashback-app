import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/16/solid";

export default function ConfirmDeleteCardModal({
  isOpen,
  onClose,
  onConfirm,
}) {
  function handleConfirm() {
    onConfirm();
    onClose();
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
      data-confirm-delete-modal
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          data-confirm-delete-modal
          className="mx-auto max-w-md w-full rounded-2xl border border-border bg-bg-primary p-6 shadow-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <ExclamationTriangleIcon className="size-6 text-amber-500 shrink-0" />
              Удалить карточку?
            </DialogTitle>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 inline-flex items-center justify-center rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Закрыть"
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>

          <p className="mt-3 text-text-secondary">
            Вы действительно хотите удалить эту карточку? Это действие нельзя
            отменить.
          </p>

          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-border text-text-secondary hover:bg-bg-secondary transition-colors"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
            >
              Удалить
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
