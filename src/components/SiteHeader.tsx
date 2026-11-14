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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 sm:px-8 lg:px-12">
          <Link href="/" className="text-lg font-medium tracking-[0.08em]">
            Kindle Direct Publishing
          </Link>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="border-b border-[#b8b4ab] pb-1 text-sm font-medium text-[#e3e1dc] transition hover:border-[#554a38] hover:text-[#171613]"
          >
            Sign In
          </button>
        </div>

        <nav className="border-t border-[#f0eee9] bg-[#fbfaf8]">
          <div className="mx-auto flex max-w-7xl items-center justify-start gap-7 overflow-x-auto px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-[#77736c] sm:px-8 lg:px-12">
            {navItems.map((item) => {
              const isActive = activeRoute === item.label;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive
                      ? "border-b border-[#858178] pb-1 text-[#302e29]"
                      : "pb-1 transition hover:text-[#302e29]"
                  }
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
