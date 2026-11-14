import { NextRequest, NextResponse } from "next/server";

import { getProfileByEmail } from "@/lib/mock-db";
import { getSupabaseClient } from "@/lib/supabase";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function findProfileByEmail(email: string) {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("profiles")
      .select("email, role, status")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Supabase lookup error:", error.code, error.message);
      return { profile: null, unavailable: true };
    }

    if (!data) {
      return { profile: null, unavailable: false };
    }

    return {
      profile: {
        email: data.email,
        role: data.role ?? "User",
        status: data.status ?? "Active",
      },
      unavailable: false,
    };
  }

  return { profile: getProfileByEmail(email) ?? null, unavailable: false };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase() ?? "";

    if (!email) {
      return NextResponse.json(
        { error: "Please enter your registered email address." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const lookup = await findProfileByEmail(email);

    if (lookup.unavailable) {
      return NextResponse.json(
        { error: "Unable to check accounts in Supabase. Verify server configuration and try again." },
        { status: 503 },
      );
    }

    if (!lookup.profile) {
      return NextResponse.json(
        { error: "This email address is not registered. Please contact the administrator." },
        { status: 404 },
      );
    }

    const normalizedRole = String(lookup.profile.role ?? "User").toLowerCase();
    const normalizedStatus = String(lookup.profile.status ?? "Active").toLowerCase();

    if (normalizedStatus !== "active") {
      return NextResponse.json(
        { error: "Your account has been suspended. Please contact the administrator." },
        { status: 403 },
      );
    }

    const redirectTo = normalizedRole === "admin" ? "/admin/dashboard" : "/user/dashboard";

    return NextResponse.json({ redirectTo });
  } catch {
    return NextResponse.json(
      { error: "Unable to process sign in request at this time." },
      { status: 500 },
    );
  }
}
