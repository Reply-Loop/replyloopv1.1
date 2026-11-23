/**
 * JSON-LD builders. Rules from the brief:
 * - ProfessionalService: name, telephone, email, areaServed. No streetAddress,
 *   no geo coordinates, no rating, no price.
 * - No aggregateRating or review markup: there are no approved reviews to mark up.
 */
import { absoluteUrl } from "./seo";
import { site } from "./site";

const orgId = `${site.url}/#organization`;
const websiteId = `${site.url}/#website`;
const serviceId = `${site.url}/#professional-service`;

const areaServed = [
  { "@type": "City", name: "Murray", containedInPlace: { "@type": "State", name: "Utah" } },
  { "@type": "City", name: "Salt Lake City", containedInPlace: { "@type": "State", name: "Utah" } },
  { "@type": "AdministrativeArea", name: "Salt Lake County", containedInPlace: { "@type": "State", name: "Utah" } },
  { "@type": "State", name: "Utah" },
];

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": orgId,
    name: site.name,
    url: site.url,
    slogan: site.tagline,
    email: site.email.display,
    telephone: site.phone.e164,
    logo: absoluteUrl("/icon.svg"),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phone.e164,
      email: site.email.display,
      contactType: "sales",
      areaServed: "US-UT",
      availableLanguage: "English",
    },
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: site.url,
    name: site.name,
    publisher: { "@id": orgId },
    inLanguage: "en-US",
  };
}

export function professionalServiceSchema() {
  return {
    "@type": "ProfessionalService",
    "@id": serviceId,
    name: site.name,
    url: site.url,
    description: site.description,
    telephone: site.phone.e164,
    email: site.email.display,
    areaServed,
    parentOrganization: { "@id": orgId },
  };
}

export function serviceSchema({
  name,
  description,
  path,
  serviceType,
}: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name,
    description,
    serviceType,
    url: absoluteUrl(path),
    provider: { "@id": serviceId },
    areaServed,
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function faqPageSchema(items: { question: string; answer: string }[], path: string) {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer.replace(/\n{2,}/g, " ") },
    })),
  };
}

export function blogPostingSchema(post: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(post.path)}#article`,
    headline: post.title,
    description: post.description,
    url: absoluteUrl(post.path),
    mainEntityOfPage: absoluteUrl(post.path),
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    author: { "@id": orgId },
    publisher: { "@id": orgId },
    inLanguage: "en-US",
  };
}

/** Wrap one or more nodes in a single @graph document. */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
