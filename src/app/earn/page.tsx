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

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        <section className="grid gap-8 border-b border-[#e6e2da] pb-10 pt-4 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#77736c]">Earn</p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-normal tracking-tight text-[#302e29] sm:text-5xl">Track your earnings with clarity.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#706c64]">
              KDPlus gives authors and publishers a transparent view of credit activity, balances, and transaction records tied to each account.
            </p>
          </div>
          <figure className="relative min-h-[240px] overflow-hidden bg-[#e6e2da] sm:min-h-[320px]">
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

        <section className="grid gap-12 py-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#77736c]">The process</p>
            <h2 className="mt-3 font-serif text-3xl font-normal text-[#302e29]">How the earning system works</h2>
            <ol className="mt-8 border-t border-[#e6e2da]">
              {earningSteps.map((step, index) => (
                <li key={step} className="grid grid-cols-[3rem_1fr] gap-3 border-b border-[#e6e2da] py-5">
                  <span className="font-serif text-xl text-[#77736c]">{String(index + 1).padStart(2, "0")}</span>
                  <p className="pt-1 text-[#514e47]">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-t border-[#e6e2da] pt-6">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#77736c]">Account details</p>
            <h2 className="mt-3 font-serif text-3xl font-normal text-[#302e29]">Balance and transactions</h2>
            <ul className="mt-6 divide-y divide-[#e6e2da] border-t border-[#e6e2da] text-[#514e47]">
              <li className="py-4">Credits and adjustments are recorded in the account ledger.</li>
              <li className="py-4">Transaction records show the reference, amount, and date.</li>
              <li className="py-4">View balance updates alongside your transaction history.</li>
              <li className="py-4">Account status determines access to the dashboard.</li>
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
