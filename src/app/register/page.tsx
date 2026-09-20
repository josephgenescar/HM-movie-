"use client";

import Link from "next/link";
import { ArrowLeft, Mail, LockKeyhole, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteLogo } from "@/components/site-logo";
import { signUpWithEmail } from "@/features/auth/auth-service";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await signUpWithEmail({
        fullName,
        email,
        password
      });

      setSuccess("Compte créé avec succès. Vérifiez votre email pour confirmer votre inscription.");
      setFullName("");
      setEmail("");
      setPassword("");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'inscription.");
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
          <h1 className="mt-10 font-display text-3xl font-bold tracking-tight text-hm-text">Bienvenue chez vous.</h1>
          <p className="mt-2 text-sm leading-6 text-hm-muted">Créez votre compte et commencez votre prochaine histoire.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm text-hm-muted">Nom complet<div className="relative mt-2"><UserRound className="absolute left-3 top-3 text-hm-muted" size={17} /><input value={fullName} onChange={(event) => setFullName(event.target.value)} type="text" placeholder="Votre nom" className="h-11 w-full rounded-lg border border-hm-border bg-hm-bg pl-10 pr-3 text-sm text-hm-text outline-none transition placeholder:text-hm-muted/60 focus:border-hm-gold" required /></div></label>
            <label className="block text-sm text-hm-muted">Adresse email<div className="relative mt-2"><Mail className="absolute left-3 top-3 text-hm-muted" size={17} /><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="vous@exemple.com" className="h-11 w-full rounded-lg border border-hm-border bg-hm-bg pl-10 pr-3 text-sm text-hm-text outline-none transition placeholder:text-hm-muted/60 focus:border-hm-gold" required /></div></label>
            <label className="block text-sm text-hm-muted">Mot de passe<div className="relative mt-2"><LockKeyhole className="absolute left-3 top-3 text-hm-muted" size={17} /><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="8 caractères minimum" className="h-11 w-full rounded-lg border border-hm-border bg-hm-bg pl-10 pr-3 text-sm text-hm-text outline-none transition placeholder:text-hm-muted/60 focus:border-hm-gold" minLength={6} required /></div></label>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            {success ? <p className="text-sm text-green-400">{success}</p> : null}
            <button type="submit" disabled={isLoading} className="h-11 w-full rounded-lg bg-hm-text text-sm font-semibold text-hm-bg transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70">{isLoading ? "Création..." : "Créer mon compte"}</button>
          </form>
          <p className="mt-8 border-t border-hm-border pt-6 text-center text-sm text-hm-muted">Vous avez déjà un compte ? <Link href="/login" className="font-medium text-hm-gold hover:underline">Se connecter</Link></p>
        </div>
      </div>
    </main>
  );
}
