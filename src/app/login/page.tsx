"use client";

import Link from "next/link";
import { ArrowLeft, Mail, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteLogo } from "@/components/site-logo";
import { signInWithEmail } from "@/features/auth/auth-service";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signInWithEmail({ email, password });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la connexion.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-hm-bg px-5 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-hm-muted transition hover:text-hm-text"><ArrowLeft size={17} /> Retour à l&apos;accueil</Link>
        <div className="rounded-2xl border border-hm-border bg-hm-surface/60 p-6 shadow-2xl shadow-black/20 sm:p-9">
          <SiteLogo compact />
          <h1 className="mt-10 font-display text-3xl font-bold tracking-tight text-hm-text">Bon retour.</h1>
          <p className="mt-2 text-sm leading-6 text-hm-muted">Connectez-vous pour retrouver vos films et séries.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm text-hm-muted">Adresse email<div className="relative mt-2"><Mail className="absolute left-3 top-3 text-hm-muted" size={17} /><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="vous@exemple.com" className="h-11 w-full rounded-lg border border-hm-border bg-hm-bg pl-10 pr-3 text-sm text-hm-text outline-none transition placeholder:text-hm-muted/60 focus:border-hm-gold" required /></div></label>
            <label className="block text-sm text-hm-muted">Mot de passe<div className="relative mt-2"><LockKeyhole className="absolute left-3 top-3 text-hm-muted" size={17} /><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="••••••••" className="h-11 w-full rounded-lg border border-hm-border bg-hm-bg pl-10 pr-3 text-sm text-hm-text outline-none transition placeholder:text-hm-muted/60 focus:border-hm-gold" required /></div></label>
            <div className="flex items-center justify-between text-xs"><label className="flex items-center gap-2 text-hm-muted"><input type="checkbox" className="accent-hm-accent" /> Se souvenir de moi</label><button type="button" className="text-hm-gold hover:underline">Mot de passe oublié ?</button></div>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <button type="submit" disabled={isLoading} className="h-11 w-full rounded-lg bg-hm-text text-sm font-semibold text-hm-bg transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70">{isLoading ? "Connexion..." : "Se connecter"}</button>
          </form>
          <p className="mt-8 border-t border-hm-border pt-6 text-center text-sm text-hm-muted">Pas encore de compte ? <Link href="/register" className="font-medium text-hm-gold hover:underline">Créer un compte</Link></p>
        </div>
      </div>
    </main>
  );
}
