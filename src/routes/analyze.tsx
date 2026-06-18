import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, NeonButton, RiskBadge, ScoreRing, StatTile } from "@/components/ui/primitives";
import { Download, Film, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { analyzeFile, type DetectionResult } from "@/lib/mock-detection";

export const Route = createFileRoute("/analyze")({
  head: () => ({ meta: [{ title: "Deepfake Analysis Results — Deepfake Auditor" }, { name: "description", content: "Forensic deepfake analysis: authenticity score, heatmap of manipulated facial regions, and downloadable report." }] }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);

  useEffect(() => () => { if (videoUrl) URL.revokeObjectURL(videoUrl); }, [videoUrl]);

  async function run(f: File) {
    setBusy(true);
    setResult(null);
    setFile(f);
    setVideoUrl(URL.createObjectURL(f));
    await new Promise((r) => setTimeout(r, 1800));
    setResult(analyzeFile(f.name, f.size));
    setBusy(false);
  }

  function loadDemo() {
    const fake = new File([new Uint8Array(1024 * 64)], "demo-sample.mp4", { type: "video/mp4" });
    run(fake);
  }

  function downloadReport() {
    if (!result || !file) return;
    const payload = {
      asset: { name: file.name, size: file.size, fingerprint: result.fingerprint },
      verdict: result.verdict,
      authenticityScore: result.authenticityScore,
      deepfakeProbability: result.deepfakeProbability,
      confidence: result.confidence,
      signals: result.signals,
      manipulatedRegions: result.regions,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `audit-${result.fingerprint}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-neon">Forensics / Audit</div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold">Deepfake Analysis Results</h1>
          <p className="mt-1 text-sm text-muted-foreground">Frame-by-frame inspection with manipulated-region heatmap.</p>
        </div>
        <div className="flex gap-2">
          <label>
            <input type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) run(f); }} />
            <span><NeonButton variant="outline" as="span" {...({} as object)}><Upload className="h-4 w-4" />Upload</NeonButton></span>
          </label>
          <NeonButton onClick={loadDemo}><Film className="h-4 w-4" />Run Demo</NeonButton>
        </div>
      </div>

      {!file && (
        <GlassCard className="mt-8 p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full neon-border bg-background"><Film className="h-6 w-6 text-cyan-neon" /></div>
          <h3 className="mt-4 font-display text-xl font-semibold">No clip loaded</h3>
          <p className="mt-1 text-sm text-muted-foreground">Upload a video or run the demo analysis.</p>
          <div className="mt-5 flex justify-center gap-2">
            <NeonButton onClick={loadDemo}>Run Demo Analysis</NeonButton>
          </div>
        </GlassCard>
      )}

      {file && (
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <GlassCard className="p-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="font-display font-semibold">Video Preview · Heatmap</div>
              <span className="font-mono text-[10px] text-muted-foreground">{file.name}</span>
            </div>
            <div className="relative mt-3 aspect-video overflow-hidden rounded-lg border border-white/5 bg-black scan-line">
              {videoUrl && <video src={videoUrl} className="h-full w-full object-contain" controls muted />}
              {busy && <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-neon to-transparent animate-scan-y" />}
              {result && (
                <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    {result.regions.map((r, i) => (
                      <radialGradient key={i} id={`heat-${i}`}>
                        <stop offset="0%" stopColor="oklch(0.78 0.27 350)" stopOpacity={r.intensity} />
                        <stop offset="100%" stopColor="oklch(0.78 0.27 350)" stopOpacity="0" />
                      </radialGradient>
                    ))}
                  </defs>
                  {result.regions.map((r, i) => (
                    <g key={i}>
                      <circle cx={r.x} cy={r.y} r={r.r} fill={`url(#heat-${i})`} />
                      <circle cx={r.x} cy={r.y} r={r.r * 0.4} fill="none" stroke="oklch(0.78 0.27 350)" strokeWidth="0.3" />
                      <text x={r.x + r.r * 0.5} y={r.y - r.r * 0.4} fontSize="2" fill="oklch(0.78 0.27 350)" fontFamily="monospace">{r.label}</text>
                    </g>
                  ))}
                </svg>
              )}
              {busy && <div className="absolute inset-0 grid place-items-center bg-black/40 font-mono text-xs text-cyan-neon">ANALYZING FRAMES…</div>}
            </div>
            {result && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatTile label="Verdict" value={result.verdict.toUpperCase()} accent={result.verdict === "authentic" ? "lime" : result.verdict === "suspicious" ? "cyan" : "magenta"} />
                <StatTile label="Confidence" value={`${result.confidence}%`} accent="cyan" />
                <StatTile label="Frames" value="24/24" accent="blue" />
                <StatTile label="Fingerprint" value={<span className="font-mono text-sm">{result.fingerprint}</span>} accent="cyan" />
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-5">
            <div className="font-display font-semibold">Authenticity Score</div>
            <div className="mt-4 grid place-items-center">
              <ScoreRing value={result?.authenticityScore ?? 0} label="Authentic" sublabel={result ? `${result.deepfakeProbability}% deepfake` : "—"} />
            </div>
            {result && <div className="mt-4 flex justify-center"><RiskBadge level={result.verdict === "authentic" ? "low" : result.verdict === "suspicious" ? "medium" : "critical"} /></div>}
            {result && (
              <div className="mt-5">
                <NeonButton className="w-full" onClick={downloadReport}><Download className="h-4 w-4" />Download Report</NeonButton>
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {result && (
        <GlassCard className="mt-4 p-5">
          <div className="font-display font-semibold">Detailed Analysis Report</div>
          <div className="mt-4 grid gap-2">
            {result.signals.map((s) => (
              <div key={s.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                <span className="text-sm">{s.name}</span>
                <div className="h-1.5 w-40 sm:w-64 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: s.status === "ok" ? "oklch(0.88 0.22 130)" : s.status === "warn" ? "oklch(0.87 0.16 200)" : "oklch(0.78 0.27 350)" }} />
                </div>
                <span className="font-mono text-xs text-muted-foreground w-10 text-right">{s.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
