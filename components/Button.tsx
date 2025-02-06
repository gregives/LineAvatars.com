"use client";

import { twMerge } from "tailwind-merge";
import NextLink from "next/link";
import React from "react";
import { Icon } from "./Icon";
import { mdiLoading } from "@mdi/js";

type ButtonProperties = (
  | ({
      href?: undefined;
    } & JSX.IntrinsicElements["button"])
  | Omit<React.ComponentProps<typeof NextLink>, "as">
) & {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "zinc" | "teal";
  variant?: "fill" | "soft" | "outline" | "menu" | "text";
  disabled?: boolean;
  loading?: boolean;
  leadingIcon?: string;
  trailingIcon?: string;
  as?: React.ElementType;
};

const styles = {
  fill: {
    teal: "bg-teal-600 hover:bg-teal-500 text-white",
    zinc: "bg-zinc-700 hover:bg-zinc-500 text-white",
  },
  soft: {
    teal: "bg-teal-200 hover:bg-teal-300",
    zinc: "bg-zinc-100 hover:bg-zinc-200",
  },
  outline: {
    teal: "ring-2 ring-inset ring-teal-200 hover:ring-teal-400",
    zinc: "ring-2 ring-inset ring-zinc-200 hover:ring-zinc-400",
  },
  menu: {
    teal: "hover:bg-teal-100 ui-active:bg-teal-100",
    zinc: "hover:bg-zinc-100 ui-active:bg-zinc-100",
  },
  text: {
    teal: "hover:bg-teal-100 text-teal-700",
    zinc: "hover:bg-zinc-100",
  },
};

export function Button({
  children,
  className,
  href,
  size = "md",
  color = "teal",
  variant = "soft",
  disabled,
  loading,
  leadingIcon,
  trailingIcon,
  as: Component = href === undefined ? "button" : NextLink,
  ...properties
}: ButtonProperties) {
  className = twMerge(
    "flex justify-center items-center font-medium rounded-xl",
    size === "xs"
      ? "py-1 px-2 space-x-0.5 text-xs"
      : size === "sm"
      ? "py-1.5 px-3 space-x-1 text-sm"
      : size === "md"
      ? "py-2 px-4 space-x-1.5 text-base"
      : size === "lg"
      ? "py-2.5 px-5 space-x-2 text-base sm:text-lg"
      : "py-2.5 px-5 space-x-2 sm:py-3 sm:px-6 sm:space-x-2.5 text-lg sm:text-xl",
    variant === "menu" && "rounded-none",
    styles[variant][color],
    className
  );

  return (
    <Component
      className={className}
      type={Component === "button" ? "button" : undefined}
      href={href}
      {...properties}
    >
      {!trailingIcon && loading ? (
        <Icon className="-my-1 animate-spin" path={mdiLoading} />
      ) : leadingIcon ? (
        <Icon className="-my-1" path={leadingIcon} />
      ) : null}
      {children && <span>{children}</span>}
      {trailingIcon && loading ? (
        <Icon className="-my-1 animate-spin" path={mdiLoading} />
      ) : trailingIcon ? (
        <Icon className="-my-1" path={trailingIcon} />
      ) : null}
    </Component>
  );
}
