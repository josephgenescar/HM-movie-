import type { DemoTitle } from "@/lib/demo-content";

const WATCHLIST_KEY = "hm-movie-watchlist";
const HISTORY_KEY = "hm-movie-history";

export type WatchHistoryItem = DemoTitle & {
  slug: string;
  watchedAt: string;
  progress: number;
};

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function readWatchlist(): DemoTitle[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(WATCHLIST_KEY);
    return raw ? (JSON.parse(raw) as DemoTitle[]) : [];
  } catch {
    return [];
  }
}

export function saveWatchlist(items: DemoTitle[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
}

export function toggleWatchlist(item: DemoTitle) {
  const current = readWatchlist();
  const exists = current.some((entry) => entry.title === item.title);
  const next = exists ? current.filter((entry) => entry.title !== item.title) : [...current, item];
  saveWatchlist(next);
  return !exists;
}

export function getRecentHistory(limit = 4): WatchHistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    const items = raw ? (JSON.parse(raw) as WatchHistoryItem[]) : [];
    return [...items].sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()).slice(0, limit);
  } catch {
    return [];
  }
}

export function addWatchHistory(item: DemoTitle, progress = 0) {
  if (typeof window === "undefined") return;

  const next: WatchHistoryItem = {
    ...item,
    slug: slugify(item.title),
    watchedAt: new Date().toISOString(),
    progress
  };

  const current = getRecentHistory(20);
  const filtered = current.filter((entry) => entry.title !== item.title);
  const updated = [next, ...filtered].slice(0, 20);

  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}
