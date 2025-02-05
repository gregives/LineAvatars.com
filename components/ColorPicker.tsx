import { twMerge } from "tailwind-merge";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { useState } from "react";
import colors from "tailwindcss/colors";
import { mdiWaterOff } from "@mdi/js";
import { capitalizeFirstLetter } from "@/utilities/constants";

type ColorPickerProperties = Omit<
  React.ComponentProps<typeof Button>,
  "color" | "onChange"
> & {
  color: string | undefined;
  onChange: (color: string) => void;
};

export function ColorPicker({
  color = "#000",
  onChange,
  className,
  ...properties
}: ColorPickerProperties) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* @ts-ignore */}
      <Button
        color="zinc"
        variant="outline"
        style={{ backgroundColor: color }}
        className={twMerge(
          "block w-12 hover:opacity-75 ring-black/10 hover:ring-black/10",
          className
        )}
        {...properties}
        onClick={() => setOpen(true)}
      >
        &nbsp;<span className="sr-only">Pick color</span>
      </Button>
      <Modal open={open} onClose={setOpen}>
        <h1 className="font-semibold mb-6">Pick a color</h1>
        <div className="relative pb-[10%] mb-2">
          <div className="absolute inset-0 grid grid-cols-3 gap-2">
            <Button
              color="zinc"
              variant="outline"
              leadingIcon={mdiWaterOff}
              onClick={() => {
                onChange("#0000");
                setOpen(false);
              }}
              title="Transparent"
            >
              <span className="sr-only">Transparent</span>
            </Button>
            <Button
              color="zinc"
              variant="outline"
              onClick={() => {
                onChange("#fff");
                setOpen(false);
              }}
              title="White"
            >
              <span className="sr-only">White</span>
            </Button>
            <Button
              className="bg-black hover:bg-black/75"
              onClick={() => {
                onChange("#000");
                setOpen(false);
              }}
              title="Black"
            >
              <span className="sr-only">Black</span>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-11">
          {(
            [
              "zinc",
              "red",
              "orange",
              "amber",
              "yellow",
              "lime",
              "green",
              "emerald",
              "teal",
              "cyan",
              "sky",
              "blue",
              "indigo",
              "violet",
              "purple",
              "fuchsia",
              "pink",
              "rose",
            ] as const
          ).flatMap((hue, hueIndex, hues) =>
            (
              [
                "50",
                "100",
                "200",
                "300",
                "400",
                "500",
                "600",
                "700",
                "800",
                "900",
                "950",
              ] as const
            ).map((shade, shadeIndex, shades) => (
              <button
                key={hue + shade}
                className={twMerge(
                  "aspect-square hover:opacity-75",
                  shadeIndex === 0
                    ? hueIndex === 0
                      ? "rounded-tl-xl"
                      : hueIndex === hues.length - 1
                      ? "rounded-bl-xl"
                      : null
                    : shadeIndex === shades.length - 1
                    ? hueIndex === 0
                      ? "rounded-tr-xl"
                      : hueIndex === hues.length - 1
                      ? "rounded-br-xl"
                      : null
                    : null
                )}
                style={{ backgroundColor: colors[hue][shade] }}
                onClick={() => {
                  onChange(colors[hue][shade]);
                  setOpen(false);
                }}
                title={`${capitalizeFirstLetter(hue)} ${shade}`}
              >
                <span className="sr-only">
                  {capitalizeFirstLetter(hue)} {shade}
                </span>
              </button>
            ))
          )}
        </div>
      </Modal>
    </>
  );
}
