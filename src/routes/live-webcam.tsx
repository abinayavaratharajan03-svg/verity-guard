import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard, NeonButton, ScoreRing, StatTile, RiskBadge, SectionHeading } from "@/components/ui/primitives";
import { Camera, Play, Square, Activity, AlertTriangle, ShieldCheck, Waves, Cpu, ArrowRight, Loader2, RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { analyzeFile, fakeProgress, type DetectionResult } from "@/lib/mock-detection";

export const Route = createFileRoute("/live-webcam")({
  head: () => ({
    meta: [
      { title: "Live Webcam Analysis — Deepfake Auditor" },
      { name: "description", content: "Analyze your webcam feed in real time for deepfake, spoofing, and synthetic identity signals." },
      { property: "og:title", content: "Live Webcam Analysis — Deepfake Auditor" },
      { property: "og:description", content: "Real-time authenticity scoring with facial landmark overlay and forensic signal timeline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LiveWebcamPage,
});

type SignalPoint = { t: number; score: number };

function LiveWebcamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  const [live, setLive] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [timeline, setTimeline] = useState<SignalPoint[]>([]);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [fps, setFps] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // Cleanup on unmount
  useEffect(() => () => stopStream(), []);

  // Elapsed timer while live
  useEffect(() => {
    if (!live) return;
    const start = performance.now();
    const id = window.setInterval(() => setElapsed(Math.floor((performance.now() - start) / 1000)), 1000);
    return () => clearInterval(id);
  }, [live]);

  // Realtime rolling authenticity + FPS + voice sampling
  useEffect(() => {
    if (!live) return;
    let last = performance.now();
    let frames = 0;
    const buf = new Uint8Array(analyserRef.current?.frequencyBinCount ?? 32);

    const loop = () => {
      frames++;
      const now = performance.now();
      if (now - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = now;

        // rolling score (mock realtime signal — bounded random walk)
        setTimeline((prev) => {
          const base = prev.at(-1)?.score ?? 82;
          const drift = (Math.random() - 0.48) * 6;
          const next = Math.max(28, Math.min(99, base + drift));
          const arr = [...prev, { t: (prev.at(-1)?.t ?? 0) + 1, score: Math.round(next) }];
          return arr.length > 40 ? arr.slice(-40) : arr;
        });
      }

      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i];
        setVoiceLevel(Math.min(100, Math.round((sum / buf.length / 255) * 140)));
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [live]);

  async function startStream() {
    setError(null);
    setStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      // audio meter
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      audioCtxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      src.connect(analyser);
      analyserRef.current = analyser;

      setLive(true);
      setTimeline([{ t: 0, score: 84 }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to access webcam or microphone.");
    } finally {
      setStarting(false);
    }
  }

  function stopStream() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setLive(false);
    setElapsed(0);
    setFps(0);
    setVoiceLevel(0);
  }

  function captureSnapshot(): string | null {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return null;
    c.width = v.videoWidth || 640;
    c.height = v.videoHeight || 360;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(v, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.7);
  }

  async function runDeepAnalysis() {
    if (!live) return;
    setAnalyzing(true);
    setProgress(0);
    const snap = captureSnapshot();
    const seedKey = `webcam:${Date.now().toString().slice(-6)}:${snap?.length ?? 0}`;
    await fakeProgress((p) => setProgress(p), 2200);
    setResult(analyzeFile(seedKey, snap?.length ?? 1024));
    setAnalyzing(false);
  }

  const rolling = timeline.at(-1)?.score ?? 0;
  const risk = useMemo<"low" | "medium" | "high" | "critical">(() => {
    if (rolling >= 80) return "low";
    if (rolling >= 60) return "medium";
    if (rolling >= 45) return "high";
    return "critical";
  }, [rolling]);

  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,oklch(0.87_0.16_200/0.15),transparent_70%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-neon">Module · Live Feed</div>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold">Live Webcam Analysis</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Continuous authenticity scoring from your camera and microphone. Nothing is uploaded — analysis runs entirely in your browser.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!live ? (
              <NeonButton onClick={startStream} disabled={starting}>
                {starting ? <><Loader2 className="h-4 w-4 animate-spin" /> Requesting…</> : <><Play className="h-4 w-4" /> Start Live Feed</>}
              </NeonButton>
            ) : (
              <>
                <NeonButton onClick={runDeepAnalysis} disabled={analyzing}>
                  {analyzing ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing… {progress}%</> : <><Activity className="h-4 w-4" /> Run Deep Analysis</>}
                </NeonButton>
                <NeonButton variant="outline" onClick={stopStream}><Square className="h-4 w-4" /> Stop</NeonButton>
              </>
            )}
          </div>
        </div>

        {error && (
          <GlassCard className="mt-4 flex items-start gap-3 border border-[oklch(0.7_0.27_350/0.4)] p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-[oklch(0.78_0.27_350)]" />
            <div>
              <div className="font-semibold text-[oklch(0.78_0.27_350)]">Camera unavailable</div>
              <div className="text-muted-foreground">{error}</div>
            </div>
          </GlassCard>
        )}

        {/* Main grid */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
          {/* Camera panel */}
          <GlassCard className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-cyan-neon" />
                <span className="font-display text-sm font-semibold">Camera Feed</span>
                {live && (
                  <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.7_0.27_350/0.15)] px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[oklch(0.78_0.27_350)]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.78_0.27_350)]" /> LIVE
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                <span>{fps} fps</span>
                <span>·</span>
                <span>{formatTime(elapsed)}</span>
              </div>
            </div>
            <div className="relative aspect-video bg-black">
              <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
              <canvas ref={canvasRef} className="hidden" />
              {!live && !starting && (
                <div className="absolute inset-0 grid place-items-center text-center">
                  <div>
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl neon-border bg-background/60">
                      <Camera className="h-7 w-7 text-cyan-neon" />
                    </div>
                    <div className="mt-3 font-display text-sm text-muted-foreground">Start the feed to begin live analysis</div>
                  </div>
                </div>
              )}
              {live && (
                <>
                  {/* Scan-line overlay */}
                  <div aria-hidden className="pointer-events-none absolute inset-0 scan-line" />
                  {/* Landmark overlay */}
                  <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <g stroke="var(--cyan-neon)" strokeWidth="0.35" fill="none">
                      <rect x="34" y="20" width="32" height="46" rx="1.2">
                        <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="1.4s" repeatCount="indefinite" />
                      </rect>
                      <circle cx="43" cy="36" r="1.2" fill="var(--cyan-neon)" />
                      <circle cx="57" cy="36" r="1.2" fill="var(--cyan-neon)" />
                      <path d="M45 52 Q50 56 55 52" />
                      <path d="M50 39 L50 47" />
                    </g>
                    <text x="34" y="18" fontSize="2.2" fill="var(--cyan-neon)" fontFamily="monospace">
                      SUBJECT_01 · CONF 0.97
                    </text>
                    <text x="66" y="70" fontSize="2.2" fill="var(--cyan-neon)" fontFamily="monospace" textAnchor="end">
                      LM 68/68
                    </text>
                  </svg>
                  {/* Deep-analysis progress */}
                  {analyzing && (
                    <div className="absolute inset-x-0 bottom-0 border-t border-cyan-neon/30 bg-background/70 px-4 py-2 backdrop-blur">
                      <div className="flex items-center justify-between font-mono text-[11px] text-cyan-neon">
                        <span>Running ensemble models…</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="mt-1 h-1 overflow-hidden rounded bg-white/10">
                        <div className="h-full bg-cyan-neon transition-[width] duration-100" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </GlassCard>

          {/* Live score panel */}
          <div className="grid content-start gap-4">
            <GlassCard className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Realtime Authenticity</div>
                  <div className="mt-0.5 font-display text-sm font-semibold">Rolling Score</div>
                </div>
                <RiskBadge level={risk} />
              </div>
              <div className="mt-3 grid place-items-center">
                <ScoreRing value={live ? rolling : 0} size={180} label="Authenticity" sublabel={live ? "streaming" : "idle"} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <MiniStat label="FPS" value={fps || "—"} />
                <MiniStat label="Voice" value={`${voiceLevel}%`} />
                <MiniStat label="Uptime" value={live ? formatTime(elapsed) : "—"} />
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-display text-sm font-semibold flex items-center gap-2"><Waves className="h-4 w-4 text-cyan-neon" /> Voice Activity</div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Mic Live</span>
              </div>
              <div className="mt-3 flex h-16 items-end gap-1">
                {Array.from({ length: 32 }).map((_, i) => {
                  const h = live
                    ? Math.max(4, Math.min(64, (voiceLevel / 100) * (18 + Math.sin(Date.now() / 120 + i) * 22 + Math.random() * 20)))
                    : 4;
                  return (
                    <div key={i} className="w-1.5 rounded-sm bg-cyan-neon/70" style={{ height: `${h}px`, boxShadow: "0 0 6px oklch(0.87 0.16 200 / 0.6)" }} />
                  );
                })}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <GlassCard className="p-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="font-display text-sm font-semibold flex items-center gap-2"><Activity className="h-4 w-4 text-cyan-neon" /> Authenticity Timeline</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">last {Math.min(timeline.length, 40)}s</div>
            </div>
            <Sparkline data={timeline} />
            <div className="mt-2 grid grid-cols-4 gap-2">
              <StatTile label="Current" value={live ? `${rolling}%` : "—"} accent="cyan" />
              <StatTile label="Peak" value={timeline.length ? `${Math.max(...timeline.map((p) => p.score))}%` : "—"} accent="lime" />
              <StatTile label="Trough" value={timeline.length ? `${Math.min(...timeline.map((p) => p.score))}%` : "—"} accent="magenta" />
              <StatTile label="Samples" value={timeline.length} accent="blue" />
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="font-display text-sm font-semibold flex items-center gap-2"><Cpu className="h-4 w-4 text-cyan-neon" /> Signals</div>
            <div className="mt-3 space-y-2">
              {(result?.signals ?? placeholderSignals(rolling)).map((s) => (
                <div key={s.name} className="flex items-center justify-between rounded-md border border-white/5 bg-white/[0.02] px-3 py-2 text-xs">
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="font-mono font-semibold" style={{ color: statusColor(s.status) }}>{s.value}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Deep analysis result */}
        {result && (
          <div className="mt-4">
            <SectionHeading kicker="Snapshot Report" title="Forensic Deep Analysis" sub="Latest ensemble verdict from the captured frame." />
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <GlassCard className="p-5 md:col-span-1 grid place-items-center">
                <ScoreRing value={result.authenticityScore} size={160} label="Authenticity" />
                <div className="mt-3"><RiskBadge level={result.verdict === "authentic" ? "low" : result.verdict === "suspicious" ? "high" : "critical"} /></div>
              </GlassCard>
              <div className="md:col-span-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatTile label="Deepfake Prob." value={`${result.deepfakeProbability}%`} accent="magenta" />
                <StatTile label="Confidence" value={`${result.confidence}%`} accent="cyan" />
                <StatTile label="Voice Score" value={`${result.voiceScore}%`} accent="blue" />
                <StatTile label="Fingerprint" value={<span className="font-mono text-sm">{result.fingerprint}</span>} accent="lime" />
                <GlassCard className="col-span-2 sm:col-span-4 p-4">
                  <div className="font-display text-sm font-semibold flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan-neon" /> Manipulated Regions</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.regions.map((r, i) => (
                      <span key={i} className="rounded-full border border-cyan-neon/40 bg-cyan-neon/10 px-2.5 py-0.5 font-mono text-[11px] text-cyan-neon">
                        {r.label} · {(r.intensity * 100).toFixed(0)}%
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <NeonButton variant="outline" onClick={runDeepAnalysis} disabled={analyzing}>
                <RefreshCcw className="h-4 w-4" /> Re-Analyze
              </NeonButton>
              <Link to="/risk-report" className="inline-flex items-center gap-2 rounded-lg bg-cyan-neon px-5 py-2.5 text-sm font-medium text-primary-foreground hover:shadow-[0_0_30px_oklch(0.87_0.16_200/0.55)] transition">
                Open Full Risk Report <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-6">
          <Link to="/capabilities" className="text-sm text-muted-foreground hover:text-cyan-neon transition">← Back to Capabilities</Link>
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-cyan-neon">Go to Dashboard <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-white/5 bg-white/[0.02] px-2 py-1.5">
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-sm font-semibold text-cyan-neon">{value}</div>
    </div>
  );
}

function Sparkline({ data }: { data: SignalPoint[] }) {
  const w = 600;
  const h = 120;
  const pts = data.length ? data : [{ t: 0, score: 0 }];
  const max = 100;
  const min = 0;
  const step = pts.length > 1 ? w / (pts.length - 1) : w;
  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - ((p.score - min) / (max - min)) * h}`)
    .join(" ");
  const area = `${path} L ${(pts.length - 1) * step} ${h} L 0 ${h} Z`;
  return (
    <div className="mt-3 rounded-lg border border-white/5 bg-black/30 p-2">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-32 w-full">
        <defs>
          <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--cyan-neon)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--cyan-neon)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 50, 75].map((y) => (
          <line key={y} x1="0" x2={w} y1={h - (y / 100) * h} y2={h - (y / 100) * h} stroke="oklch(1 0 0 / 0.05)" strokeDasharray="2 4" />
        ))}
        <path d={area} fill="url(#spark-fill)" />
        <path d={path} fill="none" stroke="var(--cyan-neon)" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px var(--cyan-neon))" }} />
      </svg>
    </div>
  );
}

function placeholderSignals(rolling: number) {
  return [
    { name: "Temporal Coherence", value: Math.round(rolling), status: rolling >= 70 ? "ok" : "warn" },
    { name: "Blink Cadence", value: Math.round(60 + Math.sin(Date.now() / 800) * 20), status: "ok" },
    { name: "Lip-Sync Drift", value: Math.round(100 - rolling * 0.7), status: rolling >= 65 ? "ok" : "fail" },
    { name: "GAN Artifacts", value: Math.round(100 - rolling), status: rolling >= 70 ? "ok" : "fail" },
    { name: "Color Histogram", value: Math.round(70 + (rolling % 10)), status: "ok" },
  ] as { name: string; value: number; status: "ok" | "warn" | "fail" }[];
}

function statusColor(s: "ok" | "warn" | "fail") {
  return s === "ok" ? "var(--lime-ok)" : s === "warn" ? "var(--cyan-neon)" : "var(--magenta-alert)";
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
