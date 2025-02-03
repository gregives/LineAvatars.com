"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { Container } from "./Container";
import { twMerge } from "tailwind-merge";

type ModalProperties = React.ComponentProps<typeof Dialog>;

export function Modal({ children, className, ...properties }: ModalProperties) {
  return (
    <Dialog as="div" className="relative z-10" {...properties}>
      <div className="fixed inset-0 bg-zinc-900 bg-opacity-50" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-2 sm:items-center sm:p-0">
          <DialogPanel
            as={Container}
            className={twMerge(
              "rounded-3xl bg-white shadow-xl w-full sm:my-8 sm:max-w-lg",
              className
            )}
          >
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
