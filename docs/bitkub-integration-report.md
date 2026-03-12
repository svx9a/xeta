# Bitkub technique → XETAPAY integration (non-competitive)

Goal: learn from Bitkub’s **API safety + reliability patterns** (request signing, time sync, clear public vs private boundaries) and apply them inside XETAPAY as a **liquidity/market-data connector**, not as an exchange competitor UI.

## What Bitkub does well (technique)

- **Strict separation**: public market endpoints vs private account/trading endpoints.
- **Stateless auth**: each private request is signed (HMAC-SHA256) with:
  - Headers: `X-BTK-APIKEY`, `X-BTK-TIMESTAMP` (ms), `X-BTK-SIGN` (hex)
  - Canonical payload: `timestamp + method + path + query + body`
- **Time sync**: dedicated server-time endpoint (ms) to avoid timestamp drift failures.
- **Streaming**: WebSocket channels for market updates (better than polling for real-time).

## How we apply it in XETAPAY (what’s implemented)

- Added a Workers-compatible Bitkub client: `worker/exchanges/bitkub.ts`
  - Implements canonical signing + hex HMAC using `crypto.subtle`
  - Keeps public requests unsigned
- Added **safe public proxies** in the Worker (no API keys involved):
  - `GET /api/market/bitkub/servertime` (KV cached ~10s)
  - `GET /api/market/bitkub/symbols` (KV cached ~60s)
  - `GET /api/market/bitkub/ticker?sym=...` (KV cached ~5s)

These endpoints let the routing/settlement engine use market data (FX/hedging/reference rates) without exposing any exchange credentials to the dashboard.

## How to “surpass” without competing

Use Bitkub as **one liquidity leg** inside your payments stack:

- **Price-aware routing**: when converting or hedging, route by (fees + reliability + slippage).
- **Ledger-first**: every external action writes an internal ledger event first, then executes (idempotent + replayable).
- **Blast-radius containment**: keep private trading endpoints behind internal auth (service-to-service), never from the browser.
- **Circuit breakers**: if upstream fails or rate-limits, degrade to cached prices or a secondary venue.

## Quick test

```bash
curl -sS https://xeta-pay-dashboard.sv9.workers.dev/api/market/bitkub/servertime
curl -sS "https://xeta-pay-dashboard.sv9.workers.dev/api/market/bitkub/ticker?sym=BTC_THB"
```

