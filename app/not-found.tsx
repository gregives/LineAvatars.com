import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container>
      <h1 className="font-semibold mb-6">404 page not found</h1>
      <Button href="/" className="inline-flex">
        Go home
      </Button>
    </Container>
  );
}
