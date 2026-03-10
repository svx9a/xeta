import { API_BASE_URL } from "../constants";

type RevenuePoint = { name: string; revenue: number };

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchRevenueStream(): Promise<RevenuePoint[]> {
  const data = await getJson<{ data: RevenuePoint[] }>("/api/analytics/revenue-stream");
  return data?.data ?? [];
}

export async function fetchRoutingPreview(): Promise<
  { provider: string; fee_pct: number; fee_fixed: number; success_rate: number; score: number }[]
> {
  const data = await getJson<{ data: unknown[] }>("/api/routing/preview");
  return data?.data ?? [];
}

