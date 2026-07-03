import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard, NeonButton, SectionHeading, StatTile } from "@/components/ui/primitives";
import { Film, Upload, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/frame-extraction")({
  head: () => ({ meta: [
    { title: "Frame Extraction — Deepfake Auditor" },
    { name: "description", content: "Extract keyframes from an uploaded video and preview each sampled frame before deepfake analysis." },
  ] }),
  component: FrameExtractionPage,
});

function FrameExtractionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  async function extract(f: File) {
    setFile(f); setFrames([]); setBusy(true);
    const u = URL.createObjectURL(f);
    setUrl(u);
    const video = document.createElement("video");
    video.src = u; video.muted = true; video.crossOrigin = "anonymous";
    await new Promise<void>((res, rej) => { video.onloadedmetadata = () => res(); video.onerror = () => rej(); });
    const duration = Math.min(video.duration || 6, 20);
    const count = 12;
    const canvas = document.createElement("canvas");
    canvas.width = 320; canvas.height = 180;
    const ctx = canvas.getContext("2d")!;
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = (duration * (i + 0.5)) / count;
      await new Promise<void>((res) => { video.currentTime = t; video.onseeked = () => res(); });
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      out.push(canvas.toDataURL("image/jpeg", 0.7));
      setFrames([...out]);
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-neon">Pipeline · Step 02</div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold">Frame Extraction</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sample keyframes from the ingested video for downstream analysis.</p>
        </div>
        <label className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium neon-border text-cyan-neon hover:bg-cyan-neon/10 cursor-pointer transition">
          <Upload className="h-4 w-4" /> Upload Video
          <input type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) extract(f); }} />
        </label>
      </div>

      {!file && (
        <GlassCard className="mt-8 p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full neon-border"><Film className="h-6 w-6 text-cyan-neon" /></div>
          <h3 className="mt-4 font-display text-xl font-semibold">Awaiting media</h3>
          <p className="mt-1 text-sm text-muted-foreground">Upload a video to sample 12 evenly-spaced keyframes.</p>
        </GlassCard>
      )}

      {file && (
        <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
          <GlassCard className="p-4">
            <div className="font-display font-semibold">Source Preview</div>
            <div className="mt-3 aspect-video overflow-hidden rounded-lg border border-white/5 bg-black">
              {url && <video ref={videoRef} src={url} controls muted className="h-full w-full object-contain" />}
            </div>
          </GlassCard>
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Frames" value={`${frames.length}/12`} accent="cyan" />
            <StatTile label="Status" value={busy ? "Sampling…" : frames.length ? "Ready" : "Idle"} accent={busy ? "blue" : "lime"} />
            <StatTile label="Sample Rate" value="≈2 fps" accent="cyan" />
            <StatTile label="Resolution" value="320×180" accent="blue" />
          </div>
        </div>
      )}

      {frames.length > 0 && (
        <GlassCard className="mt-4 p-5">
          <div className="flex items-center justify-between">
            <div className="font-display font-semibold">Extracted Keyframes</div>
            <Link to="/face-detection"><NeonButton>Next: Face Detection <ArrowRight className="h-4 w-4" /></NeonButton></Link>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {frames.map((src, i) => (
              <div key={i} className="relative overflow-hidden rounded-lg border border-white/5">
                <img src={src} alt={`frame-${i}`} className="w-full aspect-video object-cover" />
                <div className="absolute left-1 bottom-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-cyan-neon">#{String(i + 1).padStart(2, "0")}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
