/**
 * Customer-facing translation of the seven Red Lines (approved 2026-11-14).
 * Do not weaken these to improve conversion.
 */
export type PromiseItem = { title: string; body: string };

export const promises: PromiseItem[] = [
  {
    title: "Only what you need",
    body: "We will not add a service you do not need. The intro call is to see what is actually missing.",
  },
  {
    title: "Recurring price for recurring work",
    body: "You pay on a recurring basis only for work that recurs. One-time work is priced one time.",
  },
  {
    title: "You keep the keys",
    body: "You can see the work and check the results.",
  },
  {
    title: "Every customer, asked the same way",
    body: "We ask every customer for a review the same way. We do not hide the unhappy ones.",
  },
  {
    title: "No reward for a review",
    body: "We never reward a review. No gift, discount, or favor for a star rating.",
  },
  {
    title: "Your voice first",
    body: "Nothing goes out in your name until we have learned your voice and done a dry run.",
  },
  {
    title: "Private stays private",
    body: "A public reply never confirms someone is a patient, and never mentions care.",
  },
];

/** One-line trust cue for above the fold. */
export const trustCue = "You keep the keys. We ask every customer the same way.";
