"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { signOutUser } from "@/features/auth/auth-service";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      setUser(session?.user ?? null);
      setLoading(false);
      void event;
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await signOutUser();
    setUser(null);
  }

  return {
    user,
    loading,
    signOut: handleSignOut
  };
}
