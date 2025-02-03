import { twMerge } from "tailwind-merge";
import { Link } from "./Link";
import { Container } from "./Container";
import { Logo } from "./Logo";

type HeaderProperties = JSX.IntrinsicElements["header"];

export function Header({ className, ...properties }: HeaderProperties) {
  return (
    <header
      className={twMerge("flex justify-between", className)}
      {...properties}
    >
      <Container className="pb-0">
        <Link href="/" className="text-sm font-medium">
          <Logo />
        </Link>
      </Container>
    </header>
  );
}
