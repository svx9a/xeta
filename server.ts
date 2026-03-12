import express from "express";
import bodyParser from "body-parser";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { spawn } from "child_process";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import { MOCK_CHART_DATA } from "./src/constants";
import { calculateTax } from "./src/services/taxService";
import { getShippingQuotes } from "./src/services/shippingService";

type RunResult = {
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
};

async function runCommand(
  cmd: string,
  args: string[],
  opts: { cwd?: string; timeoutMs: number; maxOutputBytes?: number },
): Promise<RunResult> {
  const maxOutputBytes = opts.maxOutputBytes ?? 512 * 1024;

  return await new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: opts.cwd,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env },
    });

    let stdout = "";
    let stderr = "";
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let timedOut = false;

    const killTimer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, opts.timeoutMs);

    const append = (chunk: Buffer, which: "stdout" | "stderr") => {
      if (which === "stdout") {
        if (stdoutBytes >= maxOutputBytes) return;
        const remaining = maxOutputBytes - stdoutBytes;
        const slice = chunk.subarray(0, remaining);
        stdoutBytes += slice.length;
        stdout += slice.toString("utf8");
      } else {
        if (stderrBytes >= maxOutputBytes) return;
        const remaining = maxOutputBytes - stderrBytes;
        const slice = chunk.subarray(0, remaining);
        stderrBytes += slice.length;
        stderr += slice.toString("utf8");
      }
    };

    child.stdout?.on("data", (d: Buffer) => append(d, "stdout"));
    child.stderr?.on("data", (d: Buffer) => append(d, "stderr"));

    child.on("error", (err) => {
      clearTimeout(killTimer);
      reject(err);
    });

    child.on("close", (code, signal) => {
      clearTimeout(killTimer);
      resolve({ exitCode: code, signal, stdout, stderr, timedOut });
    });
  });
}

async function startServer() {
  const app = express();
  app.use(bodyParser.json({ limit: "2mb" }));
  const server = http.createServer(app);
  const PORT = Number(process.env.PORT) || 8090;

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

  // Auth mock endpoints
  const validTokens = new Set<string>();

  app.post("/api/auth/google", (req, res) => {
    const { email, turnstile_token } = req.body;
    console.log("Mock /api/auth/google received:", email);
    
    // Check if missing turnstile
    if (!turnstile_token && process.env.NODE_ENV !== "development") {
        console.warn("Missing turnstile token in production-like environment");
    }

    const token = "xeta_oauth_" + Math.random().toString(36).substring(7);
    validTokens.add(token);
    
    res.json({
      status: "AUTHENTICATED",
      user: {
        email: email || "test@test.com",
        tenant_id: "TENANT-001"
      },
      token: token
    });
  });

  app.get("/api/auth/verify", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing authorization" });
    }
    const token = authHeader.split(" ")[1];
    if (validTokens.has(token) || token.startsWith("xeta_oauth_") || token.startsWith("xeta_demo_")) {
      res.json({ status: "VALID" });
    } else {
      res.status(401).json({ error: "Invalid token" });
    }
  });

  // LaTeX -> PDF compiler (needs `tectonic` installed on the server).
  app.options("/api/latex/compile", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", String(process.env.LATEX_CORS_ORIGIN || "*"));
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400");
    res.status(204).end();
  });

  app.post("/api/latex/compile", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", String(process.env.LATEX_CORS_ORIGIN || "*"));

    const tex = req.body?.tex;
    if (typeof tex !== "string") {
      res.status(400).json({ error: "Expected JSON body: { tex: string }" });
      return;
    }

    if (tex.length > 1_000_000) {
      res.status(413).json({ error: "TeX payload too large (max 1,000,000 chars)" });
      return;
    }

    const requestId = randomUUID();
    const workdir = await fs.mkdtemp(path.join(os.tmpdir(), "latex-"));
    const outdir = path.join(workdir, "out");
    const inputPath = path.join(workdir, "main.tex");
    const outputPath = path.join(outdir, "main.pdf");

    try {
      await fs.mkdir(outdir, { recursive: true });
      await fs.writeFile(inputPath, tex, "utf8");

      const result = await runCommand("tectonic", ["-o", outdir, inputPath], {
        cwd: workdir,
        timeoutMs: 25_000,
      });

      if (result.timedOut) {
        res.status(408).json({ error: "Compilation timed out", requestId });
        return;
      }

      if (result.exitCode !== 0) {
        res.status(400).json({
          error: "Compilation failed",
          requestId,
          log: [result.stdout, result.stderr].filter(Boolean).join("\n"),
        });
        return;
      }

      const pdf = await fs.readFile(outputPath);
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'inline; filename="document.pdf"');
      res.status(200).send(pdf);
    } catch (e: any) {
      res.status(500).json({
        error: "Server error during compilation",
        requestId,
        details: e?.message ? String(e.message) : String(e),
      });
    } finally {
      await fs.rm(workdir, { recursive: true, force: true });
    }
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

  // Dashboard AI adapter (matches Cloudflare Worker `/api/ai/chat`)
  app.post("/api/ai/chat", (req, res) => {
    const { message, focus, language } = req.body || {};
    res.json({
      response: `[LOCAL_SIM] (${language || "en"}|${focus || "all"}) ${String(message || "").slice(0, 2000)}`,
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
