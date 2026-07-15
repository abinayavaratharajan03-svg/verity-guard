import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type Risk = "low" | "medium" | "high" | "critical";

export interface AlertItem {
  id: string;
  source: string;
  message: string;
  risk: Risk;
  time: string;
}

export interface WebcamStatus {
  risk: Risk;
  message: string;
  score: number;
}

export interface VerdictSnapshot {
  score: number;
  verdict: string;
  risk: Risk;
}

interface Ctx {
  alerts: AlertItem[];
  pushAlert: (a: Omit<AlertItem, "id" | "time"> & { time?: string }) => void;
  clearAlerts: () => void;
  webcamActive: boolean;
  setWebcamActive: (v: boolean) => void;
  webcamStatus: WebcamStatus | null;
  setWebcamStatus: (v: WebcamStatus | null) => void;
  latestVoice: VerdictSnapshot | null;
  setLatestVoice: (v: VerdictSnapshot | null) => void;
  latestKYC: VerdictSnapshot | null;
  setLatestKYC: (v: VerdictSnapshot | null) => void;
  totalScanned: number;
  incScanned: (n?: number) => void;
  totalImages: number;
  incImages: (n?: number) => void;
}

const DetectionCtx = createContext<Ctx | null>(null);

export function DetectionProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [webcamActive, setWebcamActive] = useState(false);
  const [webcamStatus, setWebcamStatus] = useState<WebcamStatus | null>(null);
  const [latestVoice, setLatestVoice] = useState<VerdictSnapshot | null>(null);
  const [latestKYC, setLatestKYC] = useState<VerdictSnapshot | null>(null);
  const [totalScanned, setTotalScanned] = useState(0);
  const [totalImages, setTotalImages] = useState(0);

  const pushAlert = useCallback<Ctx["pushAlert"]>((a) => {
    setAlerts((prev) => [
      {
        id: Math.random().toString(36).slice(2, 9),
        time: a.time ?? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        source: a.source,
        message: a.message,
        risk: a.risk,
      },
      ...prev,
    ].slice(0, 40));
  }, []);

  const value = useMemo<Ctx>(() => ({
    alerts,
    pushAlert,
    clearAlerts: () => setAlerts([]),
    webcamActive,
    setWebcamActive,
    webcamStatus,
    setWebcamStatus,
    latestVoice,
    setLatestVoice,
    latestKYC,
    setLatestKYC,
    totalScanned,
    incScanned: (n = 1) => setTotalScanned((v) => v + n),
    totalImages,
    incImages: (n = 1) => setTotalImages((v) => v + n),
  }), [alerts, pushAlert, webcamActive, webcamStatus, latestVoice, latestKYC, totalScanned, totalImages]);

  return <DetectionCtx.Provider value={value}>{children}</DetectionCtx.Provider>;
}

export function useDetection() {
  const c = useContext(DetectionCtx);
  if (!c) throw new Error("useDetection must be used within DetectionProvider");
  return c;
}

export function scoreToRisk(score: number): Risk {
  if (score >= 78) return "low";
  if (score >= 55) return "medium";
  if (score >= 35) return "high";
  return "critical";
}
