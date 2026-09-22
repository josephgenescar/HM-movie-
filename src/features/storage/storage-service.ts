import { createClient } from "@/lib/supabase/client";

export type StorageAssetType = "poster" | "video" | "trailer" | "banner";

export interface StorageAsset {
  id: string;
  name: string;
  path: string;
  type: StorageAssetType;
  size: number;
  url: string;
  createdAt: string;
}

const fallbackAssets: StorageAsset[] = [
  {
    id: "asset-poster-1",
    name: "the-silent-hour.jpg",
    path: "posters/the-silent-hour.jpg",
    type: "poster",
    size: 2.4,
    url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=85",
    createdAt: "2026-09-18T10:00:00.000Z"
  },
  {
    id: "asset-video-1",
    name: "mt-baker.mp4",
    path: "videos/mt-baker.mp4",
    type: "video",
    size: 18.2,
    url: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    createdAt: "2026-09-17T16:00:00.000Z"
  }
];

function inferAssetType(name: string): StorageAssetType {
  const lower = name.toLowerCase();

  if (lower.includes("poster") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png")) return "poster";
  if (lower.includes("trailer") || lower.includes("preview")) return "trailer";
  if (lower.includes("banner")) return "banner";
  return "video";
}

export function getPublicUrl(path: string, bucketName = "media") {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return `https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=85`;
  }

  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucketName}/${encodeURIComponent(path)}`;
}

type StorageListItem = {
  id?: string;
  name: string;
  metadata?: { size?: number };
  created_at?: string;
};

export async function listStorageAssets(): Promise<StorageAsset[]> {
  const supabase = createClient();

  try {
    const folders: StorageAssetType[] = ["poster", "video", "trailer", "banner"];
    const results = await Promise.all(folders.map(async (folder) => {
      const { data, error } = await supabase.storage.from("media").list(folder, { limit: 100 });
      return { folder, data: data as StorageListItem[] | null, error };
    }));
    const assets = results.flatMap(({ folder, data, error }) => {
      if (error || !data?.length) return [];

      return data.filter((item) => item.name).map((item, index) => ({
        id: item.id ?? `${folder}-${item.name}-${index}`,
        name: item.name,
        path: `${folder}/${item.name}`,
        type: folder,
        size: (item.metadata?.size ?? 0) / 1024 / 1024,
        url: getPublicUrl(`${folder}/${item.name}`),
        createdAt: item.created_at ?? new Date().toISOString()
      }));
    });

    if (!assets.length) {
      return fallbackAssets;
    }

    return assets;
  } catch {
    return fallbackAssets;
  }
}

export async function uploadAsset(file: File, kind: StorageAssetType, customPath?: string) {
  const supabase = createClient();
  const storagePath = customPath ?? `${kind}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      path: storagePath,
      url: URL.createObjectURL(file),
      kind
    };
  }

  const { error } = await supabase.storage.from("media").upload(storagePath, file, {
    cacheControl: "3600",
    upsert: false
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    path: storagePath,
    url: getPublicUrl(storagePath),
    kind
  };
}
