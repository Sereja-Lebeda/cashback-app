import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
  Bars3Icon,
} from "@heroicons/react/16/solid";

export default function DropMenu({ children, className, onMoveClick }) {
  return (
    <Menu>
      <MenuButton className={className}>{children}</MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="w-36 origin-top-right rounded-xl border border-white/5 bg-text-secondary/90 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        <MenuItem>
          <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
            <PencilIcon className="size-4 fill-white/30" />
            Edit
          </button>
        </MenuItem>
        <MenuItem>
          <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
            <Square2StackIcon className="size-4 fill-white/30" />
            Duplicate
          </button>
        </MenuItem>
        <MenuItem>
          <button
            className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10"
            onClick={onMoveClick}
          >
            <Bars3Icon className="size-4 fill-white/30" />
            Replace
          </button>
        </MenuItem>
        <div className="my-1 h-px bg-white/5" />

        <MenuItem>
          <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
            <TrashIcon className="size-4 fill-white/30" />
            Delete
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
