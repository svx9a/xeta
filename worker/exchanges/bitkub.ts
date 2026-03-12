/**
 * Bitkub API client (Workers-compatible).
 *
 * Notes:
 * - Public endpoints require no signing.
 * - Private endpoints use HMAC-SHA256 over: timestamp + method + path + query + body
 *   and headers: X-BTK-APIKEY, X-BTK-TIMESTAMP, X-BTK-SIGN.
 */

export type BitkubCredentials = {
  apiKey: string;
  apiSecret: string;
};

export type BitkubClientOptions = {
  baseUrl?: string;
  timeoutMs?: number;
};

export type BitkubRequestOptions = {
  query?: URLSearchParams;
  body?: unknown;
  auth?: boolean;
  timestampMs?: number;
};

type BitkubErrorResponse = {
  error?: number | string;
  message?: string;
};

function encodeUtf8(text: string) {
  return new TextEncoder().encode(text);
}

function hexFromBytes(bytes: Uint8Array) {
  let out = "";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}

async function hmacSha256Hex(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encodeUtf8(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encodeUtf8(payload));
  return hexFromBytes(new Uint8Array(sig));
}

function buildSortedQueryString(params?: URLSearchParams) {
  if (!params) return "";
  const pairs: Array<[string, string]> = [];
  params.forEach((value, key) => pairs.push([key, value]));
  pairs.sort((a, b) => (a[0] === b[0] ? a[1].localeCompare(b[1]) : a[0].localeCompare(b[0])));
  const sorted = new URLSearchParams();
  for (const [k, v] of pairs) sorted.append(k, v);
  const qs = sorted.toString();
  return qs ? `?${qs}` : "";
}

function safeJsonStringify(value: unknown) {
  return value === undefined ? "" : JSON.stringify(value);
}

export class BitkubClient {
  private baseUrl: string;
  private timeoutMs: number;
  private creds?: BitkubCredentials;

  constructor(options?: BitkubClientOptions & { credentials?: BitkubCredentials }) {
    this.baseUrl = (options?.baseUrl || "https://api.bitkub.com").replace(/\/+$/, "");
    this.timeoutMs = options?.timeoutMs ?? 15_000;
    this.creds = options?.credentials;
  }

  withCredentials(credentials: BitkubCredentials) {
    return new BitkubClient({ baseUrl: this.baseUrl, timeoutMs: this.timeoutMs, credentials });
  }

  async request<T = unknown>(method: string, path: string, opts?: BitkubRequestOptions): Promise<T> {
    const queryString = buildSortedQueryString(opts?.query);
    const bodyString = opts?.body ? safeJsonStringify(opts.body) : "";

    const url = `${this.baseUrl}${path}${queryString}`;
    const headers: Record<string, string> = { Accept: "application/json" };

    if (opts?.auth) {
      if (!this.creds?.apiKey || !this.creds?.apiSecret) {
        throw new Error("BITKUB_MISSING_CREDENTIALS");
      }
      const timestamp = (opts.timestampMs ?? Date.now()).toString();
      const canonicalPayload = `${timestamp}${method.toUpperCase()}${path}${queryString}${bodyString}`;
      const sign = await hmacSha256Hex(this.creds.apiSecret, canonicalPayload);

      headers["X-BTK-APIKEY"] = this.creds.apiKey;
      headers["X-BTK-TIMESTAMP"] = timestamp;
      headers["X-BTK-SIGN"] = sign;
    }

    let body: string | undefined;
    if (bodyString) {
      headers["Content-Type"] = "application/json";
      body = bodyString;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await fetch(url, { method, headers, body, signal: controller.signal });
      const text = await res.text();

      if (!res.ok) {
        let parsed: BitkubErrorResponse | null = null;
        try {
          parsed = text ? (JSON.parse(text) as BitkubErrorResponse) : null;
        } catch {}
        const details = parsed?.message || parsed?.error || text.slice(0, 500) || res.statusText;
        throw new Error(`BITKUB_UPSTREAM_${res.status}: ${details}`);
      }

      if (!text) return {} as T;
      return JSON.parse(text) as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  // ---- Public helpers ----

  async publicSymbols() {
    return this.request("GET", "/api/v3/market/symbols");
  }

  async publicServerTime() {
    return this.request("GET", "/api/v3/servertime");
  }

  async publicTicker(sym?: string) {
    const query = sym ? new URLSearchParams({ sym }) : undefined;
    return this.request("GET", "/api/v3/market/ticker", { query });
  }

  // ---- Private helper example ----

  async myOrderHistory(sym: string) {
    const query = new URLSearchParams({ sym });
    return this.request("GET", "/api/v3/market/my-order-history", { auth: true, query });
  }
}
