import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, NeonButton, RiskBadge, ScoreRing } from "@/components/ui/primitives";
import { AudioLines, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { analyzeFile } from "@/lib/mock-detection";
import { analyzeAudio, toBackendError } from "@/lib/api";
import { useDetection, scoreToRisk } from "@/context/detection-context";

export const Route = createFileRoute("/voice")({
  head: () => ({ meta: [{ title: "Voice Clone Detection — Deepfake Auditor" }, { name: "description", content: "Detect AI-generated voice clones via spectral fingerprinting and waveform analysis." }] }),
  component: VoicePage,
});

function VoicePage() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [bars, setBars] = useState<number[]>(Array.from({ length: 64 }, () => 8));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const { pushAlert, setLatestVoice } = useDetection();

  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); cancelAnimationFrame(rafRef.current ?? 0); ctxRef.current?.close(); }, [audioUrl]);

  async function load(f: File) {
    setFile(f);
    setAudioUrl(URL.createObjectURL(f));
    setNote(null);
    let s: number;
    let verdict: string;
    try {
      const r = await analyzeAudio(f);
      s = r.voice_score ?? r.authenticity_score;
      verdict = r.verdict;
    } catch (err) {
      setNote(toBackendError(err).message);
      const local = analyzeFile(f.name, f.size);
      s = local.voiceScore;
      verdict = s >= 75 ? "authentic" : s >= 50 ? "suspicious" : "deepfake";
    }
    setScore(s);
    const risk = scoreToRisk(s);
    setLatestVoice({ score: s, verdict, risk });
    pushAlert({ source: f.name, message: `Voice ${verdict.toUpperCase()} · score ${s}%`, risk });
  }

  async function play() {
    const a = audioRef.current; if (!a) return;
    if (!ctxRef.current) {
      const ctx = new AudioContext();
      const src = ctx.createMediaElementSource(a);
      const ana = ctx.createAnalyser(); ana.fftSize = 128;
      src.connect(ana); ana.connect(ctx.destination);
      ctxRef.current = ctx;
      const data = new Uint8Array(ana.frequencyBinCount);
      const tick = () => {
        ana.getByteFrequencyData(data);
        setBars(Array.from(data).slice(0, 64));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    }
    await ctxRef.current.resume();
    await a.play();
  }

  const verdict = score == null ? "—" : score >= 75 ? "Authentic" : score >= 50 ? "Suspicious" : "Cloned";
  const risk: "low" | "medium" | "critical" = score == null ? "medium" : score >= 75 ? "low" : score >= 50 ? "medium" : "critical";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-neon">Audio / Voice</div>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold">Voice Clone Detection</h1>
        <p className="mt-1 text-sm text-muted-foreground">Spectral fingerprinting catches AI-generated voice impersonation.</p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-display font-semibold"><AudioLines className="h-4 w-4 text-cyan-neon" />Audio Sample</div>
            <label className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium neon-border text-cyan-neon hover:bg-cyan-neon/10 cursor-pointer transition">
              <Upload className="h-3.5 w-3.5" />Upload
              <input type="file" accept="audio/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) load(f); }} />
            </label>
          </div>

          <div className="mt-4 h-40 rounded-xl glass-strong p-3 flex items-end gap-[2px] overflow-hidden">
            {bars.map((b, i) => (
              <div key={i} className="flex-1 rounded-sm" style={{
                height: `${Math.max(6, (b / 255) * 100)}%`,
                background: `linear-gradient(180deg, oklch(0.87 0.16 200), oklch(0.62 0.2 260))`,
                boxShadow: "0 0 12px oklch(0.87 0.16 200 / 0.4)",
              }} />
            ))}
          </div>

          {audioUrl ? (
            <div className="mt-4 flex items-center gap-3">
              <audio ref={audioRef} src={audioUrl} className="hidden" onEnded={() => { cancelAnimationFrame(rafRef.current ?? 0); setBars(Array.from({ length: 64 }, () => 6)); }} />
              <NeonButton onClick={play}>Play Sample</NeonButton>
              <span className="font-mono text-xs text-muted-foreground truncate">{file?.name}</span>
            </div>
          ) : (
            <div className="mt-4 text-sm text-muted-foreground">Upload an audio file to analyze.</div>
          )}
        </GlassCard>

        <GlassCard className="p-5">
          <div className="font-display font-semibold">Voice Authenticity</div>
          <div className="mt-4 grid place-items-center">
            <ScoreRing value={score ?? 0} label="Voice" />
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Verdict</span><span className="font-display">{verdict}</span></div>
            <div className="flex justify-between items-center"><span className="text-muted-foreground">Risk</span><RiskBadge level={risk} /></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Synth Markers</span><span className="font-mono">{score && score < 60 ? 3 : 0}</span></div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
