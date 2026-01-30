const BAN_KEY = "vault:banUntil";

export function getBanUntil(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(BAN_KEY);
  const value = raw ? Number(raw) : 0;
  return Number.isFinite(value) ? value : 0;
}

export function isBannedNow(): boolean {
  return Date.now() < getBanUntil();
}

export function banForMs(ms: number) {
  if (typeof window === "undefined") return;
  const until = Date.now() + ms;
  window.localStorage.setItem(BAN_KEY, String(until));
}

export function clearBan() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(BAN_KEY);
}
