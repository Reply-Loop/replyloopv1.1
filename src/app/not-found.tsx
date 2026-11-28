import { TextLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Rule } from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <section className="py-24 sm:py-32">
      <Container size="narrow">
        <Rule className="mb-6" />
        <h1 className="font-serif text-4xl font-medium sm:text-5xl">This page is not here.</h1>
        <p className="mt-5 max-w-xl text-lg text-slate">
          The link may be old, or the page may have moved.
        </p>
        <div className="mt-8">
          <TextLink href="/">Go to the home page</TextLink>
        </div>
      </Container>
    </section>
  );
}
