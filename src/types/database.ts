/**
 * Ce fichier sera remplacé à l'Étape 2/3 par le résultat de :
 *
 *   supabase gen types typescript --project-id <project-id> > src/types/database.ts
 *
 * Placeholder minimal pour que le projet compile dès maintenant.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
