import "server-only";

import {
  Profile,
  Transaction,
  getAllTransactions,
  getProfiles,
  getProfileByEmail,
  getTransactionsByUser,
} from "@/lib/mock-db";
import { getSupabaseClient } from "@/lib/supabase";

export type UserDashboardData = {
  profile: Profile;
  transactions: Transaction[];
};

export type AdminTransaction = Transaction & {
  user_email: string;
};

function toProfile(row: {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  status: string;
  created_at: string;
  balance: number | string;
  account_id: string;
}): Profile {
  return {
    id: row.id,
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    role: row.role === "Admin" ? "Admin" : "User",
    status: row.status === "Suspended" ? "Suspended" : "Active",
    created_at: row.created_at,
    balance: Number(row.balance),
    account_id: row.account_id,
  };
}

export async function getDashboardProfiles(): Promise<Profile[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return getProfiles();
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, phone, address, role, status, created_at, balance, account_id")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase profiles query error:", error.code, error.message);
    throw new Error("Unable to load profiles from Supabase.");
  }

  return (data ?? []).map(toProfile);
}

export async function getAdminTransactions(profiles: Profile[]): Promise<AdminTransaction[]> {
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
  const supabase = getSupabaseClient();

  if (!supabase) {
    return getAllTransactions().map((transaction) => ({
      ...transaction,
      user_email: profileById.get(transaction.user_id)?.email ?? "",
    }));
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("id, profile_id, reference, type, amount, description, transaction_date, created_at")
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase transactions query error:", error.code, error.message);
    throw new Error("Unable to load transactions from Supabase.");
  }

  return (data ?? []).map((transaction) => ({
    id: transaction.id,
    user_id: transaction.profile_id,
    reference: transaction.reference,
    type: transaction.type as Transaction["type"],
    amount: Number(transaction.amount),
    description: transaction.description,
    transaction_date: transaction.transaction_date,
    created_at: transaction.created_at,
    user_email: profileById.get(transaction.profile_id)?.email ?? "",
  }));
}

export async function getUserDashboardData(email: string): Promise<UserDashboardData | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    const profile = getProfileByEmail(email);

    if (!profile) {
      return null;
    }

    return {
      profile,
      transactions: getTransactionsByUser(profile.id),
    };
  }

  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, phone, address, role, status, created_at, balance, account_id")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (profileError) {
    console.error("Supabase profile query error:", profileError.code, profileError.message);
    throw new Error("Unable to load the user profile from Supabase.");
  }

  if (!profileRow) {
    return null;
  }

  const profile = toProfile(profileRow);
  const { data, error } = await supabase
    .from("transactions")
    .select("id, reference, type, amount, description, transaction_date, created_at")
    .eq("profile_id", profile.id)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase transactions query error:", error.code, error.message);
    throw new Error("Unable to load transactions from Supabase.");
  }

  return {
    profile,
    transactions: (data ?? []).map((transaction) => ({
      id: transaction.id,
      user_id: profile.id,
      reference: transaction.reference,
      type: transaction.type as Transaction["type"],
      amount: Number(transaction.amount),
      description: transaction.description,
      transaction_date: transaction.transaction_date,
      created_at: transaction.created_at,
    })),
  };
}
