"use client";

import {
  Menu as HeadlessMenu,
  MenuItems as HeadlessMenuItems,
} from "@headlessui/react";
import { twMerge } from "tailwind-merge";

export function Menu({
  as = "div",
  className,
  ...properties
}: React.ComponentProps<typeof HeadlessMenu>) {
  return (
    <HeadlessMenu
      as={as}
      className={twMerge("relative", className)}
      {...properties}
    />
  );
}

export function MenuItems({
  className,
  ...properties
}: React.ComponentProps<typeof HeadlessMenuItems>) {
  const anchor =
    typeof properties.anchor === "string" ? properties.anchor : "bottom start";

  return (
    <HeadlessMenuItems
      anchor={{
        to: anchor,
        padding: 8,
        ...(typeof properties.anchor === "object" ? properties.anchor : {}),
      }}
      className={twMerge(
        "w-min z-10 py-2 rounded-lg bg-white shadow-lg border border-stone-300 focus:outline-none",
        anchor.startsWith("bottom")
          ? "mt-2"
          : anchor.startsWith("top")
          ? "mb-2"
          : anchor.startsWith("right")
          ? "ml-2"
          : anchor.startsWith("left")
          ? "mr-2"
          : undefined,
        className
      )}
      {...properties}
    />
  );
}

export { MenuButton, MenuItem } from "@headlessui/react";
