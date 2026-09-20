import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

function createFallbackQueryBuilder<T = any>(data: T | null = null): any {
  return {
    select() {
      return this;
    },
    eq() {
      return this;
    },
    order() {
      return this;
    },
    limit() {
      return this;
    },
    maybeSingle() {
      return Promise.resolve({ data: null, error: null });
    },
    single() {
      return Promise.resolve({ data: null, error: null });
    },
    then(resolve: (value: { data: T | null; error: null }) => unknown) {
      resolve({ data, error: null });
    }
  };
}

/**
 * Client Supabase privilégié (service_role).
 *
 * ⚠️ SERVEUR UNIQUEMENT — jamais importé dans un Client Component,
 * jamais exposé au navigateur. Réservé aux Route Handlers / Server
 * Actions qui doivent contourner le RLS pour des opérations admin
 * précises (ex: générer une URL signée pour une vidéo Premium,
 * changer le rôle d'un utilisateur).
 *
 * Le package `server-only` fait échouer le build si ce fichier est
 * importé depuis du code client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.warn("Supabase service role environment variables are missing. Falling back to demo admin mode.");

    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null })
      },
      from: () => createFallbackQueryBuilder([]),
      storage: {
        from: () => ({
          list: async () => ({ data: [], error: null }),
          upload: async () => ({ error: null })
        })
      }
    } as any;
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
