export const colors = {
  primary: "#211A73",
  secondary: "#CDA54E",
  text: "#302D39",
  accent: "#6B65C4",
  lilac: "#EEEAF8",
  cream: "#F9F5EC",
  sand: "#F0EDE7",
  white: "#FFFFFF",
} as const;

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data;
    if (Array.isArray(inner)) return inner as T[];
  }
  return [];
}

export function unwrapCount(payload: unknown, fallback = 0): number {
  if (payload && typeof payload === "object" && "count" in payload) {
    const count = (payload as { count?: number }).count;
    if (typeof count === "number") return count;
  }
  return fallback;
}

export function unwrapMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: string }).message;
    if (message) return message;
  }
  return fallback;
}

export function unwrapEntity<T extends object>(payload: unknown): T | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
    return obj.data as T;
  }
  return payload as T;
}

export function unwrapPaged<T>(payload: unknown): { items: T[]; count: number } {
  return {
    items: unwrapList<T>(payload),
    count: unwrapCount(payload),
  };
}
