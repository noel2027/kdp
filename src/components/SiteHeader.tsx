"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { SignInModal } from "@/components/SignInModal";

const navItems = [
  { label: "About", href: "/" },
  { label: "Publish", href: "/publish" },
  { label: "Earn", href: "/earn" },
  { label: "Help", href: "/help" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeRoute = useMemo(() => {
    if (pathname === "/publish") return "Publish";
    if (pathname === "/earn") return "Earn";
    if (pathname === "/help") return "Help";
    return "About";
  }, [pathname]);

  return (
    <>
      <header className="border-b border-[#e7e4dc] bg-[#222e3e] text-[#e3e1dc]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-8 sm:py-5 lg:px-12">
          <Link href="/" className="min-w-0 text-base font-medium leading-tight tracking-[0.06em] sm:text-lg sm:tracking-[0.08em]">
            Kindle Direct Publishing
          </Link>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex min-h-11 shrink-0 items-center border-b border-[#b8b4ab] px-1 text-sm font-medium text-[#e3e1dc] transition hover:border-[#554a38] hover:text-white"
          >
            Sign In
          </button>
        </div>

        <nav className="border-t border-[#f0eee9] bg-[#fbfaf8]">
          <div className="mx-auto flex max-w-7xl items-center justify-start gap-5 overflow-x-auto px-4 py-2 text-[11px] font-medium uppercase tracking-[0.15em] text-[#77736c] sm:gap-7 sm:px-8 sm:py-3 sm:text-xs sm:tracking-[0.18em] lg:px-12">
            {navItems.map((item) => {
              const isActive = activeRoute === item.label;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex min-h-10 shrink-0 items-center whitespace-nowrap ${
                    isActive
                      ? "border-b border-[#858178] text-[#302e29]"
                      : "transition hover:text-[#302e29]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <SignInModal open={isModalOpen} onClose={() => setIsModalOpen(false)} router={router} />
    </>
  );
}
