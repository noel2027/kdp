"use client";

import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.replace("/")}
      className="inline-flex items-center justify-center border border-[#d8d1c3] px-4 py-2 text-sm text-[#4c4942] transition hover:border-[#9a805d] hover:bg-[#f1f0eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a805d]"
    >
      Sign out
    </button>
  );
}
