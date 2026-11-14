import Image from "next/image";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const earningSteps = [
  "Earn credits through approved account activity",
  "Track activity in your account ledger",
  "Monitor royalty statements and balance updates",
  "Review historical transactions before payout processing",
];

export default function EarnPage() {
  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#302e29]">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
        <section className="grid gap-6 border-b border-[#e6e2da] pb-8 pt-2 sm:gap-8 sm:pb-10 sm:pt-4 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#77736c]">Earn</p>
            <h1 className="mt-4 max-w-3xl font-serif text-3xl font-normal tracking-tight text-[#302e29] sm:text-5xl">Track your earnings with clarity.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#706c64] sm:mt-5 sm:text-base sm:leading-7">
              KDPlus gives authors and publishers a transparent view of credit activity, balances, and transaction records tied to each account.
            </p>
          </div>
          <figure className="relative min-h-[200px] overflow-hidden bg-[#e6e2da] sm:min-h-[320px]">
            <Image
              src="/images/earnings-records.jpg"
              alt="A person reviewing financial forms with a calculator"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover saturate-75"
            />
          </figure>
        </section>

        <section className="grid gap-10 py-10 sm:gap-12 sm:py-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#77736c]">The process</p>
            <h2 className="mt-3 font-serif text-2xl font-normal text-[#302e29] sm:text-3xl">How the earning system works</h2>
            <ol className="mt-8 border-t border-[#e6e2da]">
              {earningSteps.map((step, index) => (
                <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-[#e6e2da] py-4 sm:grid-cols-[3rem_1fr] sm:gap-3 sm:py-5">
                  <span className="font-serif text-xl text-[#77736c]">{String(index + 1).padStart(2, "0")}</span>
                  <p className="pt-1 text-[#514e47]">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-t border-[#e6e2da] pt-5 sm:pt-6">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#77736c]">Account details</p>
            <h2 className="mt-3 font-serif text-2xl font-normal text-[#302e29] sm:text-3xl">Balance and transactions</h2>
            <ul className="mt-6 divide-y divide-[#e6e2da] border-t border-[#e6e2da] text-[#514e47]">
              <li className="py-3 text-sm leading-6 sm:py-4 sm:text-base">Credits and adjustments are recorded in the account ledger.</li>
              <li className="py-3 text-sm leading-6 sm:py-4 sm:text-base">Transaction records show the reference, amount, and date.</li>
              <li className="py-3 text-sm leading-6 sm:py-4 sm:text-base">View balance updates alongside your transaction history.</li>
              <li className="py-3 text-sm leading-6 sm:py-4 sm:text-base">Account status determines access to the dashboard.</li>
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
