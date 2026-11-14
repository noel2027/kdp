import Image from "next/image";
import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const services = [
  {
    number: "01",
    title: "Publishing, thoughtfully managed",
    description: "A clear workflow for preparing, organizing, and tracking every title in your catalog.",
  },
  {
    number: "02",
    title: "Earnings with context",
    description: "Keep account balances and transaction history together, with the details that explain each change.",
  },
  {
    number: "03",
    title: "One considered workspace",
    description: "A calm, organized view for authors and the teams supporting their publishing work.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#2e2c27]">
      <SiteHeader />

      <main>
        <section className="mx-auto grid max-w-7xl gap-14 px-6 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#9a805d]">Self-publish print and digital books, and reach millions of readers around the world on Amazon.</p>
            <h1 className="mt-7 font-serif text-5xl font-normal leading-[1.08] tracking-tight text-[#302e29] sm:text-6xl lg:text-7xl">
              Welcome to Kindle Direct Publishing.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#6e6b64]">
              KDP provides you with free and simple tools to self-publish your book in more than 10 countries in over 45 languages.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/publish"
                className="inline-flex items-center gap-3 border-b border-[#9a805d] pb-2 text-sm font-medium text-[#383630] transition hover:border-[#554a38]"
              >
                Explore publishing <span aria-hidden="true">→</span>
              </Link>
              <Link href="/earn" className="text-sm text-[#6e6b64] transition hover:text-[#302e29]">
                Understand earnings
              </Link>
            </div>
          </div>

          <figure className="relative min-h-[300px] overflow-hidden bg-[#e6e2da] sm:min-h-[380px] lg:mb-2 lg:ml-8 lg:min-h-[430px]">
            <Image
              src="/images/about-publishing.jpg"
              alt="Rows of books in a quiet library"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover saturate-75"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-6 pb-6 pt-20 text-white">
              <p className="text-xs font-medium uppercase tracking-[0.24em]">The publishing overview</p>
              <p className="mt-2 max-w-sm font-serif text-2xl">Books and account activity, brought into focus.</p>
            </figcaption>
          </figure>
        </section>

        <section className="border-y border-[#e7e4dc] bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
            <div className="mb-12 max-w-xl">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#9a805d]">What we offer</p>
              <h2 className="mt-5 font-serif text-3xl font-normal leading-tight text-[#302e29] sm:text-4xl">
                Be your own publisher
                KDP gives you control over your book's content, design, price, audience, and advertising.
              </h2>
            </div>
            <div className="grid gap-10 md:grid-cols-3 md:divide-x md:divide-[#e7e4dc]">
              {services.map((service, index) => (
                <article key={service.number} className={index === 0 ? "md:pr-8" : "md:px-8"}>
                  <p className="text-xs tracking-[0.2em] text-[#9a805d]">{service.number}</p>
                  <h3 className="mt-5 font-serif text-2xl font-normal leading-snug text-[#302e29]">{service.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#77736c]">{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-12 lg:py-24">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#9a805d]">Kindle Direct Publishing</p>
            <h2 className="mt-5 max-w-lg font-serif text-3xl font-normal leading-tight text-[#302e29] sm:text-4xl">
              Less clutter. More clarity for the work that matters.
            </h2>
          </div>
          <div className="border-l border-[#d8d1c3] pl-6 sm:pl-10">
            <p className="max-w-2xl text-base leading-8 text-[#6e6b64]">
              From a title’s status to the record behind an account balance, KDPlus keeps essential publishing information organized and easy to review.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#55524b]">
              <span>Publishing workflows</span>
              <span>Account oversight</span>
              <span>Transaction history</span>
            </div>
            <Link
              href="/help"
              className="mt-9 inline-flex items-center gap-3 border-b border-[#9a805d] pb-2 text-sm font-medium text-[#383630] transition hover:border-[#554a38]"
            >
              Visit the help center <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
