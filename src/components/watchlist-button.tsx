"use client";

import { Check, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import type { DemoTitle } from "@/lib/demo-content";
import { readWatchlist, toggleWatchlist } from "@/features/watchlist/watchlist-service";

export function WatchlistButton({ item }: { item: DemoTitle }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = readWatchlist();
    setSaved(stored.some((entry) => entry.title === item.title));
  }, [item.title]);

  function handleToggle() {
    const nextSaved = toggleWatchlist(item);
    setSaved(nextSaved);
  }

  return (
    <button onClick={handleToggle} aria-label={saved ? `Retirer ${item.title} de la liste` : `Ajouter ${item.title} à la liste`} className={`grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition ${saved ? "border-hm-gold bg-hm-gold text-hm-bg" : "border-white/30 bg-black/30 text-hm-text hover:border-white"}`}>
      {saved ? <Check size={17} /> : <Plus size={17} />}
    </button>
  );
}
