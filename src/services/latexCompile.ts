type CompileErrorJson = { error?: string; log?: string; requestId?: string; details?: string };

function isLocalhostHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function getLatexApiBase() {
  const raw = (import.meta as any)?.env?.VITE_LATEX_API_BASE;
  if (!raw) return "";
  return String(raw).replace(/\/+$/, "");
}

export async function compileLatexToPdf(tex: string): Promise<Blob> {
  const apiBase = getLatexApiBase();
  if (!apiBase && typeof window !== "undefined" && !isLocalhostHost(window.location.hostname)) {
    throw new Error(
      "No LaTeX API configured for this site. Set VITE_LATEX_API_BASE to your compiler server (Surge is static and cannot compile).",
    );
  }
  const res = await fetch(`${apiBase}/api/latex/compile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tex }),
  });

  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    if (contentType.includes("application/json")) {
      const json = (await res.json()) as CompileErrorJson;
      const msg = [json.error, json.details, json.requestId ? `Request: ${json.requestId}` : ""]
        .filter(Boolean)
        .join(" · ");
      throw new Error(msg || `Compilation failed (${res.status})`);
    }
    const text = await res.text().catch(() => "");
    throw new Error(text || `Compilation failed (${res.status})`);
  }

  if (!contentType.includes("application/pdf")) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Unexpected response (expected PDF)");
  }

  return await res.blob();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
