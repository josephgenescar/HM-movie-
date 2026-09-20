export type DemoTitle = {
  title: string;
  meta: string;
  genre: string;
  image: string;
  featured?: boolean;
  premium?: boolean;
};

export const demoMovies: DemoTitle[] = [
  {
    title: "The Silent Hour",
    meta: "2024 · 1h 58min",
    genre: "Thriller",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=85",
    featured: true,
    premium: true
  },
  {
    title: "Night Shift",
    meta: "2024 · 2h 04min",
    genre: "Action",
    image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=900&q=85",
    premium: true
  },
  {
    title: "Northbound",
    meta: "2023 · 1h 46min",
    genre: "Drama",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "After the Rain",
    meta: "2024 · 1h 52min",
    genre: "Romance",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Deep Focus",
    meta: "2022 · 1h 39min",
    genre: "Mystery",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Open Roads",
    meta: "2023 · 1h 44min",
    genre: "Adventure",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85"
  }
];

export const demoSeries: DemoTitle[] = [
  {
    title: "City of Echoes",
    meta: "S1 · 8 épisodes",
    genre: "Drama",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85",
    featured: true
  },
  {
    title: "Red Horizon",
    meta: "S2 · 10 épisodes",
    genre: "Sci-fi",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85",
    premium: true
  },
  {
    title: "The Last Signal",
    meta: "S1 · 6 épisodes",
    genre: "Thriller",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Paper Moons",
    meta: "S1 · 8 épisodes",
    genre: "Drama",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Second Nature",
    meta: "S1 · 7 épisodes",
    genre: "Documentary",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "The Crossing",
    meta: "S3 · 12 épisodes",
    genre: "Action",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85"
  }
];
