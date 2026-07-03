import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard, NeonButton, StatTile } from "@/components/ui/primitives";
import { ScanFace, Upload, ArrowRight, Play, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/face-detection")({
  head: () => ({ meta: [
    { title: "Face Detection — Deepfake Auditor" },
    { name: "description", content: "Locate and align facial regions with live bounding-box overlays before deepfake analysis." },
  ] }),
  component: FaceDetectionPage,
});

function FaceDetectionPage() {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => () => stop(), []);

  async function start() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360 }, audio: false });
      streamRef.current = s;
      if (videoRef.current) { videoRef.current.srcObject = s; await videoRef.current.play(); }
      setLive(true);
    } catch { alert("Webcam access denied."); }
  }
  function stop() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setLive(false);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-neon">Pipeline · Step 03</div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold">Face Detection</h1>
          <p className="mt-1 text-sm text-muted-foreground">Bounding-box localization and landmark alignment on ingested frames.</p>
        </div>
        <div className="flex gap-2">
          <label className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium neon-border text-cyan-neon hover:bg-cyan-neon/10 cursor-pointer transition">
            <Upload className="h-4 w-4" /> Upload Image
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setImgUrl(URL.createObjectURL(f)); }} />
          </label>
          {!live ? (
            <NeonButton onClick={start}><Play className="h-4 w-4" /> Live Webcam</NeonButton>
          ) : (
            <NeonButton variant="outline" onClick={stop}><Square className="h-4 w-4" /> Stop</NeonButton>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <GlassCard className="p-4">
          <div className="font-display font-semibold">Detection Canvas</div>
          <div className="relative mt-3 aspect-video overflow-hidden rounded-lg border border-white/5 bg-black scan-line">
            {live ? (
              <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
            ) : imgUrl ? (
              <img src={imgUrl} alt="src" className="h-full w-full object-contain" />
            ) : (
              <div className="grid h-full place-items-center text-sm text-muted-foreground"><ScanFace className="h-12 w-12 text-cyan-neon/50" /></div>
            )}
            {(live || imgUrl) && (
              <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <g stroke="var(--cyan-neon)" strokeWidth="0.4" fill="none">
                  <rect x="36" y="22" width="28" height="42" rx="1">
                    <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="1.6s" repeatCount="indefinite" />
                  </rect>
                  <circle cx="45" cy="38" r="1.2" fill="var(--cyan-neon)" />
                  <circle cx="55" cy="38" r="1.2" fill="var(--cyan-neon)" />
                  <path d="M46 52 Q50 55 54 52" />
                  <path d="M50 40 L50 47" />
                </g>
                <text x="36" y="20" fontSize="2.4" fill="var(--cyan-neon)" fontFamily="monospace">FACE_01 · 0.98</text>
              </svg>
            )}
          </div>
        </GlassCard>
        <div className="grid grid-cols-2 gap-3 content-start">
          <StatTile label="Faces" value={live || imgUrl ? "1" : "0"} accent="cyan" />
          <StatTile label="Landmarks" value="68" accent="blue" />
          <StatTile label="Alignment" value={live || imgUrl ? "OK" : "—"} accent="lime" />
          <StatTile label="Model" value="MediaPipe" accent="cyan" />
          <div className="col-span-2">
            <Link to="/ai-analysis"><NeonButton className="w-full">Next: AI Analysis <ArrowRight className="h-4 w-4" /></NeonButton></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
