"use client";

import { Bell, ChevronRight, CirclePlay, Search, LogOut, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteLogo } from "@/components/site-logo";
import { AdBanner } from "@/components/ads/ad-banner";
import { useAuth } from "@/hooks/use-auth";
import { getRecentHistory, type WatchHistoryItem } from "@/features/watchlist/watchlist-service";

const trending = [
  {
    title: "The Silent Hour",
    meta: "2024 · Thriller",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=85"
  },
  {
    title: "Night Shift",
    meta: "2024 · Action",
    image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=85"
  },
  {
    title: "Northbound",
    meta: "2023 · Drama",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=85"
  },
  {
    title: "After the Rain",
    meta: "2024 · Romance",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=85"
  }
];

const originals = [
  {
    title: "City of Echoes",
    meta: "S1 · 8 épisodes",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=800&q=85"
  },
  {
    title: "Red Horizon",
    meta: "S2 · 10 épisodes",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=85"
  },
  {
    title: "The Last Signal",
    meta: "S1 · 6 épisodes",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=800&q=85"
  },
  {
    title: "Paper Moons",
    meta: "S1 · 8 épisodes",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=85"
  }
];

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ContentRow({
  title,
  items,
  accent = false
}: {
  title: string;
  items: typeof trending;
  accent?: boolean;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-hm-text sm:text-2xl">{title}</h2>
        <Link href={title.includes("séries") ? "/series" : "/movies"} className="flex items-center gap-1 text-sm font-medium text-hm-muted transition hover:text-hm-text">
          Tout voir <ChevronRight size={16} />
        </Link>
      </div>
      <div className="hm-row flex snap-x gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <Link href={`/watch/${slugify(item.title)}`} className="group min-w-[190px] snap-start sm:min-w-[230px]" key={item.title}>
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-hm-surface">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
              {accent && <span className="absolute left-3 top-3 rounded-full bg-hm-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-hm-bg">Original</span>}
              <span aria-hidden="true" className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-hm-text text-hm-bg opacity-0 transition group-hover:opacity-100">
                <CirclePlay size={17} fill="currentColor" />
              </span>
            </div>
            <h3 className="mt-3 truncate font-medium text-hm-text">{item.title}</h3>
            <p className="mt-1 text-xs text-hm-muted">{item.meta}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { user, loading, signOut } = useAuth();
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getRecentHistory(4));
  }, []);

  return (
    <main className="min-h-screen !bg-[#0a0a0c] px-4 py-4 !text-[#f5f5f7] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[10px] border border-hm-border !bg-[#0a0a0c] shadow-[0_18px_80px_rgba(0,0,0,0.45)]">
        <header className="flex items-center justify-between px-4 pb-2 pt-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 text-[13px] text-hm-muted">
            <Link href="/" className="transition hover:text-hm-text">Accueil</Link>
            <Link href="/movies" className="transition hover:text-hm-text">Films</Link>
            <Link href="/series" className="transition hover:text-hm-text">Séries</Link>
            <Link href="/premium" className="transition hover:text-hm-text">Premium</Link>
            <Link href="/watchlist" className="transition hover:text-hm-text">Ma liste</Link>
            <Link href="/ai" className="transition hover:text-hm-text">AI Studio</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/notifications" aria-label="Notifications" className="grid h-10 w-10 place-items-center rounded-full border border-hm-border bg-hm-surface text-hm-text transition hover:border-hm-accent">
              <Bell size={18} />
            </Link>

            {loading ? (
              <div className="h-10 w-20 animate-pulse rounded-full bg-hm-surface" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile" className="inline-flex items-center gap-2 rounded-full border border-hm-border bg-hm-surface px-3 py-2 text-sm font-medium text-hm-text transition hover:border-hm-accent">
                  <UserCircle2 size={16} />
                  <span className="max-w-[120px] truncate">{user.email}</span>
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="grid h-10 w-10 place-items-center rounded-full border border-hm-border bg-hm-surface text-hm-text transition hover:border-hm-accent"
                  aria-label="Se déconnecter"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="rounded-full border border-hm-border bg-hm-surface px-4 py-2 text-sm font-medium text-hm-text transition hover:border-hm-accent">Se connecter</Link>
            )}
          </div>
        </header>

        <section className="px-4 pb-10 pt-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 overflow-hidden">
              <SiteLogo className="h-[clamp(14rem,30vw,24rem)] w-[clamp(14rem,30vw,24rem)]" />
            </div>
            <div className="hidden flex-shrink-0 items-center gap-3 sm:flex">
              <Link href="/search" aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full border border-hm-border bg-hm-surface text-hm-text transition hover:border-hm-accent">
                <Search size={18} />
              </Link>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-[15px] text-hm-muted sm:gap-5">
            <Link href="/" className="transition hover:text-hm-text">Accueil</Link>
            <Link href="/movies" className="transition hover:text-hm-text">Films</Link>
            <Link href="/series" className="transition hover:text-hm-text">Séries</Link>
            <Link href="/premium" className="transition hover:text-hm-text">Premium</Link>
            <Link href="/watchlist" className="transition hover:text-hm-text">Ma liste</Link>
            <Link href="/ai" className="transition hover:text-hm-text">AI Studio</Link>
          </div>

          <div className="mt-8 flex items-center gap-4 sm:mt-10">
            <Link href="/movies" className="flex items-center gap-3 rounded-full bg-hm-accent px-5 py-4 text-[18px] font-medium text-white shadow-[0_8px_28px_rgba(142,27,46,0.35)] transition hover:bg-hm-accent-hover">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-hm-accent">
                <CirclePlay size={16} fill="currentColor" />
              </span>
              Explorer maintenant
            </Link>
            <Link href="/premium" className="rounded-full border border-hm-border px-5 py-4 text-[18px] font-medium text-hm-text transition hover:border-hm-accent hover:bg-hm-surface">En savoir plus</Link>
          </div>

          <div className="mt-10 max-w-5xl text-[clamp(2rem,4vw,4.1rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-hm-text">
            Le cinéma,
            <br />
            à votre rythme.
          </div>

          <p className="mt-6 max-w-[1100px] text-[clamp(1.1rem,2vw,2rem)] leading-[1.4] text-hm-muted">
            Des films qui restent avec vous. Découvrez des histoires fortes, des séries captivantes et vos prochains favoris.
          </p>

          <div className="mt-10 grid max-w-3xl gap-4 border-t border-hm-border pt-6 sm:grid-cols-3">
            <div>
              <p className="text-[3rem] font-semibold leading-none tracking-[-0.06em] text-hm-text">10k+</p>
              <p className="mt-2 text-[1.1rem] text-hm-muted">heures de divertissement</p>
            </div>
            <div>
              <p className="text-[3rem] font-semibold leading-none tracking-[-0.06em] text-hm-text">4K</p>
              <p className="mt-2 text-[1.1rem] text-hm-muted">qualité disponible</p>
            </div>
            <div>
              <p className="text-[3rem] font-semibold leading-none tracking-[-0.06em] text-hm-text">Sans engagement</p>
              <p className="mt-2 text-[1.1rem] text-hm-muted">regardez quand vous voulez</p>
            </div>
          </div>
        </section>

        <section className="space-y-12 px-4 pb-16 sm:px-6 lg:px-8">
          <ContentRow title="Films tendance" items={trending} />
          <ContentRow title="Nos séries originales" items={originals} accent />

          <div className="pt-2">
            <AdBanner placement="banner" />
          </div>

          {history.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-end justify-between">
                <h2 className="text-xl font-semibold tracking-tight text-hm-text sm:text-2xl">Continuez à regarder</h2>
                <Link href="/watchlist" className="flex items-center gap-1 text-sm font-medium text-hm-muted transition hover:text-hm-text">Voir ma liste <ChevronRight size={16} /></Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {history.map((item) => (
                  <Link key={`${item.title}-${item.watchedAt}`} href={`/watch/${item.slug}`} className="group block">
                    <div className="relative overflow-hidden rounded-xl border border-hm-border bg-hm-surface">
                      <img src={item.image} alt={item.title} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute inset-x-3 bottom-3">
                        <p className="truncate text-sm font-medium text-hm-text">{item.title}</p>
                        <p className="text-[11px] text-hm-muted">{item.meta}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section id="premium" className="rounded-2xl border border-[#8e1b2e]/60 bg-[linear-gradient(135deg,#35101a,#151517_58%,#0d0d0f)] px-6 py-10 text-white shadow-[0_12px_40px_rgba(142,27,46,0.18)] sm:px-10">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#e05262]">HM(Movie) Premium</p>
            <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Plus de cinéma, sans limites.</h2>
                <p className="mt-3 max-w-xl text-white/70">Profitez d&apos;un catalogue complet, de la qualité 4K et du visionnage sans publicité.</p>
              </div>
              <Link href="/premium" className="inline-flex w-fit rounded-full bg-hm-accent px-5 py-3 font-medium text-white transition hover:bg-hm-accent-hover">Découvrir Premium</Link>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
