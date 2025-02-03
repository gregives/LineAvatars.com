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
  | React.ComponentProps<typeof NextLink>
) & {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "zinc" | "teal";
  variant?: "fill" | "soft" | "outline" | "menu" | "text";
  disabled?: boolean;
  loading?: boolean;
  leadingIcon?: string;
  trailingIcon?: string;
};

const styles = {
  fill: {
    teal: "border border-transparent bg-teal-200 hover:bg-teal-300",
    zinc: "border border-transparent bg-zinc-700 hover:bg-zinc-500 text-white",
  },
  soft: {
    teal: "border border-transparent bg-teal-500/15 hover:bg-teal-500/30 text-teal-700",
    zinc: "border border-transparent bg-zinc-500/10 hover:bg-zinc-500/20",
  },
  outline: {
    teal: "border border-teal-500/50 hover:border-teal-500 bg-white text-teal-700",
    zinc: "border border-zinc-500/30 hover:border-zinc-500 bg-white",
  },
  menu: {
    teal: "border border-transparent hover:bg-teal-500/15 ui-active:bg-teal-500/15 text-teal-700",
    zinc: "border border-transparent hover:bg-zinc-500/10 ui-active:bg-zinc-500/10",
  },
  text: {
    teal: "border border-transparent hover:bg-teal-500/15 text-teal-700",
    zinc: "border border-transparent hover:bg-zinc-500/10",
  },
};

export function Button({
  children,
  className,
  href,
  size = "md",
  color = "teal",
  variant = "fill",
  disabled,
  loading,
  leadingIcon,
  trailingIcon,
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

  return href === undefined ? (
    // @ts-ignore
    <button className={className} type="button" {...properties}>
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
    </button>
  ) : (
    // @ts-ignore
    <NextLink className={className} href={href} {...properties}>
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
    </NextLink>
  );
}
