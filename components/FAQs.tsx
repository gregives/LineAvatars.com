import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { Icon } from "./Icon";
import { mdiChevronDown, mdiStar } from "@mdi/js";
import { Link } from "./Link";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { DonateButton } from "./DonateButton";

const questions = [
  {
    question: "What is a line avatar?",
    answer: (
      <>
        A line avatar, or a Notion-style line avatar, is a simple representation
        of a person&rsquo;s face. It is most often used as a profile photo for
        social media.
      </>
    ),
  },
  {
    question: "Who first created line avatars?",
    answer: (
      <>
        Line avatars were popularised by Notion, a productivity app. Notion have
        since created{" "}
        <Link
          href="https://faces.notion.com"
          className="underline underline-offset-2"
        >
          Notion Faces
        </Link>{" "}
        where you can create your own (although it doesn&rsquo;t use your webcam
        like we do).
      </>
    ),
  },
  {
    question: "How much do line avatars cost?",
    answer: (
      <>
        Line avatars can cost as much as $150 when they are created for you by a
        designer, however, by using AI we can create you one for free!
      </>
    ),
  },
  {
    question: (
      <>
        Is <Logo /> safe to use?
      </>
    ),
    answer: (
      <>
        Yes, the processing is done entirely in your browser and you can view
        the source code on{" "}
        <Link
          href="https://github.com/gregives/LineAvatars.com"
          className="underline underline-offset-2"
        >
          GitHub
        </Link>
        .
      </>
    ),
  },
  {
    question: (
      <>
        How can I support <Logo />?
      </>
    ),
    answer: (
      <>
        If you know how to code, you can help to improve <Logo /> by
        contributing to our{" "}
        <Link
          href="https://github.com/gregives/LineAvatars.com"
          className="underline underline-offset-2"
        >
          GitHub repository
        </Link>
        . If you don&rsquo;t know how to code, any donation would be greatly
        appreciated.
        <div className="mt-6">
          <DonateButton className="inline-flex" />
        </div>
      </>
    ),
  },
];

type FAQsProperties = JSX.IntrinsicElements["div"];

export function FAQs({ className, ...properties }: FAQsProperties) {
  return (
    <div className={twMerge("space-y-4", className)} {...properties}>
      {questions.map(({ question, answer }, index) => (
        <Disclosure key={index} as="div" className="space-y-2">
          <h2 className="relative font-semibold">
            <DisclosureButton className="group text-left rounded-lg">
              {question}
              <span className="whitespace-nowrap">
                &nbsp;
                <Icon
                  path={mdiChevronDown}
                  className="inline -mt-0.5 group-data-[open]:rotate-180"
                />
              </span>
            </DisclosureButton>
          </h2>
          <DisclosurePanel as="p">{answer}</DisclosurePanel>
        </Disclosure>
      ))}
    </div>
  );
}
