import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <p className="text-sm text-neutral-500">© {year} All rights reserved</p>
        <Link
          href="/login"
          className="text-sm text-neutral-400 transition-colors hover:text-neutral-600"
        >
          Admin
        </Link>
      </div>
    </footer>
  );
}
