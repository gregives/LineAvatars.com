import { twMerge } from "tailwind-merge";

type WrapProperties = JSX.IntrinsicElements["div"];

export function Wrap({ className, ...properties }: WrapProperties) {
  return (
    <div
      className={twMerge("flex flex-wrap -m-1.5 *:m-1.5", className)}
      {...properties}
    />
  );
}
