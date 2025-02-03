import NextLink from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

type LinkProperties = React.ComponentProps<typeof NextLink>;

export function Link({ className, ...properties }: LinkProperties) {
  return (
    <NextLink
      className={twMerge(
        "rounded hover:opacity-75 hover:saturate-150",
        className
      )}
      {...properties}
    />
  );
}
