"use client";

import Link from "next/link";
import { ArrowLeft, LogOut, UserCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-hm-bg px-5 py-10">
        <div className="h-12 w-52 animate-pulse rounded-full bg-hm-surface" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-hm-bg px-5 py-10 text-hm-text">
        <div className="w-full max-w-md rounded-2xl border border-hm-border bg-hm-surface/60 p-8 text-center">
          <p className="mb-4 text-lg font-medium">Vous n&apos;êtes pas connecté.</p>
          <Link href="/login" className="inline-flex rounded-full bg-hm-text px-5 py-3 text-sm font-semibold text-hm-bg transition hover:bg-white">
            Se connecter
          </Link>
        </div>
      </main>
    );
  }

  const role = user.app_metadata?.role ?? user.user_metadata?.role ?? "user";
  const roleLabel = role === "admin" ? "Administrateur" : role === "moderator" ? "Modérateur" : role === "editor" ? "Éditeur" : "Utilisateur";

  return (
    <main className="flex min-h-screen items-center justify-center bg-hm-bg px-5 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-hm-border bg-hm-surface/60 p-8 shadow-2xl shadow-black/20">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-hm-muted transition hover:text-hm-text">
          <ArrowLeft size={17} /> Retour à l&apos;accueil
        </Link>

        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-hm-gold/15 text-hm-gold">
            <UserCircle2 size={28} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.14em] text-hm-gold">Profil</p>
            <h1 className="mt-1 text-2xl font-bold text-hm-text">{user.email}</h1>
          </div>
        </div>

        <div className="mt-8 space-y-4 rounded-xl border border-hm-border bg-hm-bg p-5 text-sm text-hm-muted">
          <div className="flex items-center justify-between">
            <span>Compte</span>
            <span className="font-medium text-hm-text">Actif</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Rôle</span>
            <span className="font-medium text-hm-text">{roleLabel}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={signOut}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-hm-border bg-hm-surface px-4 py-2 text-sm font-medium text-hm-text transition hover:border-hm-accent"
        >
          <LogOut size={16} />
          Se déconnecter
        </button>
      </div>
    </main>
  );
}
