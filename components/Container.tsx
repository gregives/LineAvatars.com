import { twMerge } from "tailwind-merge";

type ContainerProperties = JSX.IntrinsicElements["div"];

export function Container({ className, ...properties }: ContainerProperties) {
  return <div className={twMerge("px-6 py-8", className)} {...properties} />;
}
