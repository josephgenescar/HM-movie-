# HM(Movie)

Plateforme de streaming (films, séries, épisodes) — Free + Premium, Supabase backend.

## Étape 1 — Architecture (terminée)

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Structure de dossiers par feature (`src/features/{auth,movies,series,player,subscriptions,ads,watchlist,admin}`)
- Clients Supabase séparés :
  - `src/lib/supabase/client.ts` → navigateur (clé anon)
  - `src/lib/supabase/server.ts` → Server Components / Route Handlers (clé anon + session cookie)
  - `src/lib/supabase/admin.ts` → **serveur uniquement**, clé `service_role`, jamais importable côté client (protégé par `server-only`)
- `src/types/domain.ts` : types métier pour tout le schéma prévu (movies, series, seasons, episodes, subscriptions, payments, ads, watchlist, watch_history, notifications)
- `src/types/database.ts` : placeholder, sera régénéré depuis Supabase après les migrations (Étape 2/3)
- Palette de marque définie dans `tailwind.config.ts` (`hm-bg`, `hm-accent` bordeaux, `hm-gold`) — identité distincte de Netflix
- `.env.example` : variables nécessaires, aucun secret commité

## Installation locale

```bash
npm install
cp .env.example .env.local   # puis renseigner les clés Supabase
npm run dev
```

## Prochaines étapes

1. ~~Architecture du projet~~ ✅
2. Schéma Supabase/PostgreSQL (tables listées dans `domain.ts`)
3. Migrations SQL
4. Politiques RLS
5. Authentification (Supabase Auth)
6. Design system (Button, MovieCard, Navbar, VideoPlayer, etc.)
7. Homepage (Hero + carrousels)
8. Pages Movies / Series
9. Video Player
10. Watch History / Watchlist
11. Premium / Subscriptions
12. Ads System (`AdService`)
13. Admin Dashboard
14. Storage / upload management
15. Sécurité / routes protégées
16. Données de démonstration
17-20. Tests, corrections, optimisation, déploiement
