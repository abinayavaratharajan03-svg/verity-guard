import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard, NeonButton, ScoreRing, StatTile } from "@/components/ui/primitives";
import { Cpu, Play, ArrowRight } from "lucide-react";
import { useState } from "react";
import { analyzeFile, fakeProgress, type DetectionResult } from "@/lib/mock-detection";

export const Route = createFileRoute("/ai-analysis")({
  head: () => ({ meta: [
    { title: "AI Analysis Engine — Deepfake Auditor" },
    { name: "description", content: "Watch the multi-model ensemble score temporal, spatial, and spectral signals in real time." },
  ] }),
  component: AiAnalysisPage,
});

const models = [
  { name: "XceptionNet — Spatial", weight: 0.32 },
  { name: "TimeSformer — Temporal", weight: 0.28 },
  { name: "F3-Net — Frequency", weight: 0.22 },
  { name: "LipSync-D — Audio/Visual", weight: 0.18 },
];

function AiAnalysisPage() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [modelProg, setModelProg] = useState<number[]>([0, 0, 0, 0]);

  async function run() {
    setRunning(true); setResult(null); setProgress(0); setModelProg([0, 0, 0, 0]);
    const timer = setInterval(() => {
      setModelProg((prev) => prev.map((v) => Math.min(100, v + Math.random() * 12)));
    }, 120);
    await fakeProgress(setProgress, 2600);
    clearInterval(timer);
    setModelProg([100, 100, 100, 100]);
    setResult(analyzeFile(`session-${Date.now()}`, 12345));
    setRunning(false);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-neon">Pipeline · Step 04</div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold">AI Analysis Engine</h1>
          <p className="mt-1 text-sm text-muted-foreground">Multi-model ensemble processing aligned face crops.</p>
        </div>
        <NeonButton onClick={run} disabled={running}><Play className="h-4 w-4" /> {running ? "Running…" : "Run Ensemble"}</NeonButton>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <GlassCard className="p-5">
          <div className="flex items-center gap-2"><Cpu className="h-4 w-4 text-cyan-neon" /><span className="font-display font-semibold">Model Ensemble</span></div>
          <div className="mt-4 space-y-3">
            {models.map((m, i) => (
              <div key={m.name}>
                <div className="flex justify-between text-xs"><span>{m.name}</span><span className="font-mono text-muted-foreground">w={m.weight}</span></div>
                <div className="mt-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-neon to-[var(--blue-electric)]" style={{ width: `${modelProg[i]}%`, transition: "width 180ms linear" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-xs"><span>Overall</span><span className="font-mono text-cyan-neon">{progress}%</span></div>
            <div className="mt-1 h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-cyan-neon" style={{ width: `${progress}%`, transition: "width 120ms linear" }} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 grid place-items-center">
          <ScoreRing value={result?.authenticityScore ?? 0} label="Authentic" sublabel={result ? `${result.deepfakeProbability}% deepfake` : running ? "processing…" : "awaiting run"} />
        </GlassCard>
      </div>

      {result && (
        <>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatTile label="Verdict" value={result.verdict.toUpperCase()} accent={result.verdict === "authentic" ? "lime" : result.verdict === "suspicious" ? "cyan" : "magenta"} />
            <StatTile label="Confidence" value={`${result.confidence}%`} accent="cyan" />
            <StatTile label="Deepfake Prob." value={`${result.deepfakeProbability}%`} accent="magenta" />
            <StatTile label="Fingerprint" value={<span className="font-mono text-sm">{result.fingerprint}</span>} accent="blue" />
          </div>
          <div className="mt-4 flex justify-end">
            <Link to="/risk-report"><NeonButton>Generate Risk Report <ArrowRight className="h-4 w-4" /></NeonButton></Link>
          </div>
        </>
      )}
    </div>
  );
}
