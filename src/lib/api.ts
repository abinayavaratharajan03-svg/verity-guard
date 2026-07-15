import axios, { AxiosError } from "axios";

export const BACKEND_URL =
  (typeof import.meta !== "undefined" && (import.meta as { env?: Record<string, string> }).env?.VITE_BACKEND_URL) ||
  "http://localhost:8000";

export const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
});

export interface BackendError {
  offline: boolean;
  status?: number;
  message: string;
}

export function toBackendError(err: unknown): BackendError {
  const e = err as AxiosError;
  const offline = !e?.response;
  return {
    offline,
    status: e?.response?.status,
    message: offline
      ? "Connection refused — backend not reachable at " + BACKEND_URL
      : (e?.message ?? "Request failed"),
  };
}

export interface AnalyzeResult {
  authenticity_score: number;
  deepfake_probability: number;
  confidence: number;
  verdict: "authentic" | "suspicious" | "deepfake";
  regions?: { x: number; y: number; w: number; h: number; label?: string }[];
  notes?: string[];
}

export async function analyzeVideo(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post<AnalyzeResult>("/api/analyze/video", fd);
  return data;
}

export async function analyzeFrame(blob: Blob) {
  const fd = new FormData();
  fd.append("file", blob, "frame.jpg");
  const { data } = await api.post<AnalyzeResult>("/api/analyze/frame", fd);
  return data;
}

export async function analyzeAudio(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post<AnalyzeResult & { voice_score?: number }>("/api/analyze/audio", fd);
  return data;
}

export interface KycResult {
  face_match: number;
  liveness: number;
  verdict: "verified" | "review" | "rejected";
  notes?: string[];
}

export async function verifyKyc(idDoc: File, selfie: File | Blob, documentType: string) {
  const fd = new FormData();
  fd.append("id_document", idDoc);
  fd.append("selfie", selfie, "selfie.png");
  fd.append("document_type", documentType);
  const { data } = await api.post<KycResult>("/api/kyc/verify", fd);
  return data;
}

export async function health() {
  const { data } = await api.get<{ ok: boolean }>("/api/health");
  return data;
}
