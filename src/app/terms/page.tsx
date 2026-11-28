import type { Metadata } from "next";
import Link from "next/link";
import { DraftNotice } from "@/components/ui/DraftNotice";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Prose } from "@/components/ui/Prose";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageBody } from "@/components/motion/PageBody";

// Draft legal page: kept out of search until an attorney reviews it.
export const metadata: Metadata = pageMetadata({
  title: "Terms of Use (Draft) | ReplyLoop",
  absoluteTitle: true,
  description: "Terms for using the ReplyLoop website. Draft, pending attorney review.",
  path: "/terms",
  noindex: true,
});

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Terms", path: "/terms" },
];

export default function TermsPage() {
  return (
    <>
      {/*
        * Compact reading header (brief §8.14): exempt from the 7/5 hero art rule, so no art.
        * One reading column shared with the body below, the H1 at the h2 size (as on a blog
        * post) over h2-compact section heads in the prose. Never inside the route transition.
        */}
      <section aria-labelledby="page-title" className="border-b border-rule pt-8 pb-12 sm:pt-12 sm:pb-16">
        <Container size="prose">
          <Breadcrumbs crumbs={CRUMBS} />
          <Eyebrow className="mt-12">Legal</Eyebrow>
          <h1 id="page-title" className="mt-6 font-serif text-h2 font-medium lg:mt-5">
            Terms of use
          </h1>
          <p className="mt-5 max-w-lede text-lede text-slate">The terms for using this website.</p>
        </Container>
      </section>
      <PageBody>
        {/* Ivory paper band, tight (reading) rhythm; body in the prose token at a 66ch measure. */}
        <Section rhythm="tight" containerSize="prose">
          <DraftNotice />
          <Prose>
            <p>
              <strong>Last updated:</strong> [DATE]
            </p>
            <p>
              These terms cover your use of the ReplyLoop website at reply-loop.com. Services for clients are covered only
              by a separate written agreement signed by both sides. Nothing on this website is an offer or a contract for
              services.
            </p>

            <h2>Information on this site</h2>
            <p>
              Our pages and guides are general information. They are not legal advice and not professional advice for your
              specific situation. For questions about your own legal or privacy duties, talk with an attorney.
            </p>

            <h2>Using the site</h2>
            <ul>
              <li>Use the site lawfully and do not try to disrupt it.</li>
              <li>Do not copy the site&apos;s content for commercial use without written permission.</li>
            </ul>

            <h2>Other websites</h2>
            <p>
              Some links open other services, such as the Cal.com scheduling page. Those services have their own terms and
              privacy policies.
            </p>

            <h2>Ownership</h2>
            <p>
              The ReplyLoop name, the loop mark, and the content of this site belong to [LEGAL ENTITY NAME]. [CONFIRM WITH
              COUNSEL.]
            </p>

            <h2>No warranties and limits of liability</h2>
            <p>
              The site is provided as is. [LIMITATION OF LIABILITY AND DISCLAIMER LANGUAGE TO BE WRITTEN BY COUNSEL.]
            </p>

            <h2>Governing law</h2>
            <p>[GOVERNING LAW AND VENUE: NOT YET DECIDED.]</p>

            <h2>Changes</h2>
            <p>We may update these terms. The date at the top shows the latest version.</p>

            <h2>Contact</h2>
            <p>
              Questions: <a href={site.email.href}>{site.email.display}</a> or{" "}
              <a href={site.phone.href}>{site.phone.display}</a>. See also our <Link href="/privacy">privacy policy</Link>.
            </p>
          </Prose>
        </Section>
      </PageBody>
    </>
  );
}
