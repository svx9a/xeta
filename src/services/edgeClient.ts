import { API_BASE_URL } from "../constants";
import { Payout, PayoutStatus } from "../types";

type RevenuePoint = { name: string; revenue: number };
type SettlementRecord = {
  id: string;
  created_at: string;
  net_amount: number;
  currency?: string;
  status: string;
  payout_channel: string;
};

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

export async function pingApi(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/status`);
    return response.ok;
  } catch {
    return false;
  }
}

function normalizePayoutStatus(status: string): PayoutStatus {
  switch (status.toLowerCase()) {
    case "completed":
      return "completed";
    case "in_transit":
    case "in-transit":
      return "in_transit";
    case "pending":
      return "pending";
    case "failed":
      return "failed";
    default:
      return "completed";
  }
}

export async function fetchSettlements(): Promise<Payout[]> {
  const data = await getJson<{ data: SettlementRecord[] }>("/api/settlements");

  return (
    data?.data?.map((item) => ({
      id: item.id,
      date: item.created_at,
      amount: item.net_amount,
      currency: item.currency || "THB",
      status: normalizePayoutStatus(item.status),
      destination: item.payout_channel,
      transactionCount: 1,
    })) ?? []
  );
}

export async function fetchRoutingPreview(): Promise<
  { provider: string; fee_pct: number; fee_fixed: number; success_rate: number; score: number }[]
> {
  const data = await getJson<{ data: unknown[] }>("/api/routing/preview");
  return data?.data ?? [];
}
