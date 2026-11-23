import { promises } from "@/content/promises";
import { bundlePillars } from "@/content/services";
import { site } from "@/lib/site";

/**
 * llms.txt: a plain description of ReplyLoop for language-model crawlers.
 * Same voice and same bans as the site: no prices, no scripture, no legal claims.
 */
export function GET() {
  const body = `# ${site.name}

> ${site.tagline} ${site.description}

ReplyLoop works with home care agencies first, and with dental offices, therapy practices, and clinics. We are based in Salt Lake County and serve Murray, Salt Lake City, and businesses across Utah.

## What we do

${bundlePillars.map((p) => `- ${p.title}: ${p.what}`).join("\n")}
- Also available as one-time projects: websites, and owner Q&A videos (scripting and filming).

Setup includes a voice interview, a one-time audit of your online presence, and replies to the Google reviews already waiting.

## How it works

1. Intro call: a short call to see what is actually missing.
2. Voice interview: we learn how the owner talks about their work.
3. Dry run: a practice round the owner reads first.
4. Go live: replies and monthly posts begin, and the owner can see all of it.

## Promises

${promises.map((p, i) => `${i + 1}. ${p.title}. ${p.body}`).join("\n")}

## Reviews for health businesses

A public reply never confirms the reviewer was a patient or client, and never mentions a visit, appointment, diagnosis, treatment, staff interaction, billing, or insurance. Hard conversations move off the public page. A reply to a review of 3 stars or lower stays unpublished until the owner has seen it.

## Pages

- [Home](${site.url}/)
- [Services](${site.url}/services)
- [Home care agencies](${site.url}/home-care-agencies)
- [FAQ](${site.url}/faq)
- [About](${site.url}/about)
- [Contact](${site.url}/contact)

## Contact

- Book an intro call: ${site.booking.href}
- Phone: ${site.phone.display}
- Email: ${site.email.display}

${site.notAffiliated}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
