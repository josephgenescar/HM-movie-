import { createBrowserClient } from "@supabase/ssr";
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
 * Client Supabase pour le navigateur (Client Components).
 * N'utilise que la clé publique (anon) — jamais la service_role_key ici.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn("Supabase environment variables are missing. Falling back to demo mode.");
    const missing = [
      !url ? "NEXT_PUBLIC_SUPABASE_URL" : null,
      !anonKey ? "NEXT_PUBLIC_SUPABASE_ANON_KEY" : null
    ].filter(Boolean).join(" and ");

    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({
          data: { user: null, session: null },
          error: new Error(`Missing ${missing}. Add it to .env.local and restart the dev server.`)
        }),
        signUp: async () => ({
          data: { user: null, session: null },
          error: new Error(`Missing ${missing}. Add it to .env.local and restart the dev server.`)
        }),
        onAuthStateChange: (_event: string, _session: any) => ({
          data: { subscription: { unsubscribe: () => undefined } }
        }),
        signOut: async () => ({ error: null })
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

  return createBrowserClient<Database>(url, anonKey);
}
