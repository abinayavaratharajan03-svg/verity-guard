
# Real-Time Video Deception & Deepfake Auditor

A premium, frontend-only marketing + product demo site. All "detection" results are simulated client-side (no real ML/backend) so the app is fully interactive without infrastructure. If you later want real analysis, we can add Lovable Cloud + an AI model.

## Scope clarification
- **No backend in this pass.** Uploads stay in-browser; scores are generated with deterministic mock logic + animated reveals. This keeps the build fast and the UI dazzling.
- **No auth.** Dashboard, KYC, and Voice pages are publicly viewable demos.

## Design system
- Palette: near-black `#05070D`, deep navy `#0A1024`, neon cyan `#22E6FF`, electric blue `#3B82F6`, alert magenta `#FF3DA5`, success lime `#A6FF4D`.
- Typography: Space Grotesk (display) + Inter (body), loaded via `<link>` in `__root.tsx`.
- Tokens defined in `src/styles.css` under `@theme` + `:root` (oklch). Glass utility, neon-glow shadow, grid-scanline background, animated gradient borders.
- Framer Motion for entrance, hover, and scan animations. Canvas/SVG for the animated face-scan hero and heatmap overlay.

## Routes (TanStack Start, file-based)
```
src/routes/
  __root.tsx          shared shell: top nav (glass), footer, scanline bg
  index.tsx           Landing (hero + features + workflow + footer CTA)
  dashboard.tsx       Operations dashboard
  analyze.tsx         Deepfake Analysis Results
  kyc.tsx             KYC Verification
  voice.tsx           Voice Clone Detection
  about.tsx           About the project
```
Features and Workflow live as sections on `/` (anchored from nav) — per spec they're "sections", not separate pages. Each route gets its own `head()` meta.

## Components (`src/components/`)
- `layout/SiteHeader.tsx`, `layout/SiteFooter.tsx`
- `hero/FaceScanHero.tsx` — SVG face wireframe + animated cyan scan line, particle grid, floating data chips
- `marketing/FeatureCard.tsx`, `marketing/FeaturesGrid.tsx` (7 cards w/ Lucide icons)
- `marketing/WorkflowFlow.tsx` — vertical/horizontal animated pipeline (6 nodes with connecting beam)
- `dashboard/UploadDropzone.tsx`, `dashboard/WebcamPanel.tsx` (uses `getUserMedia`, mock overlay)
- `dashboard/AuthenticityGauge.tsx` — radial SVG gauge
- `dashboard/DeepfakeChart.tsx`, `dashboard/RiskDistribution.tsx`, `dashboard/TrendChart.tsx` — Recharts
- `dashboard/VoiceMeter.tsx`, `dashboard/AlertsFeed.tsx`, `dashboard/HistoryTable.tsx`, `dashboard/RiskBadge.tsx`
- `analysis/HeatmapOverlay.tsx` — canvas blob heatmap over video frame
- `analysis/ReportCard.tsx` + `downloadReport()` (generates a text/JSON report blob)
- `kyc/IdUpload.tsx`, `kyc/FaceCapture.tsx`, `kyc/MatchScore.tsx`, `kyc/FraudAssessment.tsx`
- `voice/AudioUpload.tsx`, `voice/Waveform.tsx` (WebAudio analyser → canvas bars)
- `ui/GlassCard.tsx`, `ui/NeonButton.tsx`, `ui/ScoreRing.tsx`, `ui/StatTile.tsx`

## Mock detection logic (`src/lib/mock-detection.ts`)
Deterministic pseudo-random results seeded by file name/size so re-runs feel consistent: returns `authenticityScore`, `confidence`, `verdict`, `manipulatedRegions[]`, `voiceScore`, etc., with simulated 2–4s "analyzing" delay and progress events for the UI.

## Charts
Recharts (already pairs well with the stack) for: Authenticity Trend (area), Detection Stats (bar), Risk Distribution (donut), Verification Metrics (radial bar).

## Dependencies to add
`framer-motion`, `recharts`, `lucide-react` (likely present), `clsx`/`tailwind-merge` (present via shadcn).

## Out of scope (call out)
Real ML inference, persistent history, authenticated accounts, payment, email reports. Easy follow-ups if desired.

## Build order
1. Design tokens + fonts + shared shell (header/footer/bg).
2. Landing (hero, features, workflow).
3. Reusable primitives (GlassCard, NeonButton, ScoreRing, gauge, charts).
4. Dashboard.
5. Analysis Results + heatmap + report download.
6. KYC page.
7. Voice page.
8. About page + meta polish on every route.
