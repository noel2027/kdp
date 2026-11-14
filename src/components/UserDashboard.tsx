import type { Profile, Transaction } from "@/lib/mock-db";
import { SignOutButton } from "@/components/SignOutButton";

type UserDashboardProps = {
  profile: Profile;
  transactions: Transaction[];
};

function currency(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function transactionDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function UserDashboard({ profile, transactions }: UserDashboardProps) {
  return (
    <div className="luxury-ui space-y-0">
      <section className="flex flex-col justify-between gap-5 py-5 sm:flex-row sm:items-end sm:gap-6 sm:py-7">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#9a805d]">Author workspace</p>
          <h1 className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#302e29] sm:mt-4 sm:text-5xl">
            Welcome back, {profile.first_name}.
          </h1>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
          <div className="border-l border-[#d8d1c3] pl-4 text-sm sm:text-right">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8e8a82]">Account reference</p>
            <p className="mt-2 font-medium tracking-wide text-[#4c4942]">{profile.account_id}</p>
          </div>
          <SignOutButton />
        </div>
      </section>

      <section className="grid gap-4 border-y border-[#e6e2da] py-5 sm:grid-cols-2 sm:gap-6 sm:py-7 lg:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#8e8a82]">First name</p>
          <p className="mt-2 break-words text-sm text-[#4c4942]">{profile.first_name}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#8e8a82]">Last name</p>
          <p className="mt-2 break-words text-sm text-[#4c4942]">{profile.last_name}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#8e8a82]">Email</p>
          <p className="mt-2 break-words text-sm text-[#4c4942]">{profile.email}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#8e8a82]">Phone number</p>
          <p className="mt-2 break-words text-sm text-[#4c4942]">{profile.phone || "Not provided"}</p>
        </div>
        <div className="lg:col-span-2">
          <p className="text-xs uppercase tracking-[0.18em] text-[#8e8a82]">Address</p>
          <p className="mt-2 whitespace-pre-line break-words text-sm text-[#4c4942]">{profile.address || "Not provided"}</p>
        </div>
      </section>

      <section className="border-y border-[#e6e2da] py-5 sm:py-7">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#8e8a82]">Available balance</p>
          <p className="mt-3 font-serif text-3xl text-[#302e29]">{currency(profile.balance)}</p>
        </div>
      </section>

      <section className="py-7 sm:py-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#9a805d]">Account activity</p>
            <h2 className="mt-2 font-serif text-2xl font-normal text-[#302e29]">Transaction history</h2>
          </div>
          <p className="text-xs text-[#8e8a82]">{transactions.length} records</p>
        </div>

        <div className="max-w-full overflow-x-auto overscroll-x-contain border-y border-[#e6e2da] touch-pan-x">
          <table className="min-w-[620px] text-left sm:min-w-full">
            <thead className="bg-[#f1f0eb]">
              <tr>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#77736c] sm:px-4">Reference</th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#77736c] sm:px-4">Transaction</th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#77736c] sm:px-4">Type</th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#77736c] sm:px-4">Amount</th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#77736c] sm:px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeece6] bg-white">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-3 py-4 text-sm text-[#4c4942] sm:px-4">{transaction.reference}</td>
                  <td className="min-w-40 max-w-sm whitespace-normal px-3 py-4 text-sm leading-6 text-[#77736c] sm:min-w-56 sm:px-4">
                    {transaction.description || "—"}
                  </td>
                  <td className="px-3 py-4 text-sm text-[#77736c] sm:px-4">{transaction.type}</td>
                  <td className="px-3 py-4 text-sm font-medium text-[#302e29] sm:px-4">
                    {transaction.amount >= 0 ? "+" : "-"}{currency(Math.abs(transaction.amount))}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-[#77736c] sm:px-4">{transactionDate(transaction.transaction_date)}</td>
                </tr>
              ))}
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#8e8a82]">No transactions recorded yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
