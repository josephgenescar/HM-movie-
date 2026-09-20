"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CreditCard, Film, LayoutDashboard, Search, ShieldCheck, Users } from "lucide-react";
import { getCurrentUserRole, getAdminOverview } from "@/features/admin/admin-service";
import { useAuth } from "@/hooks/use-auth";

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<"user" | "admin" | "moderator" | "editor">("user");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const currentRole = await getCurrentUserRole();
      const overview = await getAdminOverview();
      setRole(currentRole);
      setStats(overview);
      setLoading(false);
    }

    loadData();
  }, []);

  if (authLoading || loading) {
    return <div className="rounded-2xl border border-hm-border bg-hm-surface/60 p-8 text-hm-muted">Chargement du tableau de bord...</div>;
  }

  if (!user || role !== "admin") {
    return (
      <div className="rounded-2xl border border-hm-border bg-hm-surface/60 p-8 text-center">
        <ShieldCheck className="mx-auto mb-4 text-hm-gold" size={30} />
        <h2 className="text-2xl font-bold text-hm-text">Accès non autorisé</h2>
        <p className="mt-3 text-hm-muted">Cette zone est réservée aux administrateurs de la plateforme.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-hm-text px-5 py-3 text-sm font-semibold text-hm-bg">Retour à l&apos;accueil</Link>
      </div>
    );
  }

  const cards = [
    { label: "Utilisateurs", value: stats.totalUsers.toLocaleString(), icon: Users },
    { label: "Abonnés actifs", value: stats.activeSubscriptions.toLocaleString(), icon: CreditCard },
    { label: "Premium", value: stats.premiumUsers.toLocaleString(), icon: ShieldCheck },
    { label: "Contenus", value: "1.2k", icon: Film },
    { label: "Jobs IA", value: stats.aiJobs.toString(), icon: LayoutDashboard },
    { label: "Campagnes ads", value: stats.adCampaigns.toString(), icon: Search }
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-hm-border bg-hm-surface/60 p-5">
            <div className="mb-4 inline-flex rounded-full bg-hm-gold/10 p-2 text-hm-gold">
              <Icon size={18} />
            </div>
            <p className="text-sm text-hm-muted">{label}</p>
            <p className="mt-3 text-3xl font-bold text-hm-text">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-hm-border bg-hm-surface/60 p-5">
          <h3 className="text-lg font-semibold text-hm-text">Activités récentes</h3>
          <ul className="mt-5 space-y-3 text-sm text-hm-muted">
            <li className="rounded-xl bg-hm-bg p-3">Nouveau premium acheté par 34 utilisateurs aujourd&apos;hui.</li>
            <li className="rounded-xl bg-hm-bg p-3">2 campagnes publicitaires en attente de validation.</li>
            <li className="rounded-xl bg-hm-bg p-3">5 jobs IA en cours de génération.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-hm-border bg-hm-surface/60 p-5">
          <h3 className="text-lg font-semibold text-hm-text">Tâches de maintenance</h3>
          <ul className="mt-5 space-y-3 text-sm text-hm-muted">
            <li className="rounded-xl bg-hm-bg p-3">Vérifier les contenus signalés ({stats.pendingReviews})</li>
            <li className="rounded-xl bg-hm-bg p-3">Contrôler les coûts AI et la crédibilité de génération</li>
            <li className="rounded-xl bg-hm-bg p-3">Mettre à jour les paramètres globaux de la plateforme</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
