import { createClient } from "@/lib/supabase/client";
import type { StorageAssetType } from "@/features/storage/storage-service";

export type ContentType = "movie" | "series";
export type ContentStatus = "draft" | "published";

export type ContentItem = {
  id: string;
  title: string;
  slug: string;
  type: ContentType;
  description: string;
  genre: string;
  year: number | null;
  duration: string;
  posterUrl: string;
  videoUrl: string;
  trailerUrl: string;
  premium: boolean;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
};

export type ContentInput = Omit<ContentItem, "id" | "createdAt" | "updatedAt" | "slug"> & { id?: string };

type ContentRow = {
  id: string;
  title: string;
  slug: string;
  type: ContentType;
  description: string | null;
  genre: string | null;
  year: number | null;
  duration: string | null;
  poster_url: string | null;
  video_url: string | null;
  trailer_url: string | null;
  premium: boolean;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

const fallbackKey = "hm-admin-content";

function toItem(row: ContentRow): ContentItem {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    type: row.type,
    description: row.description ?? "",
    genre: row.genre ?? "",
    year: row.year,
    duration: row.duration ?? "",
    posterUrl: row.poster_url ?? "",
    videoUrl: row.video_url ?? "",
    trailerUrl: row.trailer_url ?? "",
    premium: row.premium,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function slugify(title: string) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function localItems(): ContentItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(fallbackKey) ?? "[]") as ContentItem[];
  } catch {
    return [];
  }
}

function saveLocalItems(items: ContentItem[]) {
  window.localStorage.setItem(fallbackKey, JSON.stringify(items));
}

export async function listContentItems(): Promise<ContentItem[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from("media_items").select("*").order("updated_at", { ascending: false });
    if (!error && data) return (data as ContentRow[]).map(toItem);
  } catch {
    // Use local demo persistence until Supabase is configured.
  }
  return localItems();
}

export async function listPublishedContent(type: ContentType): Promise<ContentItem[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from("media_items").select("*").eq("type", type).eq("status", "published").order("updated_at", { ascending: false });
    if (!error && data) return (data as ContentRow[]).map(toItem);
  } catch {
    // Fall back to local persistence.
  }
  return localItems().filter((item) => item.type === type && item.status === "published");
}

export async function saveContentItem(input: ContentInput): Promise<ContentItem> {
  const now = new Date().toISOString();
  const item: ContentItem = {
    ...input,
    id: input.id ?? crypto.randomUUID(),
    slug: slugify(input.title),
    createdAt: now,
    updatedAt: now
  };
  const supabase = createClient();
  const payload = {
    id: item.id,
    title: item.title,
    slug: item.slug,
    type: item.type,
    description: item.description,
    genre: item.genre,
    year: item.year,
    duration: item.duration,
    poster_url: item.posterUrl || null,
    video_url: item.videoUrl || null,
    trailer_url: item.trailerUrl || null,
    premium: item.premium,
    status: item.status
  };

  try {
    const { data, error } = await supabase.from("media_items").upsert(payload).select().single();
    if (!error && data) return toItem(data as ContentRow);
  } catch {
    // Use local persistence until the migration has been applied.
  }

  const items = localItems().filter((current) => current.id !== item.id);
  saveLocalItems([item, ...items]);
  return item;
}

export async function deleteContentItem(id: string) {
  const supabase = createClient();
  try {
    const { error } = await supabase.from("media_items").delete().eq("id", id);
    if (!error) return;
  } catch {
    // Use local persistence until Supabase is configured.
  }
  saveLocalItems(localItems().filter((item) => item.id !== id));
}

export function contentAssetKind(type: "poster" | "video" | "trailer"): StorageAssetType {
  return type;
}
