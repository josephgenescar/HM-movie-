"use client";

import Link from "next/link";
import { ArrowLeft, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { MediaGrid } from "@/components/media-grid";
import type { DemoTitle } from "@/lib/demo-content";

const STORAGE_KEY = "hm-movie-watchlist";

export default function WatchlistPage() {
  const [items, setItems] = useState<DemoTitle[]>([]);

  useEffect(() => {
    setItems(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as DemoTitle[]);
  }, []);

  return (
    <main className="min-h-screen bg-hm-bg px-5 py-6 sm:px-8 lg:px-10">
      <header className="mx-auto flex max-w-7xl items-center justify-between"><Link href="/" className="flex items-center gap-2 text-sm text-hm-muted transition hover:text-hm-text"><ArrowLeft size={17} /> Accueil</Link><Link href="/" className="font-display text-2xl font-bold tracking-tight text-hm-text">HM<span className="text-hm-accent">(Movie)</span></Link><span className="text-xs uppercase tracking-[0.2em] text-hm-muted">Ma liste</span></header>
      <section className="mx-auto max-w-7xl pb-20 pt-20"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-hm-gold">Votre sélection</p><h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-hm-text sm:text-5xl">Ma liste</h1><p className="mt-3 text-sm text-hm-muted">Retrouvez les contenus que vous souhaitez regarder plus tard.</p>{items.length > 0 ? <div className="mt-10"><MediaGrid items={items} /></div> : <div className="mt-12 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-hm-border bg-hm-surface/30 px-6 text-center"><Bookmark size={30} className="text-hm-gold" /><h2 className="mt-4 text-lg font-semibold text-hm-text">Votre liste est vide</h2><p className="mt-2 max-w-sm text-sm leading-6 text-hm-muted">Ajoutez des films ou séries depuis les catalogues pour les retrouver ici.</p><Link href="/movies" className="mt-6 rounded-full bg-hm-text px-5 py-3 text-sm font-semibold text-hm-bg">Explorer les films</Link></div>}</section>
    </main>
  );
}
