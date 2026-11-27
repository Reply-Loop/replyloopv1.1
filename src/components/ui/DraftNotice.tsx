/** Required label on legal drafts until an attorney reviews them. */
export function DraftNotice() {
  return (
    <p
      role="note"
      className="tone-light mb-8 rounded-md border-2 border-dashed border-brass/70 bg-ivory px-5 py-4 font-semibold text-charcoal"
    >
      Draft. Needs attorney review.
    </p>
  );
}
