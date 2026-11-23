import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { DraftNotice } from "@/components/ui/DraftNotice";
import { PageHero } from "@/components/ui/PageHero";
import { Prose } from "@/components/ui/Prose";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

// Draft legal page: kept out of search until an attorney reviews it.
export const metadata: Metadata = pageMetadata({
  title: "Terms of Use (Draft) | ReplyLoop",
  absoluteTitle: true,
  description: "Terms for using the ReplyLoop website. Draft, pending attorney review.",
  path: "/terms",
  noindex: true,
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Terms", path: "/terms" },
        ]}
        eyebrow="Legal"
        title="Terms of use"
        intro="The terms for using this website."
        showButton={false}
      />
      <Container size="prose" className="py-14 sm:py-16">
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
      </Container>
    </>
  );
}
