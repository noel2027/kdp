import { NextRequest, NextResponse } from "next/server";

import { createProfile, getProfileByEmail } from "@/lib/mock-db";
import { getSupabaseClient } from "@/lib/supabase";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      address?: string;
    };

    const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
    const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const address = typeof body.address === "string" ? body.address.trim() : "";

    if (!firstName || !lastName) {
      return NextResponse.json({ error: "First name and last name are required." }, { status: 400 });
    }

    if (!phone || phone.length > 50) {
      return NextResponse.json({ error: "Please enter a phone number of 50 characters or fewer." }, { status: 400 });
    }

    if (!address || address.length > 500) {
      return NextResponse.json({ error: "Please enter an address of 500 characters or fewer." }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    if (supabase) {
      const { error } = await supabase.from("profiles").insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address,
        role: "User",
        status: "Active",
        created_at: new Date().toISOString(),
        balance: 0,
        account_id: `ACC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      });

      if (error) {
        console.error("Supabase insert error:", error.code, error.message);

        if (error.code === "23505") {
          return NextResponse.json(
            { error: "This email address is already registered. Please use a different email." },
            { status: 409 },
          );
        }

        return NextResponse.json(
          { error: "The account could not be saved to the database. Check the server-side Supabase configuration." },
          { status: 503 },
        );
      }

      return NextResponse.json({
        success: true,
        mode: "supabase",
        message: "User account saved to Supabase successfully.",
      });
    }

    if (getProfileByEmail(email)) {
      return NextResponse.json(
        { error: "This email address is already registered. Please use a different email." },
        { status: 409 },
      );
    }

    createProfile({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address,
      role: "User",
      status: "Active",
      created_at: new Date().toISOString(),
      balance: 0,
      account_id: `ACC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    });

    return NextResponse.json({
      success: true,
      mode: "demo",
      message: "Demo-only account created in temporary app memory. It was not saved to Supabase and may be lost when the app restarts.",
    });
  } catch {
    return NextResponse.json({ error: "Unable to create the user account at this time." }, { status: 500 });
  }
}
