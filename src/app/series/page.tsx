import Link from "next/link";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { MediaGrid } from "@/components/media-grid";
import { demoSeries } from "@/lib/demo-content";

export default function SeriesPage() {
  return (
    <main className="min-h-screen bg-hm-bg px-5 py-6 sm:px-8 lg:px-10">
      <header className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm text-hm-muted transition hover:text-hm-text"><ArrowLeft size={17} /> Accueil</Link>
        <Link href="/" className="inline-flex items-center"><img src="/logo.svg" alt="HM(Movie)" className="h-9 w-auto" /></Link>
        <button aria-label="Rechercher" className="grid h-9 w-9 place-items-center rounded-full text-hm-muted transition hover:bg-hm-surface hover:text-hm-text"><Search size={18} /></button>
      </header>
      <section className="mx-auto max-w-7xl pb-20 pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-hm-gold">Séries originales</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4 border-b border-hm-border pb-6">
          <div><h1 className="font-display text-4xl font-bold tracking-tight text-hm-text sm:text-5xl">Séries</h1><p className="mt-3 max-w-lg text-sm leading-6 text-hm-muted">Des saisons entières à dévorer, avec de nouveaux épisodes chaque semaine.</p></div>
          <button className="flex items-center gap-2 rounded-full border border-hm-border px-4 py-2.5 text-sm text-hm-muted transition hover:border-hm-text hover:text-hm-text"><SlidersHorizontal size={16} /> Filtrer</button>
        </div>
        <div className="mt-10"><MediaGrid items={demoSeries} /></div>
      </section>
    </main>
  );
}
