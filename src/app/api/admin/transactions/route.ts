import { NextRequest, NextResponse } from "next/server";

import { createTransaction, getAllTransactions, getProfiles } from "@/lib/mock-db";
import { getSupabaseClient } from "@/lib/supabase";

type TransactionType = "Credit" | "Debit" | "Adjustment";

function isTransactionType(value: string | undefined): value is TransactionType {
  return value === "Credit" || value === "Debit" || value === "Adjustment";
}

function isValidTransactionDate(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedDate = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsedDate) && new Date(parsedDate).toISOString().slice(0, 10) === value;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      profileId?: string;
      reference?: string;
      type?: string;
      amount?: string | number;
      description?: string;
      transactionDate?: string;
    };

    const profileId = body.profileId?.trim() ?? "";
    const reference = body.reference?.trim() ?? "";
    const description = body.description?.trim() ?? "";
    const amountText = String(body.amount ?? "").trim();
    const transactionDate = body.transactionDate;

    if (!profileId || !reference || reference.length > 100) {
      return NextResponse.json({ error: "Select a user and enter a reference (up to 100 characters)." }, { status: 400 });
    }

    if (!isTransactionType(body.type)) {
      return NextResponse.json({ error: "Choose a valid transaction type." }, { status: 400 });
    }

    if (!isValidTransactionDate(transactionDate)) {
      return NextResponse.json({ error: "Select a valid transaction date." }, { status: 400 });
    }

    if (!/^-?\d+(?:\.\d{1,2})?$/.test(amountText)) {
      return NextResponse.json({ error: "Enter a valid amount with no more than two decimal places." }, { status: 400 });
    }

    const enteredAmount = Number(amountText);

    if (!Number.isFinite(enteredAmount) || enteredAmount === 0 || Math.abs(enteredAmount) > 9999999999.99) {
      return NextResponse.json({ error: "Amount must be non-zero and within the supported range." }, { status: 400 });
    }

    if (body.type !== "Adjustment" && enteredAmount < 0) {
      return NextResponse.json({ error: "Enter a positive amount for credits and debits." }, { status: 400 });
    }

    if (description.length > 500) {
      return NextResponse.json({ error: "Description must be 500 characters or fewer." }, { status: 400 });
    }

    const amount = body.type === "Debit" ? -enteredAmount : enteredAmount;
    const supabase = getSupabaseClient();

    if (supabase) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", profileId)
        .maybeSingle();

      if (profileError) {
        console.error("Supabase transaction profile lookup error:", profileError.code, profileError.message);
        return NextResponse.json({ error: "Unable to verify the selected user in Supabase." }, { status: 503 });
      }

      if (!profile || profile.role !== "User") {
        return NextResponse.json({ error: "The selected user account could not be found." }, { status: 404 });
      }

      const { error } = await supabase.rpc("record_profile_transaction", {
        p_profile_id: profile.id,
        p_reference: reference,
        p_type: body.type,
        p_amount: amount,
        p_description: description,
        p_transaction_date: transactionDate,
      });

      if (error) {
        console.error("Supabase transaction insert error:", error.code, error.message);

        if (error.code === "23505") {
          return NextResponse.json({ error: "That transaction reference is already in use." }, { status: 409 });
        }

        if (error.code === "PGRST202") {
          return NextResponse.json(
            { error: "Run supabase/management.sql in Supabase SQL Editor before recording transactions." },
            { status: 503 },
          );
        }

        return NextResponse.json({ error: "The transaction could not be saved to Supabase." }, { status: 503 });
      }

      return NextResponse.json({
        success: true,
        mode: "supabase",
        message: "Transaction saved and account balance updated in Supabase.",
      });
    }

    const profile = getProfiles().find((item) => item.id === profileId && item.role === "User");

    if (!profile) {
      return NextResponse.json({ error: "The selected user account could not be found." }, { status: 404 });
    }

    if (getAllTransactions().some((transaction) => transaction.reference.toLowerCase() === reference.toLowerCase())) {
      return NextResponse.json({ error: "That transaction reference is already in use." }, { status: 409 });
    }

    createTransaction({
      user_id: profile.id,
      reference,
      type: body.type,
      amount,
      description,
      transaction_date: transactionDate,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      mode: "demo",
      message: "Demo-only transaction added in temporary app memory, not Supabase.",
    });
  } catch {
    return NextResponse.json({ error: "Unable to create the transaction at this time." }, { status: 500 });
  }
}
