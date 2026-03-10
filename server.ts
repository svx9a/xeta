import express from "express";
import bodyParser from "body-parser";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { MOCK_CHART_DATA } from "./src/constants";
import { calculateTax } from "./src/services/taxService";
import { getShippingQuotes } from "./src/services/shippingService";

async function startServer() {
  const app = express();
  app.use(bodyParser.json());
  const server = http.createServer(app);
  const PORT = Number(process.env.PORT) || 8080;

  // WebSocket Server
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected to WebSocket");

    ws.on("close", () => {
      console.log("Client disconnected from WebSocket");
    });
  });

  // Simulate real-time transactions
  setInterval(() => {
    const amount = Math.floor(Math.random() * 5000) + 100;
    const newPayment = {
      id: `pay_${Math.random().toString(36).substring(2, 11)}`,
      date: new Date().toISOString(),
      orderId: `#${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
      amount: amount,
      currency: 'THB',
      status: 'authorized',
      customer: {
        name: ['John Doe', 'Jane Smith', 'Somchai Jaidee', 'Somsak Rakthai'][Math.floor(Math.random() * 4)],
        email: 'customer@example.com'
      },
      card: {
        last4: Math.floor(Math.random() * 9000 + 1000).toString(),
        brand: ['Visa', 'Mastercard', 'JCB'][Math.floor(Math.random() * 3)]
      },
      amountCapturable: amount,
      amountRefundable: 0,
      capturedAmount: 0,
      refundedAmount: 0
    };

    const message = JSON.stringify({ type: 'NEW_PAYMENT', data: newPayment });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }, 10000); // Every 10 seconds

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.get("/api/analytics/revenue-stream", (req, res) => {
    res.json({ data: MOCK_CHART_DATA });
  });
  app.get("/api/routing/preview", (req, res) => {
    const sample = [
      { provider: "LINE Pay", fee_pct: 0.021, fee_fixed: 3, success_rate: 0.98, score: 0.021 * 100 + 3 + 0.2 },
      { provider: "PromptPay", fee_pct: 0.015, fee_fixed: 0, success_rate: 0.995, score: 0.015 * 100 + 0 + 0.05 },
      { provider: "PayPal", fee_pct: 0.032, fee_fixed: 11, success_rate: 0.96, score: 0.032 * 100 + 11 + 0.4 },
    ];
    res.json({ data: sample });
  });
  app.get("/api/internal/grafana-metrics", (req, res) => {
    const data = [
      { name: 'uptime', label: 'Uptime', value: '99.98%' },
      { name: 'avg_latency', label: 'Avg Latency', value: '47ms' },
      { name: 'error_rate', label: 'Error Rate', value: '0.02%' },
    ];
    res.json(data);
  });
  app.get("/api/tax/calc", (req, res) => {
    const country = String(req.query.country || "Thailand") as any;
    const amount = Number(req.query.amount || "0");
    try {
      const result = calculateTax(country, amount);
      res.json({ data: result });
    } catch {
      res.status(400).json({ error: "Invalid country or amount" });
    }
  });
  app.get("/api/shipping/quote", (req, res) => {
    const from = String(req.query.origin || "Bangkok, Thailand");
    const to = String(req.query.destination || "Chiang Mai, Thailand");
    const weight = Number(req.query.weightKg || "1");
    const value = Number(req.query.value || "1000");
    (async () => {
      try {
        const quotes = await getShippingQuotes({ from, to, weight, value });
        res.json({ data: quotes });
      } catch {
        res.status(400).json({ error: "Invalid shipping parameters" });
      }
    })();
  });

  app.post("/api/payments", (req, res) => {
    const { amount_thb, merchant_id } = req.body;
    // Simulate real worker routing
    const paymentId = `PAY-SIM-${Math.random().toString(36).substring(7).toUpperCase()}`;
    res.json({
      payment_id: paymentId,
      provider_id: "PromptPay",
      checkout_url: `https://checkout.xetapay.com/${paymentId}`,
      score: 0.15
    });
  });

  app.post("/api/agent", (req, res) => {
    const { message } = req.body;
    res.json({
      response: `[SIMULATED] AGX9 Engine received: "${message}". Connecting to neural bridge...`,
      intent: "CHAT"
    });
  });

  app.get("/api/settlements", (req, res) => {
    const data = [
      { id: 'SET-9921', date: '2026-03-05', amount: 45200.50, fee: 678.00, net: 44522.50, status: 'COMPLETED', method: 'SCB Direct' },
      { id: 'SET-9922', date: '2026-03-06', amount: 12840.00, fee: 192.60, net: 12647.40, status: 'COMPLETED', method: 'SCB Direct' },
      { id: 'SET-9923', date: '2026-03-08', amount: 8430.50, fee: 126.45, net: 8304.05, status: 'PENDING', method: 'Mae Manee Relay' },
    ];
    res.json({ data });
  });

  // MAE MANEE (SCB) SIMULATION
  app.post("/v1/oauth/token", (req, res) => {
    res.json({ access_token: "xeta_local_token_" + Date.now(), token_type: "Bearer", expires_in: 3600 });
  });

  app.post("/v1/maemanee/payment/qr/create", (req, res) => {
    res.json({ status: { code: 1000, description: "Success" }, data: { qrRawData: "MOCK_QR", transactionId: "TX-" + Date.now() } });
  });

  app.post("/v1/maemanee/payment/paymentlink", (req, res) => {
    res.json({ status: { code: 1000, description: "Success" }, data: { paymentLinkUrl: "https://link.xeta.local/pay/123" } });
  });

  app.post("/api/settlements/cashout", (req, res) => {
    res.json({ status: "SUCCESS", cashout_id: "CSH-" + Date.now(), amount: req.body.amount, settled_at: new Date().toISOString() });
  });

  app.post("/v1/maemanee/payment/transaction/getone", (req, res) => {
    res.json({ status: { code: 1000, description: "Success" }, data: { transactionStatus: "PAID" } });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static("dist"));
    // For SPA, serve index.html for any unknown route
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
