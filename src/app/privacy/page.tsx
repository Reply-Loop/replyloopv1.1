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
  title: "Privacy Policy (Draft) | ReplyLoop",
  absoluteTitle: true,
  description: "How the ReplyLoop website handles information. Draft, pending attorney review.",
  path: "/privacy",
  noindex: true,
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ]}
        eyebrow="Legal"
        title="Privacy policy"
        intro="How this website handles information."
        showButton={false}
      />
      <Container size="prose" className="py-14 sm:py-16">
        <DraftNotice />
        <Prose>
          <p>
            <strong>Last updated:</strong> [DATE]
          </p>
          <p>
            This policy covers the ReplyLoop website at reply-loop.com. It does not cover the services we provide to
            clients, which are covered by a separate written agreement.
          </p>

          <h2>Who we are</h2>
          <p>
            ReplyLoop is a [LEGAL ENTITY NAME AND TYPE] serving Murray, Salt Lake City, Salt Lake County, and Utah. You can
            reach us at <a href={site.email.href}>{site.email.display}</a> or{" "}
            <a href={site.phone.href}>{site.phone.display}</a>.
          </p>

          <h2>What this website collects</h2>
          <ul>
            <li>
              <strong>No forms.</strong> This website has no contact form and no sign-up. We do not collect your name or
              email through the site.
            </li>
            <li>
              <strong>Analytics, only with your yes.</strong> If you accept cookies, we use Google Analytics to see which
              pages are visited and which links are clicked, such as the booking button, the phone link, and the email
              link. If you decline, Google Analytics does not load. Advertising features are turned off.
            </li>
            <li>
              <strong>Your cookie choice.</strong> We store your accept or decline choice in your browser so we do not ask
              again on every page.
            </li>
            <li>
              <strong>Server logs.</strong> Our hosting provider, [HOSTING PROVIDER], may record standard technical
              information such as IP address and browser type to run and protect the site.
            </li>
          </ul>

          <h2>Booking, calls, and email</h2>
          <p>
            The &ldquo;Book an intro call&rdquo; button opens a scheduling page run by Cal.com in a new tab. Information
            you enter there is handled under Cal.com&apos;s own privacy policy. If you call or email us, we use what you
            share to respond to you and to talk about working together.
          </p>

          <h2>How we use information</h2>
          <ul>
            <li>To respond when you contact us.</li>
            <li>To understand which pages help, if you accepted analytics cookies.</li>
            <li>To keep the website working and secure.</li>
          </ul>
          <p>We do not sell personal information. [CONFIRM ANY OTHER SHARING WITH COUNSEL.]</p>

          <h2>Your choices</h2>
          <p>
            You can change your cookie choice at any time with the &ldquo;Cookie settings&rdquo; link in the footer, or
            by clearing cookies in your browser. To ask about information you shared with us by phone or email, contact us
            at <a href={site.email.href}>{site.email.display}</a>.
          </p>

          <h2>Children</h2>
          <p>This website is meant for business owners and is not directed to children.</p>

          <h2>Changes</h2>
          <p>
            We may update this policy. The date at the top shows the latest version.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy: <a href={site.email.href}>{site.email.display}</a>. See also our{" "}
            <Link href="/terms">terms of use</Link>.
          </p>
        </Prose>
      </Container>
    </>
  );
}
