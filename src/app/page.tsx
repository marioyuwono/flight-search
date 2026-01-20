import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
export default function Home() {
  return (
    <Container>
      <SectionTitle
        preTitle="Flight Search"
        title="Find and Book Your Perfect Flight"
      >
        Use our powerful flight search engine to find the best deals on flights worldwide.
        Search by departure and return dates, number of passengers, and cabin class.
      </SectionTitle>
    </Container>
  );
}
