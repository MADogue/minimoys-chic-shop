import { Link } from "@tanstack/react-router";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/commandes", label: "Commandes" },
  { to: "/admin", label: "Produits" },
  { to: "/admin/analytics", label: "Analytics" },
] as const;

export function AdminNav() {
  return (
    <nav className="flex flex-wrap gap-2 overflow-x-auto">
      {links.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          activeOptions={{ exact: true }}
          className="rounded-full border border-border px-4 py-2 text-sm text-ink-muted transition-colors hover:text-foreground [&.active]:bg-primary [&.active]:text-primary-foreground"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
