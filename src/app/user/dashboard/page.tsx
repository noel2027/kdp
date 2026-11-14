import { Suspense } from "react";

import { UserDashboard } from "@/components/UserDashboard";
import { getUserDashboardData } from "@/lib/dashboard-data";

type UserDashboardPageProps = {
  searchParams: Promise<{ email?: string | string[] }>;
};

export default function UserDashboardPage({ searchParams }: UserDashboardPageProps) {
  return (
    <Suspense fallback={<main className="p-8 text-center text-slate-600">Loading dashboard...</main>}>
      <UserDashboardContent searchParams={searchParams} />
    </Suspense>
  );
}

async function UserDashboardContent({ searchParams }: UserDashboardPageProps) {
  const params = await searchParams;
  const emailParam = params.email;
  const email = (Array.isArray(emailParam) ? emailParam[0] : emailParam)?.trim() ?? "marcus.bell@kdplus.demo";
  const data = await getUserDashboardData(email);

  if (!data) {
    return <main className="p-8 text-center text-red-600">User not found.</main>;
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <UserDashboard profile={data.profile} transactions={data.transactions} />
      </div>
    </main>
  );
}
