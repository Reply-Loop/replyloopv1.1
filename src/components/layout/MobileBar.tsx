import { site } from "@/lib/site";
import { BookButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** Sticky bottom bar on small screens: Call and Book. Same button label. */
export function MobileBar() {
  return (
    <div className="tone-dark fixed inset-x-0 bottom-0 z-40 border-t border-brass-line/40 bg-charcoal px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="mx-auto flex max-w-md items-center gap-3">
        <a
          href={site.phone.href}
          data-track="phone_click"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-mist/50 px-5 font-semibold text-ivory"
        >
          <Icon name="phone" className="size-4" />
          <span>Call</span>
          <span className="sr-only"> {site.phone.display}</span>
        </a>
        <BookButton className="flex-1 px-4" />
      </div>
    </div>
  );
}
