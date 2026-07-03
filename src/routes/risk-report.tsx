import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard, NeonButton, RiskBadge, ScoreRing, StatTile, SectionHeading } from "@/components/ui/primitives";
import { Download, FileWarning, Printer, ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { analyzeFile } from "@/lib/mock-detection";

export const Route = createFileRoute("/risk-report")({
  head: () => ({ meta: [
    { title: "Risk Report — Deepfake Auditor" },
    { name: "description", content: "Auditable forensic report with authenticity score, evidence, signals, and export." },
  ] }),
  component: RiskReportPage,
});

function RiskReportPage() {
  const result = useMemo(() => analyzeFile("audit-session-report", 987654), []);
  const level = result.verdict === "authentic" ? "low" : result.verdict === "suspicious" ? "medium" : "critical";
  const generated = new Date().toLocaleString();

  function download() {
    const payload = { ...result, generatedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `risk-report-${result.fingerprint}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-neon">Pipeline · Step 06</div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold">Risk Report</h1>
          <p className="mt-1 text-sm text-muted-foreground">Auditable evidence chain, signal breakdown, and final verdict.</p>
        </div>
        <div className="flex gap-2">
          <NeonButton variant="ghost" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print / PDF</NeonButton>
          <NeonButton onClick={download}><Download className="h-4 w-4" /> Export JSON</NeonButton>
        </div>
      </div>

      <GlassCard className="mt-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg neon-border"><FileWarning className="h-5 w-5 text-cyan-neon" /></div>
            <div>
              <div className="font-display text-lg font-semibold">Audit Report</div>
              <div className="text-xs text-muted-foreground font-mono">ID {result.fingerprint} · {generated}</div>
            </div>
          </div>
          <RiskBadge level={level} />
        </div>
      </GlassCard>

      <div className="mt-4 grid gap-4 md:grid-cols-[auto_1fr]">
        <GlassCard className="p-6 grid place-items-center">
          <ScoreRing value={result.authenticityScore} label="Authentic" sublabel={`${result.deepfakeProbability}% deepfake`} />
        </GlassCard>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatTile label="Verdict" value={result.verdict.toUpperCase()} accent={result.verdict === "authentic" ? "lime" : "magenta"} />
          <StatTile label="Confidence" value={`${result.confidence}%`} accent="cyan" />
          <StatTile label="Voice Score" value={`${result.voiceScore}%`} accent="blue" />
          <StatTile label="Regions" value={`${result.regions.length}`} accent="magenta" />
          <StatTile label="Frames" value="24" accent="cyan" />
          <StatTile label="Model" value="Ensemble v3" accent="blue" />
        </div>
      </div>

      <GlassCard className="mt-4 p-6">
        <div className="font-display font-semibold">Summary</div>
        <p className="mt-2 text-sm text-muted-foreground">
          The submitted media was analyzed through the six-stage audit pipeline. The ensemble produced an authenticity score of {result.authenticityScore}% with {result.confidence}% confidence, classifying the asset as <span className="text-cyan-neon">{result.verdict}</span>. {result.regions.length} manipulated regions were surfaced with detailed heatmap evidence.
        </p>
      </GlassCard>

      <GlassCard className="mt-4 p-6">
        <div className="font-display font-semibold">Signal Breakdown</div>
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

      <GlassCard className="mt-4 p-6">
        <div className="font-display font-semibold">Evidence — Manipulated Regions</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {result.regions.map((r, i) => (
            <div key={i} className="glass rounded-lg p-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{r.label}</div>
                <div className="text-xs text-muted-foreground font-mono">x:{r.x.toFixed(0)} y:{r.y.toFixed(0)} r:{r.r.toFixed(1)}</div>
              </div>
              <div className="text-xs font-mono text-cyan-neon">int {Math.round(r.intensity * 100)}%</div>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="mt-6 flex justify-between print:hidden">
        <Link to="/ai-analysis"><NeonButton variant="ghost"><ArrowLeft className="h-4 w-4" /> Back to Analysis</NeonButton></Link>
        <Link to="/dashboard"><NeonButton>Open Security Dashboard</NeonButton></Link>
      </div>
    </div>
  );
}
