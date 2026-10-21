import Link from "next/link";
import { ChevronRight } from "lucide-react";
import JsonLd from "./JsonLd";

export interface Crumb {
  name: string;
  href?: string;
}

const BASE = "https://bandirmasenin.com";

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: "Ana sayfa", href: "/" }, ...items];
  return (
    <>
      <nav className="crumbs" aria-label="Sayfa yolu">
        <ol>
          {all.map((c, i) => (
            <li key={i}>
              {c.href && i < all.length - 1 ? (
                <Link href={c.href} title={c.name}>
                  {c.name}
                </Link>
              ) : (
                <span aria-current="page">{c.name}</span>
              )}
              {i < all.length - 1 && <ChevronRight size={14} aria-hidden />}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            ...(c.href ? { item: `${BASE}${c.href}` } : {}),
          })),
        }}
      />
    </>
  );
}
