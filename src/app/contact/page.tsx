import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { BookButton, EmailLink, PhoneLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
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

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="Contact"
        title="Talk with ReplyLoop"
        intro="The easiest first step is a short intro call. You can also call or email."
        showButton={false}
      />
      <PageBody>
        <Section labelledBy="ways-title" rhythm="tight">
          <h2 id="ways-title" className="sr-only">
            Ways to reach us
          </h2>
          <ul className="grid gap-6 md:grid-cols-3">
            <Card as="li" reveal={0} className="flex flex-col">
              <Icon name="reply" className="size-6 text-brass" />
              <h3 className="mt-5 font-serif text-h3-lg font-medium">Book an intro call</h3>
              <p className="mt-3 text-slate">Pick a time that works for you. The scheduler opens in a new tab.</p>
              <div className="mt-auto pt-6">
                <BookButton />
              </div>
            </Card>
            <Card as="li" reveal={1} className="flex flex-col">
              <Icon name="phone" className="size-6 text-brass" />
              <h3 className="mt-5 font-serif text-h3-lg font-medium">Call</h3>
              <p className="mt-3 text-slate">Talk with us directly.</p>
              <div className="mt-auto pt-6 text-lede">
                <PhoneLink withIcon={false} />
              </div>
            </Card>
            <Card as="li" reveal={2} className="flex flex-col">
              <Icon name="mail" className="size-6 text-brass" />
              <h3 className="mt-5 font-serif text-h3-lg font-medium">Email</h3>
              <p className="mt-3 text-slate">Write to us, and we will write back.</p>
              <div className="mt-auto pt-6 text-lede">
                <EmailLink withIcon={false} />
              </div>
            </Card>
          </ul>
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
