import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { BookButton, EmailLink, PhoneLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { HeroPlate } from "@/components/scenes/HeroPlate";
import { ServiceEmblem } from "@/components/scenes/ServiceEmblem";
import { Section } from "@/components/ui/Section";
import { breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageBody } from "@/components/motion/PageBody";

export const metadata: Metadata = pageMetadata({
  title: "Contact ReplyLoop | Book an Intro Call",
  absoluteTitle: true,
  description:
    "Book an intro call, call (801) 889-7181, or email hb@reply-loop.com. ReplyLoop serves Murray, Salt Lake City, Salt Lake County, and Utah.",
  path: "/contact",
});

const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

/** Phone and email: quiet text links (brief §1.1.6), each a 44px tap target. */
const otherWays = [
  { icon: "phone", title: "Call", body: "Talk with us directly.", Link: PhoneLink },
  { icon: "mail", title: "Email", body: "Write to us, and we will write back.", Link: EmailLink },
] as const;

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="Contact"
        title="Talk with ReplyLoop"
        intro="The easiest first step is a short intro call. You can also call or email."
        showButton={false}
        backdrop={<ServiceEmblem variant="loop" />}
      />
      <PageBody>
        {/*
          One booking card (brief §8.9): a light raised card with the one button, and phone and
          email beside it as text links. At lg the booking half takes cols 1-7 and the other ways
          cols 8-12 behind a hairline. No form, no address. The mobile bar is hidden on /contact.
        */}
        <Section labelledBy="ways-title" rhythm="tight">
          <h2 id="ways-title" className="sr-only">
            Ways to reach us
          </h2>
          <Card reveal={0} className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-12">
            <div className="lg:col-span-7">
              <Icon name="reply" className="size-6 text-brass" />
              <h3 className="mt-5 font-serif text-h3-lg font-medium">Book an intro call</h3>
              <p className="mt-3 max-w-measure text-slate">
                Pick a time that works for you. The scheduler opens in a new tab.
              </p>
              <div className="mt-6">
                <BookButton />
              </div>
            </div>
            <ul className="mt-8 grid gap-8 border-t border-rule pt-8 sm:grid-cols-2 lg:col-span-5 lg:mt-0 lg:grid-cols-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              {otherWays.map(({ icon, title, body, Link }) => (
                <li key={title} className="flex items-start gap-4">
                  <Icon name={icon} className="mt-1 size-5 shrink-0 text-brass" />
                  <div>
                    <h3 className="font-serif text-h3 font-medium">{title}</h3>
                    <p className="mt-3 text-slate">{body}</p>
                    <div className="mt-3 text-lede">
                      <Link withIcon={false} className="min-h-11" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          {/*
            Phone art sits under the booking card, not in the hero: this hero has no button, and a
            plate above the card would push the page's one booking button below the fold (§8.13).
          */}
          <div className="mt-12 lg:hidden">
            <HeroPlate variant="contact" />
          </div>
          <div className="mt-12 flex items-start gap-3 text-lede">
            <Icon name="pin" className="mt-1 size-5 shrink-0 text-brass" />
            <p>{site.areaServedSentence}</p>
          </div>
        </Section>
      </PageBody>
      <JsonLd data={graph(breadcrumbSchema(crumbs))} />
    </>
  );
}
