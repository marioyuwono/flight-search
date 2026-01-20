import { Container } from "@/components/Container"

export function Footer() {
  return (
    <div className="relative">
      <Container>
        <div className="my-10 text-sm text-center text-gray-600 dark:text-gray-400">
          Copyright © {new Date().getFullYear()}
        </div>
      </Container>
    </div>
  );
}
