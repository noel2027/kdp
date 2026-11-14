import { NextRequest, NextResponse } from "next/server";

import { createBook, getAllBooks, getProfiles } from "@/lib/mock-db";
import { getSupabaseClient } from "@/lib/supabase";

function isBookStatus(value: string | undefined): value is "Draft" | "Active" | "Published" {
  return value === "Draft" || value === "Active" || value === "Published";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      profileId?: string;
      title?: string;
      status?: string;
      currentBalance?: string | number;
    };

    const profileId = body.profileId?.trim() ?? "";
    const title = body.title?.trim() ?? "";
    const status = body.status;
    const currentBalance = Number(body.currentBalance ?? 0);

    if (!profileId || !title || title.length > 200) {
      return NextResponse.json({ error: "Select a user and enter a book title (up to 200 characters)." }, { status: 400 });
    }

    if (!isBookStatus(status)) {
      return NextResponse.json({ error: "Choose a valid book status." }, { status: 400 });
    }

    if (!Number.isFinite(currentBalance) || currentBalance < 0) {
      return NextResponse.json({ error: "Book balance must be zero or greater." }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    if (supabase) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, role")
        .eq("id", profileId)
        .maybeSingle();

      if (profileError) {
        console.error("Supabase book profile lookup error:", profileError.code, profileError.message);
        return NextResponse.json({ error: "Unable to verify the selected user in Supabase." }, { status: 503 });
      }

      if (!profile || profile.role !== "User") {
        return NextResponse.json({ error: "The selected user account could not be found." }, { status: 404 });
      }

      const { error } = await supabase.from("books").insert({
        profile_id: profile.id,
        title,
        author_name: `${profile.first_name} ${profile.last_name}`,
        status,
        current_balance: currentBalance,
      });

      if (error) {
        console.error("Supabase book insert error:", error.code, error.message);

        if (error.code === "23505") {
          return NextResponse.json({ error: "That user already has a book with this title." }, { status: 409 });
        }

        return NextResponse.json({ error: "The book could not be saved to Supabase." }, { status: 503 });
      }

      return NextResponse.json({
        success: true,
        mode: "supabase",
        message: "Book saved to Supabase and assigned to the user.",
      });
    }

    const profile = getProfiles().find((item) => item.id === profileId && item.role === "User");

    if (!profile) {
      return NextResponse.json({ error: "The selected user account could not be found." }, { status: 404 });
    }

    if (getAllBooks().some((book) => book.profile_id === profile.id && book.title.toLowerCase() === title.toLowerCase())) {
      return NextResponse.json({ error: "That user already has a book with this title." }, { status: 409 });
    }

    const createdBook = createBook({
      profile_id: profile.id,
      title,
      author: `${profile.first_name} ${profile.last_name}`,
      status,
      royalty_rate: 0,
      current_balance: currentBalance,
    });

    return NextResponse.json({
      success: true,
      mode: "demo",
      message: `Demo-only book "${createdBook.title}" was added in temporary app memory, not Supabase.`,
    });
  } catch {
    return NextResponse.json({ error: "Unable to create the book at this time." }, { status: 500 });
  }
}
