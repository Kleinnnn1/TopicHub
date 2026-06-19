"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-neutral-900 transition-opacity hover:opacity-70"
        >
          TopicHub<span className="text-blue-600">.</span>
        </Link>
      </nav>
    </header>
  );
}
