"use client";

import { FormEvent, useState } from "react";

type SignInModalProps = {
  open: boolean;
  onClose: () => void;
  router: {
    push: (url: string) => void;
  };
};

export function SignInModal({ open, onClose, router }: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const payload = (await response.json()) as { error?: string; redirectTo?: string };

      if (!response.ok || !payload.redirectTo) {
        setError(payload.error ?? "Unable to continue with this email.");
        return;
      }

      onClose();
      const redirectUrl = new URL(payload.redirectTo, "http://localhost");
      redirectUrl.searchParams.set("email", normalizedEmail);
      router.push(`${redirectUrl.pathname}${redirectUrl.search}`);
    } catch {
      setError("Something went wrong while checking this email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#282621]/45 p-4">
      <div className="w-full max-w-[360px] rounded-lg border border-[#d8d8d3] bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-xl font-medium text-[#22221f]">Sign in to KDPlus</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none text-[#77736c] transition hover:text-[#302e29]"
            aria-label="Close sign in dialog"
          >
            ×
          </button>
        </div>

        <p className="mb-4 text-sm leading-5 text-[#514e47]">
          Enter the email address linked to your kindle direct publishing to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="signin-email" className="mb-1 block text-sm font-semibold text-[#302e29]">
              Email address
            </label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-md border border-[#a9aaa5] bg-white px-3 py-2 text-sm text-[#302e29] outline-none transition focus:border-[#55534d] focus:ring-1 focus:ring-[#55534d]"
              autoComplete="email"
              disabled={isSubmitting}
            />
          </div>

          {error ? (
            <div className="border-l-2 border-red-400 bg-[#f7eeeb] px-3 py-2 text-sm text-red-800">{error}</div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-full bg-[#fcca03] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#edbf09] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Checking email..." : "Continue"}
          </button>
        </form>

        <p className="mt-4 text-xs leading-5 text-[#706c64]">
          By continuing, you agree to Amazon's Conditions of Use. You can find the privacy notice that applies to you here.
        </p>

        <details className="mt-4 border-t border-[#eceae5] pt-3">
          <summary className="w-fit cursor-pointer text-sm text-[#4c4942] underline decoration-[#b8b4ab] underline-offset-4">
            Need help?
          </summary>
          <p className="mt-2 text-xs leading-5 text-[#706c64]">
            Contact your administrator if you need help accessing your kindle direct publishing account.
          </p>
        </details>
      </div>
    </div>
  );
}
