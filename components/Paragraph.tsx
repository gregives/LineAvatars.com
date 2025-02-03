import { twMerge } from "tailwind-merge";

type ParagraphProperties = JSX.IntrinsicElements["p"];

export function Paragraph({ className, ...properties }: ParagraphProperties) {
  return <p className={twMerge("mb-6 last:mb-0", className)} {...properties} />;
}
