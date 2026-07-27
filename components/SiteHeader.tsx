"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={`rounded-lg px-3.5 py-1.5 text-sm font-bold transition ${
        active
          ? "bg-groupr-surface text-groupr-ink shadow-groupr"
          : "text-groupr-inkMuted hover:text-groupr-ink"
      }`}
    >
      {children}
    </Link>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-groupr-line bg-groupr-topbar px-5 py-3">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 8.5L6.4 4.2C6.7 3.5 7.3 3 8.1 3H15.9C16.7 3 17.3 3.5 17.6 4.2L19 8.5"
              stroke="var(--accent)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.2 8.5H19.8L19 19.3C18.9 20.3 18.1 21 17.1 21H6.9C5.9 21 5.1 20.3 5 19.3L4.2 8.5Z"
              fill="var(--accent)"
            />
            <path
              d="M9 11.2C9 12.7 10.3 14 12 14C13.7 14 15 12.7 15 11.2"
              stroke="var(--on-accent)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-display text-lg font-bold tracking-tight text-groupr-ink">
            groupr
          </span>
          <span className="hidden border-l border-groupr-line pl-2.5 text-xs text-groupr-inkFaint sm:inline">
            card sort
          </span>
        </Link>
        <nav className="flex gap-1 rounded-xl border border-groupr-line bg-groupr-surface2 p-1">
          <NavLink href="/survey">Take the survey</NavLink>
          <NavLink href="/admin">Admin dashboard</NavLink>
        </nav>
      </div>
    </header>
  );
}
