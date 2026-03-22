import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
  Bars3Icon,
  BackspaceIcon,
} from "@heroicons/react/16/solid";

export default function DropMenu({
  children,
  className,
  onMoveClick,
  onEditClick,
  onDuplicateClick,
  onDeleteClick,
  onCategoryWipeClick,
}) {
  return (
    <Menu>
      <MenuButton
        className={`${className} focus:outline-none focus-visible:outline-none focus-visible:ring-0`}
      >
        {children}
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="z-50 w-36 origin-top-right rounded-xl border border-white/5 bg-text-secondary p-1 text-sm/6 text-white shadow-xl transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 data-closed:scale-95 data-closed:opacity-0 select-none"
      >
        <MenuItem>
          <button
            type="button"
            onClick={onEditClick}
            className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 bg-text-secondary focus:outline-none focus:ring-0 focus-visible:ring-0"
          >
            <PencilIcon className="size-4 fill-white/30" />
            Edit
          </button>
        </MenuItem>
        <MenuItem>
          <button
            type="button"
            onClick={onDuplicateClick}
            className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 bg-text-secondary focus:outline-none focus:ring-0 focus-visible:ring-0"
          >
            <Square2StackIcon className="size-4 fill-white/30" />
            Duplicate
          </button>
        </MenuItem>
        <MenuItem>
          <button
            type="button"
            onClick={onMoveClick}
            className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 bg-text-secondary focus:outline-none focus:ring-0 focus-visible:ring-0"
          >
            <Bars3Icon className="size-4 fill-white/30" />
            Replace
          </button>
        </MenuItem>
        <div className="h-px bg-white/20 my-0.5 mx-1 shrink-0" />

        <MenuItem>
          <button
            type="button"
            onClick={onCategoryWipeClick}
            className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 bg-text-secondary focus:outline-none focus:ring-0 focus-visible:ring-0"
          >
            <BackspaceIcon className="size-4 fill-white/30" />
            Clear
          </button>
        </MenuItem>

        <MenuItem>
          <button
            type="button"
            onClick={onDeleteClick}
            className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 bg-text-secondary focus:outline-none focus:ring-0 focus-visible:ring-0"
          >
            <TrashIcon className="size-4 fill-white/30" />
            Delete
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
