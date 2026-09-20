import { createClient } from "@/lib/supabase/client";

export type AuthCredentials = {
  email: string;
  password: string;
};

export type SignUpInput = AuthCredentials & {
  fullName: string;
};

export async function signInWithEmail({ email, password }: AuthCredentials) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signUpWithEmail({ email, password, fullName }: SignUpInput) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: "user"
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signOutUser() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
}

export async function getCurrentSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
}
