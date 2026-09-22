import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, Bot, CreditCard, Film, ImageIcon, Settings, ShieldCheck, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const navItems: Array<{ href: "/admin" | "/admin/users" | "/admin/content" | "/admin/media" | "/admin/subscriptions" | "/admin/settings" | "/ai"; label: string; icon: typeof BarChart3 }> = [
  { href: "/admin", label: "Vue d'ensemble", icon: BarChart3 },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/content", label: "Contenu", icon: Film },
  { href: "/admin/media", label: "Médias", icon: ImageIcon },
  { href: "/admin/subscriptions", label: "Abonnements", icon: CreditCard },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
  { href: "/ai", label: "AI Studio", icon: Bot }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  if (user.app_metadata?.role !== "admin") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-hm-bg px-5 py-6 text-hm-text sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-hm-border bg-hm-surface/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-hm-gold">Admin</p>
            <h1 className="mt-2 text-2xl font-bold">HM(Movie) Dashboard</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-hm-border bg-hm-bg px-3 py-2 text-sm text-hm-muted">
            <ShieldCheck size={15} className="text-hm-gold" />
            Accès administrateur
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="rounded-2xl border border-hm-border bg-hm-surface/60 p-4">
            <nav className="space-y-2">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href as any}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-hm-muted transition hover:bg-hm-bg hover:text-hm-text"
                >
                  <Icon size={16} className="text-hm-gold" />
                  {label}
                </Link>
              ))}
            </nav>
          </aside>

          <div>{children}</div>
        </div>
      </div>
    </main>
  );
}
