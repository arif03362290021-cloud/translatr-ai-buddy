export type HistoryItem = {
  id: string;
  source: string;
  target: string;
  input: string;
  output: string;
  createdAt: number;
};

const KEY = "ai-translator-history";
const LIMIT = 20;

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed.slice(0, LIMIT) : [];
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, LIMIT)));
  } catch {
    /* storage unavailable — history is a non-critical enhancement */
  }
}

export function addHistory(items: HistoryItem[], item: HistoryItem): HistoryItem[] {
  const next = [item, ...items.filter((i) => !(i.input === item.input && i.target === item.target))];
  const trimmed = next.slice(0, LIMIT);
  saveHistory(trimmed);
  return trimmed;
}

export function removeHistory(items: HistoryItem[], id: string): HistoryItem[] {
  const next = items.filter((i) => i.id !== id);
  saveHistory(next);
  return next;
}
