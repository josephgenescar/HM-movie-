import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "HM(Movie) — Films & Séries en streaming",
  description:
    "HM(Movie) — plateforme de streaming premium : films, séries, épisodes, recommandations et plus, avec plan gratuit et Premium."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-hm-bg text-hm-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
