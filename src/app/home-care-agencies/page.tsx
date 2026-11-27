import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";
import { FAQ } from "@/components/ui/FAQ";
import { HealthHandling } from "@/components/ui/HealthHandling";
import { Icon } from "@/components/ui/Icon";
import { LoopDivider } from "@/components/ui/LoopDivider";
import { PageHero } from "@/components/ui/PageHero";
import { RibbonBackdrop } from "@/components/scenes/RibbonBackdrop";
import { PillarCard } from "@/components/ui/PillarCard";
import { PromiseList } from "@/components/ui/PromiseList";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StepList } from "@/components/ui/StepList";
import { faqs } from "@/content/faq";
import { allPostMeta } from "@/content/posts";
import { bundlePillars } from "@/content/services";
import { breadcrumbSchema, graph, serviceSchema, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

// Primary keyword: home care agency SEO Utah. Audience: owners and administrators.
const path = "/home-care-agencies";

export const metadata: Metadata = pageMetadata({
  title: "Home Care Agency SEO in Utah | Review Replies | ReplyLoop",
  absoluteTitle: true,
  description:
    "Home care agency SEO in Utah, built on your Google reviews: replies in your voice, an active Google profile, and nothing private in public.",
  path,
});

const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Home care agencies", path },
];

const cities = [
  "Salt Lake City",
  "Murray",
  "South Salt Lake",
  "Millcreek",
  "Holladay",
  "Cottonwood Heights",
  "Midvale",
  "Sandy",
  "Draper",
  "West Valley City",
  "South Jordan",
];

const steps = [
  { title: "Intro call", body: "A short call with the owner or administrator to see what is actually missing." },
  { title: "Voice interview", body: "We learn how your agency talks about its work, and we audit your online presence once." },
  { title: "Dry run", body: "A practice round you read first. Nothing goes out in your agency's name before this." },
  { title: "Go live, in the open", body: "Replies and monthly posts begin. You can see the work, and you approve each month's posts." },
];

const homeCareFaqs = faqs.filter((f) =>
  [
    "How do you handle reviews for a home care agency or clinic?",
    "What happens with a review of 3 stars or lower?",
    "Do you ask only happy customers for reviews?",
    "What do you need from me to start?",
    "Where do you work?",
  ].includes(f.question),
);

export default function HomeCarePage() {
  return (
    <>
      <PageHero
        backdrop={<RibbonBackdrop />}
        crumbs={crumbs}
        eyebrow="For home care owners and administrators"
        eyebrowShort="For home care owners"
        title="Home care agency SEO and review replies in Utah"
        intro={
          <>
            <p>
              Many families choosing home care look you up on Google before they call. We help your agency answer every review
              in your voice, keep your Google profile active, and make the next step plain.
            </p>
            <p>And we never put anything private in public.</p>
          </>
        }
      />

      <Section labelledBy="trust-title">
        <SectionHeading
          id="trust-title"
          eyebrow="Trust"
          title="In home care, reviews carry more weight"
          intro={
            <>
              <p>
                A family is choosing who comes into a parent&apos;s home. Honest reviews, answered with care, are some of
                the few things they can check before they pick up the phone.
              </p>
              <p>
                When a kind review sits unanswered, the thank you is left hanging. When every review gets a reply, the
                family sees an owner who pays attention. Faithful in small things, every time.
              </p>
            </>
          }
        />
      </Section>

      {/* ivory-2 band with the dark example card (brief §8.6, §8.3.7). Dark bands here: steps and the CTA band, plus the footer. */}
      <Section tone="ivory-2" labelledBy="health-handling">
        <HealthHandling eyebrow="Review sensitivity" />
      </Section>

      <Section labelledBy="visibility-title">
        <SectionHeading
          id="visibility-title"
          variant="split"
          eyebrow="Local visibility"
          title="What we do for your agency each month"
          intro="Local SEO for home care agencies starts with your Google Business Profile, your listing on Google Search and Maps."
        />
        {/* Light cards: this band is ivory. PillarCard goes tone="dark" only on charcoal. */}
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {bundlePillars.map((pillar) => (
            <PillarCard key={pillar.title} pillar={pillar} />
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-slate">
          Also available as one-time projects:{" "}
          <Link href="/services/websites" className="text-charcoal underline decoration-brass underline-offset-4">
            a website for your agency
          </Link>{" "}
          and{" "}
          <Link href="/services/owner-qa-videos" className="text-charcoal underline decoration-brass underline-offset-4">
            owner Q&amp;A videos
          </Link>
          .
        </p>
      </Section>

      <LoopDivider />

      <Section labelledBy="area-title">
        <SectionHeading
          id="area-title"
          eyebrow="Where we work"
          title="Home care agencies across Salt Lake County and Utah"
          intro="We are based in Salt Lake County. We work with home care agencies in these cities and across Utah:"
        />
        <ul className="mt-12 flex max-w-4xl flex-wrap gap-3">
          {cities.map((c) => (
            <li key={c} className="flex items-center gap-2 rounded-full border border-rule px-4 py-2">
              <Icon name="pin" className="size-4 text-brass" />
              {c}
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="charcoal" labelledBy="steps-title">
        <SectionHeading id="steps-title" eyebrow="How it works" title="Four steps, and nothing goes out early" />
        <StepList steps={steps} className="mt-12" />
      </Section>

      <Section labelledBy="promises-title">
        <SectionHeading id="promises-title" variant="statement" eyebrow="What we will not bend" title="Seven promises we keep" />
        <PromiseList className="mt-12" />
      </Section>

      <Section labelledBy="hc-faq-title" rhythm="tight" className="pt-0 sm:pt-0 lg:pt-0">
        <SectionHeading id="hc-faq-title" variant="compact" eyebrow="Questions" title="Questions home care owners ask" />
        <FAQ items={homeCareFaqs} className="mt-12" />
      </Section>

      <Section labelledBy="reading-title" rhythm="tight" className="pt-0 sm:pt-0 lg:pt-0">
        <SectionHeading id="reading-title" variant="compact" eyebrow="Reading" title="Guides for home care owners" />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {allPostMeta.map((p) => (
            <Card as="li" key={p.slug} className="flex flex-col">
              <h3 className="font-serif text-h3 font-medium">
                <Link
                  href={`/blog/${p.slug}`}
                  className="underline decoration-brass decoration-1 underline-offset-4 hover:decoration-2"
                >
                  {p.title}
                </Link>
              </h3>
              <p className="mt-3 text-slate">{p.description}</p>
            </Card>
          ))}
        </ul>
      </Section>

      <JsonLd
        data={graph(
          serviceSchema({
            name: "Home care agency SEO and review replies",
            description:
              "Google review replies, Google Business Profile care, and monthly social content for home care agencies in Utah.",
            path,
            serviceType: "Local SEO and review management for home care agencies",
          }),
          breadcrumbSchema(crumbs),
        )}
      />
    </>
  );
}
