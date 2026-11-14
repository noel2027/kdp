import { Suspense } from "react";

import { AdminDashboard } from "@/components/AdminDashboard";
import { getAdminTransactions, getDashboardProfiles } from "@/lib/dashboard-data";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<main className="p-8 text-center text-slate-600">Loading admin dashboard...</main>}>
      <AdminDashboardContent />
    </Suspense>
  );
}

async function AdminDashboardContent() {
  const profiles = await getDashboardProfiles();
  const transactions = await getAdminTransactions(profiles);

  return (
    <main className="min-h-screen bg-[#f7f6f2] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminDashboard
          profiles={profiles}
          transactions={transactions}
        />
      </div>
    </main>
  );
}
