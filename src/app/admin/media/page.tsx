"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { UploadCloud, Film, Image as ImageIcon } from "lucide-react";
import { listStorageAssets, uploadAsset, type StorageAsset } from "@/features/storage/storage-service";

export default function AdminMediaPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [assets, setAssets] = useState<StorageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      setLoading(true);
      setAssets(await listStorageAssets());
      setLoading(false);
    }

    loadAssets();
  }, []);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const kind = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "poster" : "banner";
      const result = await uploadAsset(file, kind);
      setAssets((current) => [{
        id: `asset-${Date.now()}`,
        name: file.name,
        path: result.path,
        type: kind,
        size: file.size / 1024 / 1024,
        url: result.url,
        createdAt: new Date().toISOString()
      }, ...current]);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="rounded-2xl border border-hm-border bg-hm-surface/60 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-hm-text">Médias & uploads</h2>
        <Link href="/admin" className="text-sm text-hm-gold">Retour dashboard</Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full bg-hm-text px-4 py-2 text-sm font-medium text-hm-bg"
        >
          <UploadCloud size={16} />
          {uploading ? "Téléversement..." : "Ajouter un média"}
        </button>
        <input ref={inputRef} type="file" className="hidden" onChange={handleUpload} />
        <span className="text-sm text-hm-muted">Bucket principal : media</span>
      </div>

      {loading ? (
        <div className="text-sm text-hm-muted">Chargement des fichiers...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {assets.map((asset) => (
            <div key={asset.id} className="rounded-xl border border-hm-border bg-hm-bg p-4">
              <div className="mb-3 overflow-hidden rounded-lg border border-hm-border bg-hm-surface">
                {asset.type === "video" ? (
                  <div className="flex aspect-video items-center justify-center bg-hm-surface text-hm-gold">
                    <Film size={26} />
                  </div>
                ) : (
                  <img src={asset.url} alt={asset.name} className="h-40 w-full object-cover" />
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-hm-text">{asset.name}</p>
                  <p className="text-xs text-hm-muted">{asset.type} • {asset.size.toFixed(1)} MB</p>
                </div>
                <span className="inline-flex rounded-full bg-hm-gold/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-hm-gold">
                  {asset.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
