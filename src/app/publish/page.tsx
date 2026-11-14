import Image from "next/image";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const publishSteps = [
  "Submit your manuscript and metadata",
  "Review editorial and format standards",
  "Approve release configuration and pricing",
  "Launch to readers and monitor performance",
];

export default function PublishPage() {
  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#302e29]">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        <section className="grid gap-8 border-b border-[#e6e2da] pb-10 pt-4 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#77736c]">Publish</p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-normal tracking-tight text-[#302e29] sm:text-5xl">Your publishing process, simplified.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#706c64]">
              Publish with clarity and confidence. KDPlus supports authors and publishers with a guided process designed for speed and visibility.
            </p>
          </div>
          <figure className="relative min-h-[240px] overflow-hidden bg-[#e6e2da] sm:min-h-[320px]">
            <Image
              src="/images/publish-author-at-work.jpg"
              alt="A fountain pen writing on a manuscript page"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover saturate-75"
            />
          </figure>
        </section>

        <section className="grid gap-12 py-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#77736c]">The process</p>
            <h2 className="mt-3 font-serif text-3xl font-normal text-[#302e29]">How publishing works</h2>
            <p className="mt-4 max-w-2xl leading-7 text-[#706c64]">
              Our process combines editorial guidance, account support, and financial visibility so that each release is organized and ready for readers.
            </p>

            <ol className="mt-8 border-t border-[#e6e2da]">
              {publishSteps.map((step, index) => (
                <li key={step} className="grid grid-cols-[3rem_1fr] gap-3 border-b border-[#e6e2da] py-5">
                  <span className="font-serif text-xl text-[#77736c]">{String(index + 1).padStart(2, "0")}</span>
                  <p className="pt-1 text-[#514e47]">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-t border-[#e6e2da] pt-6">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#77736c]">What we offer</p>
            <h2 className="mt-3 font-serif text-3xl font-normal text-[#302e29]">Publishing services</h2>
            <ul className="mt-6 divide-y divide-[#e6e2da] border-t border-[#e6e2da] text-[#514e47]">
              <li className="py-4">Manuscript preparation and distribution support</li>
              <li className="py-4">Royalty and payment visibility</li>
              <li className="py-4">Metadata and catalog readiness</li>
              <li className="py-4">Reader-facing launch planning</li>
              <li className="py-4">Account and publishing reporting</li>
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
