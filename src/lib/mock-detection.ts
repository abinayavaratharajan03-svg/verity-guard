// Deterministic mock detection — seeded by input so results feel stable.
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 0xffffffff;
}

export type Verdict = "authentic" | "suspicious" | "deepfake";

export interface DetectionResult {
  authenticityScore: number; // 0-100
  deepfakeProbability: number; // 0-100
  confidence: number; // 0-100
  verdict: Verdict;
  voiceScore: number;
  regions: { x: number; y: number; r: number; intensity: number; label: string }[];
  frames: { t: number; score: number }[];
  signals: { name: string; value: number; status: "ok" | "warn" | "fail" }[];
  fingerprint: string;
}

export function analyzeFile(name: string, size = 0): DetectionResult {
  const seed = hash(`${name}:${size}`);
  const auth = Math.round(28 + seed * 70);
  const verdict: Verdict = auth >= 78 ? "authentic" : auth >= 52 ? "suspicious" : "deepfake";
  const regions = Array.from({ length: 3 + Math.floor(seed * 3) }, (_, i) => {
    const r = hash(`${name}:reg:${i}`);
    const labels = ["Eyes", "Mouth", "Jawline", "Forehead", "Cheek", "Nose"];
    return {
      x: 22 + r * 56,
      y: 18 + ((r * 13) % 1) * 60,
      r: 6 + ((r * 7) % 1) * 10,
      intensity: 0.35 + ((r * 5) % 1) * 0.6,
      label: labels[i % labels.length],
    };
  });
  const frames = Array.from({ length: 24 }, (_, i) => ({
    t: i,
    score: Math.max(5, Math.min(99, auth + Math.sin(i / 2 + seed * 10) * 14 + (hash(`${name}:f${i}`) - 0.5) * 12)),
  }));
  const signals = [
    { name: "Temporal Coherence", value: Math.round(40 + seed * 60), status: auth >= 70 ? "ok" : "warn" as const },
    { name: "Lip-Sync Drift", value: Math.round(10 + (1 - seed) * 80), status: auth >= 70 ? "ok" : "fail" as const },
    { name: "GAN Artifact Score", value: Math.round((1 - seed) * 90), status: auth >= 70 ? "ok" : "fail" as const },
    { name: "Blink Pattern", value: Math.round(50 + seed * 40), status: "ok" as const },
    { name: "Color Histogram", value: Math.round(60 + seed * 30), status: "ok" as const },
  ] as DetectionResult["signals"];
  return {
    authenticityScore: auth,
    deepfakeProbability: 100 - auth,
    confidence: Math.round(72 + seed * 26),
    verdict,
    voiceScore: Math.round(40 + hash(`${name}:v`) * 58),
    regions,
    frames,
    signals,
    fingerprint: `0x${Math.floor(seed * 0xffffffff).toString(16).padStart(8, "0").toUpperCase()}`,
  };
}

export function fakeProgress(onTick: (p: number) => void, duration = 2400): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      onTick(Math.round(p * 100));
      if (p < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
}
