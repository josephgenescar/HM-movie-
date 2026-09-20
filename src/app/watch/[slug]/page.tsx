"use client";

import Link from "next/link";
import { ArrowLeft, Check, CirclePlay, Clock3, Crown, Lock, Plus, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { hasPremiumAccess } from "@/features/subscriptions/subscription-service";
import { addWatchHistory } from "@/features/watchlist/watchlist-service";
import { demoMovies, demoSeries, type DemoTitle } from "@/lib/demo-content";

type WatchPageProps = {
  params: { slug: string };
};

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function findTitle(slug: string): DemoTitle {
  return [...demoMovies, ...demoSeries].find((item) => slugify(item.title) === slug) ?? demoMovies[0]!;
}

export default function WatchPage({ params }: WatchPageProps) {
  const item = findTitle(params.slug);
  const isSeries = item.meta.includes("épisodes");
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const isLocked = Boolean(item.premium) && !premiumUnlocked;

  useEffect(() => {
    async function syncAccess() {
      const allowed = await hasPremiumAccess();
      setPremiumUnlocked(allowed);
      setLoading(false);
    }

    syncAccess();
  }, []);

  useEffect(() => {
    if (!loading && !isLocked) {
      addWatchHistory(item, 0);
    }
  }, [loading, isLocked, item]);

  return (
    <main className="min-h-screen bg-hm-bg px-5 py-6 text-hm-text sm:px-8 lg:px-10">
      <header className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href={isSeries ? "/series" : "/movies"} className="flex items-center gap-2 text-sm text-hm-muted transition hover:text-hm-text"><ArrowLeft size={17} /> Retour</Link>
        <Link href="/" className="inline-flex items-center"><img src="/logo.svg" alt="HM(Movie)" className="h-9 w-auto" /></Link>
        <span className="text-xs uppercase tracking-[0.2em] text-hm-muted">Lecture</span>
      </header>

      <section className="mx-auto max-w-7xl pb-20 pt-10 sm:pt-14">
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-hm-border bg-black shadow-2xl shadow-black/30">
          {isLocked ? (
            <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(142,27,46,0.28),_rgba(10,10,12,0.94))] text-center">
              <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-hm-gold/15 text-hm-gold"><Lock size={28} /></div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-hm-gold">Contenu Premium</p>
              <h2 className="mt-3 text-3xl font-bold text-hm-text">Abonnez-vous pour regarder ce titre</h2>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link href="/premium" className="inline-flex items-center gap-2 rounded-full bg-hm-gold px-5 py-3 text-sm font-semibold text-hm-bg"><Crown size={16} /> Découvrir Premium</Link>
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-hm-border px-5 py-3 text-sm font-medium text-hm-text">Se connecter</Link>
              </div>
            </div>
          ) : (
            <>
              <video className="h-full w-full object-cover" controls poster={item.image} preload="metadata">
                <source src="https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
              <div className="pointer-events-none absolute left-5 top-5 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur">HM(Movie) preview</div>
            </>
          )}
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-hm-muted">
              <span className="rounded-full bg-hm-accent/20 px-3 py-1 text-hm-gold">{item.genre}</span>
              <span>{item.meta}</span>
              {item.premium && <span className="inline-flex items-center gap-1 rounded-full border border-hm-gold/40 bg-hm-gold/10 px-2 py-1 text-hm-gold"><Crown size={12} /> Premium</span>}
              <span className="flex items-center gap-1"><Clock3 size={14} /> HD</span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">{item.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-hm-muted">Une histoire qui vous emmène ailleurs. Installez-vous, lancez la lecture et découvrez un univers pensé pour les spectateurs qui aiment ressentir chaque scène.</p>
            {!isLocked && (
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="flex items-center gap-2 rounded-full bg-hm-text px-5 py-3 text-sm font-semibold text-hm-bg"><CirclePlay size={17} fill="currentColor" /> Reprendre</button>
                <button className="flex items-center gap-2 rounded-full border border-hm-border px-5 py-3 text-sm text-hm-text transition hover:border-hm-text"><Plus size={17} /> Ma liste</button>
                <button aria-label="Partager" className="grid h-11 w-11 place-items-center rounded-full border border-hm-border text-hm-muted transition hover:border-hm-text hover:text-hm-text"><Share2 size={17} /></button>
              </div>
            )}
          </div>
          <aside className="rounded-xl border border-hm-border bg-hm-surface/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-gold">À propos</p>
            <dl className="mt-5 space-y-4 text-sm"><div><dt className="text-hm-muted">Langue</dt><dd className="mt-1 text-hm-text">Français · Original</dd></div><div><dt className="text-hm-muted">Qualité</dt><dd className="mt-1 flex items-center gap-2 text-hm-text"><Check size={15} className="text-hm-gold" /> 1080p disponible</dd></div><div><dt className="text-hm-muted">Accessibilité</dt><dd className="mt-1 text-hm-text">Sous-titres inclus</dd></div></dl>
          </aside>
        </div>

        {!isLocked && isSeries && <section className="mt-14 border-t border-hm-border pt-8"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Épisodes</h2><span className="text-sm text-hm-muted">Saison 1</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((episode) => <button key={episode} className="flex items-center gap-3 rounded-lg border border-hm-border bg-hm-surface/50 p-3 text-left transition hover:border-hm-accent"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-hm-accent/20 text-sm font-semibold text-hm-gold">{episode}</span><span><strong className="block text-sm font-medium">Épisode {episode}</strong><small className="text-xs text-hm-muted">42 min · Disponible</small></span></button>)}</div></section>}
      </section>
    </main>
  );
}
