import { Container } from "./Container";
import { Paragraph } from "./Paragraph";
import { Logo } from "./Logo";
import { Link } from "./Link";
import { Wrap } from "./Wrap";
import { mdiStar } from "@mdi/js";
import { Icon } from "./Icon";

type FooterProperties = JSX.IntrinsicElements["footer"];

export function Footer(properties: FooterProperties) {
  return (
    <footer {...properties}>
      <Container>
        <Wrap className="justify-between items-center text-zinc-600 text-sm">
          <Paragraph>
            &copy; <Logo /> {new Date().getFullYear()}
          </Paragraph>
          <Link
            href="https://github.com/gregives/LineAvatars.com"
            className="flex items-center"
          >
            <Icon path={mdiStar} className="-ml-0.5 mr-1" />
            Star on GitHub
          </Link>
        </Wrap>
      </Container>
    </footer>
  );
}
