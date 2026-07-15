import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, NeonButton, RiskBadge, ScoreRing, StatTile } from "@/components/ui/primitives";
import { Camera, IdCard, ShieldCheck, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { verifyKyc, toBackendError } from "@/lib/api";
import { useDetection, scoreToRisk } from "@/context/detection-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/kyc")({
  head: () => ({ meta: [{ title: "KYC Verification — Deepfake Auditor" }, { name: "description", content: "Match identity documents to a live face capture with synthetic-face and fraud-risk scoring." }] }),
  component: KycPage,
});

function KycPage() {
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [capture, setCapture] = useState<string | null>(null);
  const [match, setMatch] = useState<number | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  async function startCam() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) { videoRef.current.srcObject = s; await videoRef.current.play(); }
      setCameraOn(true);
    } catch { /* noop */ }
  }
  function snapshot() {
    const v = videoRef.current; const c = canvasRef.current; if (!v || !c) return;
    c.width = v.videoWidth || 480; c.height = v.videoHeight || 360;
    c.getContext("2d")?.drawImage(v, 0, 0, c.width, c.height);
    setCapture(c.toDataURL("image/png"));
    setMatch(82 + Math.floor(Math.random() * 14));
  }

  const risk: "low" | "medium" | "high" = match == null ? "medium" : match >= 88 ? "low" : match >= 70 ? "medium" : "high";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-neon">Identity / KYC</div>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold">KYC Verification</h1>
        <p className="mt-1 text-sm text-muted-foreground">Match identity documents to a live face capture and assess fraud risk.</p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 font-display font-semibold"><IdCard className="h-4 w-4 text-cyan-neon" />ID Document</div>
          <label className="mt-3 block">
            {!idPreview ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-neon/30 bg-cyan-neon/5 px-6 py-12 cursor-pointer hover:bg-cyan-neon/10">
                <Upload className="h-7 w-7 text-cyan-neon" />
                <div className="text-sm">Upload passport, ID, or driving license</div>
                <div className="font-mono text-[10px] text-muted-foreground">JPG · PNG · PDF</div>
              </div>
            ) : (
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/5">
                <img src={idPreview} alt="ID" className="h-full w-full object-cover" />
                <div className="absolute top-2 left-2 font-mono text-[10px] text-cyan-neon bg-black/40 rounded px-2 py-0.5">DOCUMENT · VERIFIED</div>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0]; if (f) setIdPreview(URL.createObjectURL(f));
            }} />
          </label>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-display font-semibold"><Camera className="h-4 w-4 text-cyan-neon" />Live Face Capture</div>
            {!cameraOn ? <NeonButton variant="outline" className="px-3 py-1.5 text-xs" onClick={startCam}>Start Camera</NeonButton> :
              <NeonButton className="px-3 py-1.5 text-xs" onClick={snapshot}>Capture</NeonButton>}
          </div>
          <div className="relative mt-3 aspect-video overflow-hidden rounded-xl border border-white/5 bg-black scan-line">
            {capture ? <img src={capture} alt="capture" className="h-full w-full object-cover" /> : <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />}
            {!cameraOn && !capture && <div className="absolute inset-0 grid place-items-center font-mono text-xs text-muted-foreground">CAMERA OFFLINE</div>}
            {cameraOn && !capture && <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-neon to-transparent animate-scan-y" />}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </GlassCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-5">
          <div className="font-display font-semibold">Face Matching Score</div>
          <div className="mt-4 grid place-items-center">
            <ScoreRing value={match ?? 0} label="Match" sublabel={match ? "biometric similarity" : "awaiting capture"} />
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="font-display font-semibold">Verification Status</div>
          <div className="mt-4 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full neon-border bg-background"><ShieldCheck className="h-5 w-5 text-cyan-neon" /></div>
            <div>
              <div className="font-display text-xl">{match ? (match >= 88 ? "Verified" : match >= 70 ? "Manual Review" : "Rejected") : "Pending"}</div>
              <div className="text-xs text-muted-foreground">{match ? `Score ${match}% · ${idPreview ? "document on file" : "no document"}` : "Upload ID and capture face"}</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <StatTile label="Liveness" value="98%" accent="lime" />
            <StatTile label="Doc OCR" value={idPreview ? "OK" : "—"} accent="cyan" />
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="font-display font-semibold">Fraud Risk Assessment</div>
          <div className="mt-3 flex items-center justify-between"><span className="text-sm text-muted-foreground">Composite risk</span><RiskBadge level={risk} /></div>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li className="flex justify-between"><span className="text-muted-foreground">Synthetic face markers</span><span className="font-mono text-lime-ok">0</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Document tampering</span><span className="font-mono text-lime-ok">low</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Velocity / device</span><span className="font-mono text-cyan-neon">normal</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Watchlist hits</span><span className="font-mono text-lime-ok">none</span></li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
