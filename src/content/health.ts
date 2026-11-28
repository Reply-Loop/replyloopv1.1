/**
 * Health and privacy handling. Plain words only.
 * No legal claims, no regulation names, no citations.
 */
export const healthHandling = {
  title: "How we handle reviews for health businesses",
  intro:
    "This applies to home care and to clinics where the person leaving a review may be a patient or a patient's family.",
  points: [
    "A public reply uses general thanks and public facts you gave us.",
    "It does not confirm the reviewer was a patient or client, even if the reviewer said so.",
    "It does not mention a visit, appointment, diagnosis, treatment, staff interaction, billing, or insurance.",
    "Hard conversations move off the public page. The reply says “please call the office,” not a care detail.",
    "A reply to a review of 3 stars or lower stays unpublished until you have seen it.",
    "You seeing a reply is not permission to share anything private.",
  ],
  example: {
    label: "Example, not a client.",
    text: "Thank you for taking the time to write this. It means a lot to us. If there is anything you would like to talk through, please call the office.",
  },
} as const;
