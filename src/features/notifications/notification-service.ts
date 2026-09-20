export type NotificationType = "info" | "promo" | "success" | "warning";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;
}

const STORAGE_KEY = "hm-movie-notifications";

const fallbackNotifications: AppNotification[] = [
  {
    id: "notif-1",
    title: "Nouveau Premium",
    message: "Profitez de 30 % de réduction sur le plan Premium cette semaine.",
    type: "promo",
    createdAt: "2026-09-19T08:00:00.000Z",
    read: false
  },
  {
    id: "notif-2",
    title: "Nouvelle série",
    message: "City of Echoes est maintenant disponible en streaming.",
    type: "info",
    createdAt: "2026-09-18T10:30:00.000Z",
    read: false
  },
  {
    id: "notif-3",
    title: "Lecture terminée",
    message: "Vous avez fini la dernière saison de Northbound.",
    type: "success",
    createdAt: "2026-09-16T15:45:00.000Z",
    read: true
  }
];

export function readNotifications(): AppNotification[] {
  if (typeof window === "undefined") return fallbackNotifications;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallbackNotifications;

    const parsed = JSON.parse(raw) as AppNotification[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallbackNotifications;
  } catch {
    return fallbackNotifications;
  }
}

export function saveNotifications(items: AppNotification[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addNotification(item: Omit<AppNotification, "id" | "createdAt" | "read">) {
  const next: AppNotification = {
    id: `notif-${Date.now()}`,
    createdAt: new Date().toISOString(),
    read: false,
    ...item
  };

  const current = readNotifications();
  saveNotifications([next, ...current]);
  return next;
}

export function markAllNotificationsRead() {
  const current = readNotifications().map((item) => ({ ...item, read: true }));
  saveNotifications(current);
  return current;
}

export function getUnreadCount() {
  return readNotifications().filter((item) => !item.read).length;
}
