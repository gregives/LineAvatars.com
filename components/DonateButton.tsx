import { mdiStar } from "@mdi/js";
import { Button } from "./Button";
import { twMerge } from "tailwind-merge";

type DonateButtonProperties = React.ComponentProps<typeof Button>;

export function DonateButton({
  className,
  ...properties
}: DonateButtonProperties) {
  return (
    // @ts-ignore
    <Button
      className={twMerge("bg-yellow-400 hover:bg-yellow-500", className)}
      leadingIcon={mdiStar}
      href="https://donate.stripe.com/5kA7uk7GlaZw4sodQQ"
      {...properties}
    >
      Donate
    </Button>
  );
}
