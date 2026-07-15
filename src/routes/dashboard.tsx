import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, NeonButton, RiskBadge, ScoreRing, StatTile } from "@/components/ui/primitives";
import { Upload, Webcam, CircleAlert, Mic, Activity } from "lucide-react";
import { useRef, useState } from "react";
import { analyzeFile, type DetectionResult } from "@/lib/mock-detection";
import { analyzeVideo, toBackendError } from "@/lib/api";
import { useDetection, scoreToRisk } from "@/context/detection-context";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Operations Dashboard — Deepfake Auditor" }, { name: "description", content: "Realtime deepfake telemetry, voice authenticity, alerts and audit history." }] }),
  component: Dashboard,
});

const trend = Array.from({ length: 14 }, (_, i) => ({ d: `D${i + 1}`, score: 70 + Math.round(Math.sin(i / 2) * 12 + Math.random() * 8) }));
const detections = [
  { name: "Mon", real: 412, fake: 32 },
  { name: "Tue", real: 388, fake: 41 },
  { name: "Wed", real: 503, fake: 27 },
  { name: "Thu", real: 467, fake: 58 },
  { name: "Fri", real: 521, fake: 44 },
  { name: "Sat", real: 311, fake: 19 },
  { name: "Sun", real: 289, fake: 22 },
];
const riskMix = [
  { name: "Low", value: 612, fill: "oklch(0.88 0.22 130)" },
  { name: "Medium", value: 248, fill: "oklch(0.87 0.16 200)" },
  { name: "High", value: 87, fill: "oklch(0.82 0.2 50)" },
  { name: "Critical", value: 23, fill: "oklch(0.78 0.27 350)" },
];

function Dashboard() {
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [backendNote, setBackendNote] = useState<string | null>(null);
  const [webcamOn, setWebcamOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { alerts, pushAlert, totalScanned, incScanned } = useDetection();

  async function onFile(file: File) {
    setBusy(true);
    setBackendNote(null);
    try {
      const r = await analyzeVideo(file);
      const local = analyzeFile(file.name, file.size);
      setResult({ ...local, authenticityScore: r.authenticity_score, deepfakeProbability: r.deepfake_probability, confidence: r.confidence, verdict: r.verdict });
      pushAlert({ source: file.name, message: `Video verdict: ${r.verdict.toUpperCase()} (${r.authenticity_score}%)`, risk: scoreToRisk(r.authenticity_score) });
    } catch (err) {
      const be = toBackendError(err);
      setBackendNote(be.message);
      const local = analyzeFile(file.name, file.size);
      setResult(local);
      pushAlert({ source: file.name, message: `Offline analysis: ${local.verdict.toUpperCase()} (${local.authenticityScore}%)`, risk: scoreToRisk(local.authenticityScore) });
    } finally {
      incScanned();
      setBusy(false);
    }
  }

  async function toggleWebcam() {
    if (webcamOn) {
      const v = videoRef.current;
      const s = v?.srcObject as MediaStream | null;
      s?.getTracks().forEach((t) => t.stop());
      if (v) v.srcObject = null;
      setWebcamOn(false);
      return;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
      setWebcamOn(true);
    } catch {
      // ignore; surfaces as not-on
    }
  }

  const auth = result?.authenticityScore ?? 84;
  const voice = result?.voiceScore ?? 76;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-neon">Console / Live</div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold">Operations Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Realtime authenticity telemetry and detection history.</p>
        </div>
        <RiskBadge level={auth >= 78 ? "low" : auth >= 55 ? "medium" : auth >= 35 ? "high" : "critical"} />
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile label="Audited Today" value="1,284" hint="+12% vs avg" accent="cyan" />
        <StatTile label="Deepfakes Blocked" value="47" hint="3 critical" accent="magenta" />
        <StatTile label="KYC Verified" value="918" hint="99.1% pass" accent="lime" />
        <StatTile label="Median Latency" value="412ms" hint="p95 740ms" accent="blue" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Upload */}
        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="font-display font-semibold">Video Upload</div>
            <span className="font-mono text-[10px] text-muted-foreground">MP4 · MOV · WEBM · ≤100MB</span>
          </div>
          <label className="mt-3 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-neon/30 bg-cyan-neon/5 px-6 py-10 cursor-pointer hover:bg-cyan-neon/10 transition">
            <Upload className="h-7 w-7 text-cyan-neon" />
            <div className="text-sm">Drop a video or <span className="text-cyan-neon underline">browse</span></div>
            <div className="font-mono text-[10px] text-muted-foreground">{busy ? "Analyzing frames…" : "Ready"}</div>
            <input type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
          </label>
          {busy && <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden"><div className="h-full w-1/2 animate-shimmer rounded-full" /></div>}
        </GlassCard>

        {/* Webcam */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div className="font-display font-semibold">Webcam Preview</div>
            <NeonButton variant={webcamOn ? "outline" : "primary"} className="px-3 py-1.5 text-xs" onClick={toggleWebcam}>
              <Webcam className="h-3.5 w-3.5" />{webcamOn ? "Stop" : "Start"}
            </NeonButton>
          </div>
          <div className="relative mt-3 aspect-video overflow-hidden rounded-lg border border-white/5 bg-black scan-line">
            <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
            {!webcamOn && <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground font-mono">CAMERA OFFLINE</div>}
            {webcamOn && <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-neon to-transparent animate-scan-y" />}
            <div className="absolute top-2 left-2 font-mono text-[10px] text-cyan-neon">● REC</div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-5">
          <div className="font-display font-semibold">Authenticity Score</div>
          <div className="mt-4 grid place-items-center">
            <ScoreRing value={auth} label="Authentic" sublabel={`Confidence ${result?.confidence ?? 91}%`} />
          </div>
          <div className="mt-4 flex justify-center"><RiskBadge level={auth >= 78 ? "low" : auth >= 55 ? "medium" : "high"} /></div>
        </GlassCard>

        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="font-display font-semibold">Deepfake Probability — Trend</div>
            <span className="font-mono text-[10px] text-muted-foreground">last 14 days</span>
          </div>
          <div className="mt-3 h-56">
            <ResponsiveContainer>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.87 0.16 200)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="oklch(0.87 0.16 200)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="d" stroke="oklch(0.7 0.03 230)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.03 230)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.17 0.04 260)", border: "1px solid oklch(0.87 0.16 200 / 0.3)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="score" stroke="oklch(0.87 0.16 200)" strokeWidth={2} fill="url(#gA)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-5">
          <div className="font-display font-semibold">Detection Statistics</div>
          <div className="mt-3 h-56">
            <ResponsiveContainer>
              <BarChart data={detections}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="name" stroke="oklch(0.7 0.03 230)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.03 230)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.17 0.04 260)", border: "1px solid oklch(0.87 0.16 200 / 0.3)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="real" stackId="a" fill="oklch(0.62 0.2 260)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="fake" stackId="a" fill="oklch(0.78 0.27 350)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="font-display font-semibold">Risk Distribution</div>
          <div className="mt-3 h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={riskMix} dataKey="value" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {riskMix.map((e) => <Cell key={e.name} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.17 0.04 260)", border: "1px solid oklch(0.87 0.16 200 / 0.3)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[11px]">
            {riskMix.map((r) => (
              <div key={r.name} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: r.fill }} /><span className="text-muted-foreground">{r.name}</span><span className="ml-auto font-mono">{r.value}</span></div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div className="font-display font-semibold">Voice Authenticity</div>
            <Mic className="h-4 w-4 text-cyan-neon" />
          </div>
          <div className="mt-4 grid place-items-center">
            <ScoreRing value={voice} size={140} label="Voice" />
          </div>
          <div className="mt-3 space-y-1.5 font-mono text-[11px]">
            <Row k="Pitch Stability" v="92%" />
            <Row k="Spectral Match" v="84%" />
            <Row k="Synth Markers" v={voice < 60 ? "3 detected" : "0"} bad={voice < 60} />
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="font-display font-semibold flex items-center gap-2"><Activity className="h-4 w-4 text-cyan-neon" />Detection History</div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr className="border-b border-white/5">
                  <th className="py-2 pr-3">ID</th><th className="pr-3">Source</th><th className="pr-3">Score</th><th className="pr-3">Verdict</th><th>Time</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["AUD-9128", "kyc-stream", 96, "authentic", "12:42"],
                  ["AUD-9127", "upload.mp4", 38, "deepfake", "12:39"],
                  ["AUD-9126", "webcam-live", 71, "suspicious", "12:31"],
                  ["AUD-9125", "vendor-api", 91, "authentic", "12:24"],
                  ["AUD-9124", "upload.mov", 22, "deepfake", "12:18"],
                ].map(([id, src, sc, v, t]) => (
                  <tr key={id as string} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="py-2.5 pr-3 font-mono text-cyan-neon">{id}</td>
                    <td className="pr-3 text-muted-foreground">{src}</td>
                    <td className="pr-3 font-mono">{sc}</td>
                    <td className="pr-3"><RiskBadge level={v === "authentic" ? "low" : v === "suspicious" ? "medium" : "critical"} /></td>
                    <td className="font-mono text-muted-foreground">{t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="font-display font-semibold flex items-center gap-2"><CircleAlert className="h-4 w-4 text-[oklch(0.78_0.27_350)]" />Suspicious Activity</div>
          <ul className="mt-3 space-y-2">
            {[
              { sev: "critical", t: "Deepfake face-swap detected", at: "AUD-9127 · 12:39" },
              { sev: "high", t: "Voice clone signature (3 markers)", at: "AUD-9118 · 12:11" },
              { sev: "medium", t: "Liveness drift > threshold", at: "AUD-9112 · 11:58" },
              { sev: "low", t: "Compression artifact spike", at: "AUD-9099 · 11:32" },
            ].map((a, i) => (
              <li key={i} className="glass rounded-lg p-3">
                <div className="flex items-center justify-between gap-2"><span className="text-sm">{a.t}</span><RiskBadge level={a.sev as "critical" | "high" | "medium" | "low"} /></div>
                <div className="mt-1 font-mono text-[10px] text-muted-foreground">{a.at}</div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

function Row({ k, v, bad }: { k: string; v: string; bad?: boolean }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className={bad ? "text-[oklch(0.78_0.27_350)]" : "text-cyan-neon"}>{v}</span></div>;
}
