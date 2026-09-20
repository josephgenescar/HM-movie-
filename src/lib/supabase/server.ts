import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
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
 * Client Supabase pour le serveur (Server Components, Route Handlers).
 * Utilise la clé publique (anon) + la session de l'utilisateur via cookies.
 * Le RLS Postgres reste la seule ligne de défense pour les données —
 * ce client n'a jamais accès à la service_role_key.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn("Supabase environment variables are missing on the server. Falling back to demo mode.");

    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: (_event: string, _session: any) => ({
          data: { subscription: { unsubscribe: () => undefined } }
        })
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

  const cookieStore = cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Appelé depuis un Server Component — ignoré, géré par le middleware.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // idem
        }
      }
    }
  });
}
