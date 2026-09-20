"use client";

import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { useState } from "react";
import { MediaGrid } from "@/components/media-grid";
import { demoMovies, demoSeries } from "@/lib/demo-content";

const allTitles = [...demoMovies, ...demoSeries];
const genres = ["Tous", "Action", "Drama", "Thriller", "Romance", "Sci-fi"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Tous");
  const filtered = allTitles.filter((item) => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) || item.genre.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (genre === "Tous" || item.genre === genre);
  });

  return (
    <main className="min-h-screen bg-hm-bg px-5 py-6 sm:px-8 lg:px-10"><header className="mx-auto flex max-w-7xl items-center justify-between"><Link href="/" className="flex items-center gap-2 text-sm text-hm-muted transition hover:text-hm-text"><ArrowLeft size={17} /> Accueil</Link><Link href="/" className="font-display text-2xl font-bold tracking-tight text-hm-text">HM<span className="text-hm-accent">(Movie)</span></Link><Link href="/watchlist" className="text-sm text-hm-muted transition hover:text-hm-text">Ma liste</Link></header><section className="mx-auto max-w-7xl pb-20 pt-20"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-hm-gold">Explorer le catalogue</p><h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-hm-text sm:text-5xl">Rechercher</h1><div className="relative mt-8 max-w-2xl"><Search className="absolute left-4 top-3.5 text-hm-muted" size={19} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Titre, genre..." className="h-12 w-full rounded-xl border border-hm-border bg-hm-surface pl-12 pr-4 text-sm text-hm-text outline-none transition placeholder:text-hm-muted/60 focus:border-hm-gold" /></div><div className="hm-row mt-6 flex gap-2 overflow-x-auto pb-2">{genres.map((item) => <button key={item} onClick={() => setGenre(item)} className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${genre === item ? "bg-hm-text font-semibold text-hm-bg" : "border border-hm-border text-hm-muted hover:border-hm-text hover:text-hm-text"}`}>{item}</button>)}</div><div className="mt-10">{filtered.length > 0 ? <MediaGrid items={filtered} /> : <div className="rounded-xl border border-dashed border-hm-border px-6 py-16 text-center text-sm text-hm-muted">Aucun contenu ne correspond à votre recherche.</div>}</div></section></main>
  );
}
