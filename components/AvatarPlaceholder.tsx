import { twMerge } from "tailwind-merge";

type AvatarPlaceholderProperties = JSX.IntrinsicElements["div"];

export function AvatarPlaceholder({
  className,
  ...properties
}: AvatarPlaceholderProperties) {
  return (
    <div
      className={twMerge(
        "aspect-square rounded-xl bg-zinc-200 animate-pulse",
        className
      )}
      {...properties}
    />
  );
}
