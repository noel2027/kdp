"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { Profile, Transaction } from "@/lib/mock-db";
import { SignOutButton } from "@/components/SignOutButton";

type AdminTransaction = Transaction & {
  user_email: string;
};

type AdminDashboardProps = {
  profiles: Profile[];
  transactions: AdminTransaction[];
};

type SaveResult = {
  message?: string;
  mode?: "demo" | "supabase";
  error?: string;
};

async function postAdminData(path: string, values: object): Promise<SaveResult> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  const payload = (await response.json()) as SaveResult;

  if (!response.ok) {
    throw new Error(payload.error ?? "Unable to save this record.");
  }

  return payload;
}

function Feedback({ error, message, isDemo }: { error: string; message: string; isDemo: boolean }) {
  if (error) {
    return <div className="mt-4 border-l-2 border-red-300 bg-[#f7f0ed] px-3 py-2 text-sm text-[#8a5148]">{error}</div>;
  }

  if (message) {
    return (
      <div
        className={
          isDemo
            ? "mt-4 border-l-2 border-[#b9aa91] bg-[#f2f0eb] px-3 py-2 text-sm text-[#625b50]"
            : "mt-4 border-l-2 border-[#a5b19f] bg-[#f1f4ef] px-3 py-2 text-sm text-[#53644f]"
        }
      >
        {message}
      </div>
    );
  }

  return null;
}

function money(value: number) {
  return `$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function AdminDashboard({ profiles, transactions }: AdminDashboardProps) {
  const router = useRouter();
  const users = profiles.filter((profile) => profile.role === "User");
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [transactionForm, setTransactionForm] = useState({
    profileId: "",
    reference: "",
    type: "Credit" as Transaction["type"],
    amount: "",
    transactionDate: new Date().toISOString().slice(0, 10),
    description: "",
  });
  const [userMessage, setUserMessage] = useState("");
  const [userError, setUserError] = useState("");
  const [userIsDemo, setUserIsDemo] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState("");
  const [transactionError, setTransactionError] = useState("");
  const [transactionIsDemo, setTransactionIsDemo] = useState(false);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isSavingTransaction, setIsSavingTransaction] = useState(false);

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUserMessage("");
    setUserError("");
    setIsSavingUser(true);

    try {
      const result = await postAdminData("/api/admin/users", userForm);
      setUserMessage(result.message ?? "Account request completed.");
      setUserIsDemo(result.mode === "demo");
      setUserForm({ firstName: "", lastName: "", email: "", phone: "", address: "" });
      router.refresh();
    } catch (error) {
      setUserError(error instanceof Error ? error.message : "Unable to create the user account.");
    } finally {
      setIsSavingUser(false);
    }
  }

  async function handleCreateTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTransactionMessage("");
    setTransactionError("");
    setIsSavingTransaction(true);

    try {
      const result = await postAdminData("/api/admin/transactions", transactionForm);
      setTransactionMessage(result.message ?? "Transaction request completed.");
      setTransactionIsDemo(result.mode === "demo");
      setTransactionForm((current) => ({ ...current, reference: "", amount: "", description: "" }));
      router.refresh();
    } catch (error) {
      setTransactionError(error instanceof Error ? error.message : "Unable to create the transaction.");
    } finally {
      setIsSavingTransaction(false);
    }
  }

  return (
    <div className="luxury-ui space-y-0">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-8 border-l-2 border-[#b9aa91] bg-[#f2f0eb] px-4 py-3 text-sm leading-6 text-[#625b50]">
          kindle direct publishing
        </div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#9a805d]">Workspace</p>
            <h1 className="mt-3 font-serif text-4xl font-normal tracking-tight text-[#302e29]"></h1>
          </div>
          <div className="flex items-center gap-3">
            <SignOutButton />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Name</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Email</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Role</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {profile.first_name} {profile.last_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{profile.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{profile.role}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={
                          profile.status === "Active"
                              ? "px-2.5 py-1 text-[#596b55]"
                              : "px-2.5 py-1 text-[#85765f]"
                        }
                      >
                        {profile.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form onSubmit={handleCreateUser} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="mb-5 font-serif text-2xl font-normal text-[#302e29]">Add new user</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-slate-700">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  required
                  maxLength={100}
                  value={userForm.firstName}
                  onChange={(event) => setUserForm((current) => ({ ...current, firstName: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-700 outline-none focus:border-[#9a805d]"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-slate-700">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  required
                  maxLength={100}
                  value={userForm.lastName}
                  onChange={(event) => setUserForm((current) => ({ ...current, lastName: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-700 outline-none focus:border-[#9a805d]"
                  placeholder="Last Name"
                />
              </div>
              <div>
                <label htmlFor="newUserEmail" className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
                <input
                  id="newUserEmail"
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(event) => setUserForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-700 outline-none focus:border-[#9a805d]"
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label htmlFor="newUserPhone" className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
                <input
                  id="newUserPhone"
                  type="tel"
                  required
                  maxLength={50}
                  value={userForm.phone}
                  onChange={(event) => setUserForm((current) => ({ ...current, phone: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-700 outline-none focus:border-[#9a805d]"
                  placeholder="Phone number"
                />
              </div>
              <div>
                <label htmlFor="newUserAddress" className="mb-2 block text-sm font-medium text-slate-700">Address</label>
                <textarea
                  id="newUserAddress"
                  required
                  maxLength={500}
                  rows={3}
                  value={userForm.address}
                  onChange={(event) => setUserForm((current) => ({ ...current, address: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-700 outline-none focus:border-[#9a805d]"
                  placeholder="Street, city, region, postal code, country"
                />
              </div>
            </div>
            <Feedback error={userError} message={userMessage} isDemo={userIsDemo} />
            <button
              type="submit"
              disabled={isSavingUser}
              className="mt-5 w-full rounded-xl bg-[#34332f] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#4a4841] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingUser ? "Saving..." : "Save User"}
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#9a805d]">Account ledger</p>
          <h2 className="mt-3 font-serif text-3xl font-normal text-[#302e29]">Transactions</h2>
          <p className="mt-2 text-sm text-slate-600">Credits increase the balance; debits reduce it. Adjustments can be positive or negative.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <form onSubmit={handleCreateTransaction} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-5 font-serif text-2xl font-normal text-[#302e29]">Record a transaction</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="transactionProfile" className="mb-2 block text-sm font-medium text-slate-700">User</label>
                <select
                  id="transactionProfile"
                  required
                  value={transactionForm.profileId}
                  onChange={(event) => setTransactionForm((current) => ({ ...current, profileId: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-700 focus:border-[#9a805d]"
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.first_name} {user.last_name} · {user.email}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="transactionDate" className="mb-2 block text-sm font-medium text-slate-700">Transaction Date</label>
                <input
                  id="transactionDate"
                  type="date"
                  required
                  value={transactionForm.transactionDate}
                  onChange={(event) => setTransactionForm((current) => ({ ...current, transactionDate: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-700 focus:border-[#9a805d]"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="transactionType" className="mb-2 block text-sm font-medium text-slate-700">Type</label>
                  <select
                    id="transactionType"
                    value={transactionForm.type}
                    onChange={(event) => setTransactionForm((current) => ({ ...current, type: event.target.value as Transaction["type"] }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-700 focus:border-[#9a805d]"
                  >
                    <option value="Credit">Credit</option>
                    <option value="Debit">Debit</option>
                    <option value="Adjustment">Adjustment</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="transactionAmount" className="mb-2 block text-sm font-medium text-slate-700">Amount ($)</label>
                  <input
                    id="transactionAmount"
                    type="number"
                    step="0.01"
                    min={transactionForm.type === "Adjustment" ? undefined : "0.01"}
                    required
                    value={transactionForm.amount}
                    onChange={(event) => setTransactionForm((current) => ({ ...current, amount: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-700 focus:border-[#9a805d]"
                    placeholder={transactionForm.type === "Adjustment" ? "Use a minus sign to reduce balance" : "0.00"}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="transactionReference" className="mb-2 block text-sm font-medium text-slate-700">Reference</label>
                <input
                  id="transactionReference"
                  required
                  maxLength={100}
                  value={transactionForm.reference}
                  onChange={(event) => setTransactionForm((current) => ({ ...current, reference: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-700 focus:border-[#9a805d]"
                  placeholder="e.g. ROYALTY-2026-001"
                />
              </div>
              <div>
                <label htmlFor="transactionDescription" className="mb-2 block text-sm font-medium text-slate-700">Transaction</label>
                <textarea
                  id="transactionDescription"
                  maxLength={500}
                  rows={3}
                  value={transactionForm.description}
                  onChange={(event) => setTransactionForm((current) => ({ ...current, description: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-700 focus:border-[#9a805d]"
                  placeholder="Optional notes about this transaction"
                />
              </div>
            </div>
            <Feedback error={transactionError} message={transactionMessage} isDemo={transactionIsDemo} />
            <button
              type="submit"
              disabled={isSavingTransaction || users.length === 0}
              className="mt-5 w-full rounded-xl bg-[#34332f] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#4a4841] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingTransaction ? "Saving..." : "Save Transaction"}
            </button>
          </form>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Reference</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">User</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Type</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Amount</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-3 text-sm text-slate-700">{transaction.reference}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{transaction.user_email}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{transaction.type}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">
                      {transaction.amount > 0 ? "+" : "-"}{money(transaction.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{new Date(`${transaction.transaction_date}T00:00:00`).toLocaleDateString()}</td>
                  </tr>
                ))}
                {transactions.length === 0 ? <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">No transactions recorded yet.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
