import { twMerge } from "tailwind-merge";
import { Container } from "./Container";
import { Paragraph } from "./Paragraph";
import { Logo } from "./Logo";

type FooterProperties = JSX.IntrinsicElements["footer"];

export function Footer({ className, ...properties }: FooterProperties) {
  return (
    <footer
      className={twMerge("flex justify-between", className)}
      {...properties}
    >
      <Container>
        <Paragraph className="text-zinc-600 text-sm">
          &copy; <Logo /> {new Date().getFullYear()}
        </Paragraph>
      </Container>
    </footer>
  );
}
