import React, { useMemo, useRef, useState } from "react";
import Card from "../components/Card";
import { compileLatexToPdf } from "../services/latexCompile";

type CompileState = "idle" | "compiling" | "success" | "error";

const DEFAULT_TEX = String.raw`\documentclass[12pt]{article}
\usepackage{geometry}
\geometry{a4paper, margin=1in}
\usepackage{hyperref}
\usepackage{listings}
\usepackage{xcolor}
\usepackage{fontspec}

\title{\Huge\textbf{LaTeX Compiler} \\ \Large Local Tectonic Webapp}
\author{XETAPAY\_DEV}
\date{\today}

\begin{document}
\maketitle

\section{Hello}
Paste your \texttt{.tex} here and click Compile.

\end{document}
`;

export default function LatexCompilerPage() {
  const [tex, setTex] = useState(DEFAULT_TEX);
  const [state, setState] = useState<CompileState>("idle");
  const [error, setError] = useState<string>("");
  const [log, setLog] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canCompile = useMemo(() => tex.trim().length > 0 && state !== "compiling", [tex, state]);

  const compile = async () => {
    if (!canCompile) return;

    setState("compiling");
    setError("");
    setLog("");

    try {
      const blob = await compileLatexToPdf(tex);
      const url = URL.createObjectURL(blob);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(url);
      setState("success");
    } catch (e: any) {
      setError(e?.message ? String(e.message) : "Network error");
      setState("error");
    }
  };

  const onPickFile = () => fileInputRef.current?.click();

  const onFileChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file) return;
    const text = await file.text();
    setTex(text);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">LaTeX Compiler</h1>
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-70">
            Local compile via <span className="font-mono normal-case">tectonic</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input ref={fileInputRef} type="file" accept=".tex,text/plain" className="hidden" onChange={onFileChange} />
          <button
            onClick={onPickFile}
            className="px-5 py-3 text-xs font-bold uppercase tracking-widest rounded-full border border-border-color/60 hover:bg-white/5 transition-all active:scale-95"
          >
            Upload .tex
          </button>
          <button
            onClick={compile}
            disabled={!canCompile}
            className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white satin-effect rounded-full shadow-satin hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all"
          >
            {state === "compiling" ? "Compiling…" : "Compile"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest">Source</h2>
            <button
              onClick={() => setTex(DEFAULT_TEX)}
              className="text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
              type="button"
            >
              Reset
            </button>
          </div>
          <textarea
            value={tex}
            onChange={(e) => setTex(e.target.value)}
            className="w-full h-[520px] bg-white dark:bg-background border border-border-color/60 rounded-2xl p-4 font-mono text-xs text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            spellCheck={false}
          />
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest">Preview</h2>
            {pdfUrl ? (
              <a
                href={pdfUrl}
                download="document.pdf"
                className="text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
              >
                Download PDF
              </a>
            ) : null}
          </div>

          {state === "error" && (
            <div className="mb-4 p-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800">
              <div className="text-xs font-bold uppercase tracking-widest">Compile error</div>
              <div className="text-sm font-semibold mt-1">{error || "Unknown error"}</div>
            </div>
          )}

          {log ? (
            <pre className="mb-4 p-4 rounded-2xl bg-sidebar-bg/30 border border-border-color/60 text-[10px] overflow-auto max-h-56">
              {log}
            </pre>
          ) : null}

          {pdfUrl ? (
            <iframe
              title="PDF Preview"
              src={pdfUrl}
              className="flex-1 w-full rounded-2xl border border-border-color/60 bg-white"
            />
          ) : (
            <div className="flex-1 flex items-center justify-center rounded-2xl border border-border-color/60 bg-sidebar-bg/30 text-text-secondary text-xs font-bold uppercase tracking-widest opacity-70">
              Compile to see PDF
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
