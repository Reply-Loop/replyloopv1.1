import type { Metadata } from "next";
import { ServicePageView, servicePageMetadata } from "@/components/templates/ServicePageView";
import { getServicePage } from "@/content/servicePages";

const page = getServicePage("review-replies")!;

export const metadata: Metadata = servicePageMetadata(page);

export default function Page() {
  return <ServicePageView page={page} />;
}
