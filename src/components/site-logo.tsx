import Link from "next/link";

export function SiteLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center justify-center rounded-md transition hover:opacity-90 ${className ?? ""}`}
      aria-label="HM(Movie) home"
    >
      <img
        src="/logo.svg"
        alt="HM(Movie)"
        draggable={false}
        className={className ? "h-full w-full object-contain" : compact ? "h-9 w-auto" : "h-12 w-auto sm:h-14"}
      />
    </Link>
  );
}
