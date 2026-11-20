"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * Breadcrumbs component that builds a trail from the current pathname.
 * It splits the path on '/' and creates links for each segment.
 * Example: /admin/usuarios -> Home / Admin / Usuários
 */
export default function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = [{ name: "Home", href: "/" }];

  let accumulated = "";
  parts.forEach((p) => {
    accumulated += `/${p}`;
    // capitalize first letter and replace hyphens with spaces
    const name = p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, " ");
    crumbs.push({ name, href: accumulated });
  });

  return (
    <nav className="text-sm text-slate-500 mb-4" aria-label="breadcrumb">
      {crumbs.map((c, i) => (
        <span key={c.href} className="mr-1">
          {i > 0 && <span className="mx-1">/</span>}
          <Link href={c.href} className="hover:underline">
            {c.name}
          </Link>
        </span>
      ))}
    </nav>
  );
}

