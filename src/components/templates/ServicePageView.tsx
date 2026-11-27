import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { TextLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FAQ } from "@/components/ui/FAQ";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceEmblem } from "@/components/scenes/ServiceEmblem";
import { TrustLoop } from "@/components/scenes/TrustLoop";
import { ProofSlot } from "@/components/ui/ProofSlot";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ServicePage } from "@/content/servicePages";
import { servicePages } from "@/content/servicePages";
import { breadcrumbSchema, graph, serviceSchema, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export function servicePageMetadata(page: ServicePage) {
  return pageMetadata({
    title: page.metaTitle,
    absoluteTitle: true,
    description: page.metaDescription,
    path: `/services/${page.slug}`,
  });
}

export function ServicePageView({ page }: { page: ServicePage }) {
  const path = `/services/${page.slug}`;
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: page.name, path },
  ];
  const others = servicePages.filter((p) => p.slug !== page.slug);

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow={page.eyebrow}
        title={page.h1}
        intro={page.intro}
        backdrop={<ServiceEmblem icon={page.icon} />}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-16">
            {page.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="font-serif text-h2-compact font-medium">{s.heading}</h2>
                {s.paragraphs?.map((p) => (
                  <p key={p} className="mt-4 max-w-measure text-slate">
                    {p}
                  </p>
                ))}
                {s.bullets ? (
                  <ul className="mt-5 max-w-measure space-y-3">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <Icon
                          name={s.negative ? "close" : "check"}
                          className={s.negative ? "mt-1 size-5 shrink-0 text-slate" : "mt-1 size-5 shrink-0 text-brass"}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
            {page.slug === "review-replies" ? (
              <section aria-labelledby="trust-loop-title">
                <h2 id="trust-loop-title" className="font-serif text-h2-compact font-medium">
                  How the loop works
                </h2>
                <TrustLoop className="mt-6" />
              </section>
            ) : null}
            {page.proof ? <ProofSlot kind={page.proof.kind} label={page.proof.label} path={page.proof.path} /> : null}
          </div>

          <aside aria-label="Related" className="space-y-6">
            <Card>
              <p className="text-eyebrow font-semibold uppercase tracking-[0.08em] text-brass sm:tracking-[0.14em]">
                {page.kind === "monthly" ? "Part of the monthly work" : "One-time project"}
              </p>
              <p className="mt-3 text-slate">
                {page.kind === "monthly"
                  ? "Included in the monthly bundle with review replies, social content, and your growth workbook."
                  : "Separate from the monthly work. One-time work is priced one time."}
              </p>
            </Card>
            <Card>
              <p className="font-serif text-h3 font-medium">Running a home care agency?</p>
              <p className="mt-2 text-slate">See how we handle reviews and local search for Utah home care.</p>
              <div className="mt-4">
                <TextLink href="/home-care-agencies">Home care agencies</TextLink>
              </div>
            </Card>
            <Card>
              <p className="text-eyebrow font-semibold uppercase tracking-[0.08em] text-brass sm:tracking-[0.14em]">Related reading</p>
              <Link
                href={`/blog/${page.relatedPost.slug}`}
                className="mt-3 block font-serif text-h3 font-medium underline decoration-brass decoration-1 underline-offset-4 hover:decoration-2"
              >
                {page.relatedPost.title}
              </Link>
            </Card>
          </aside>
        </div>
      </Section>

      <Section labelledBy="service-faq-title" rhythm="tight" className="pt-0 sm:pt-0 lg:pt-0">
        <SectionHeading variant="compact" id="service-faq-title" eyebrow="Questions" title={`Questions about ${page.name.toLowerCase()}`} />
        <FAQ items={page.faqs} className="mt-12" />
      </Section>

      <Section tone="charcoal" labelledBy="other-services-title">
        <SectionHeading variant="compact" id="other-services-title" eyebrow="Services" title="Other services" />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {others.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/services/${p.slug}`}
                className="tone-light flex items-center justify-between gap-4 rounded-2xl bg-ivory px-6 py-5 text-charcoal transition-colors hover:bg-rule"
              >
                <span className="flex items-center gap-3 font-serif text-h3 font-medium">
                  <Icon name={p.icon} className="size-5 text-brass" />
                  {p.name}
                </span>
                <Icon name="arrow" className="size-4 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <JsonLd
        data={graph(
          serviceSchema({ name: page.name, description: page.metaDescription, path, serviceType: page.serviceType }),
          breadcrumbSchema(crumbs),
        )}
      />
    </>
  );
}
