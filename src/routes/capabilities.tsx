import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading, NeonButton, GlassCard } from "@/components/ui/primitives";
import { FeaturesGrid } from "@/components/marketing/FeaturesGrid";
import { ArrowRight, ShieldCheck, Radar, Fingerprint } from "lucide-react";

export const Route = createFileRoute("/capabilities")({
  head: () => ({
    meta: [
      { title: "Capabilities — Deepfake Auditor" },
      { name: "description", content: "Deepfake detection, live webcam analysis, KYC verification, and voice clone detection — enterprise-grade trust layer." },
      { property: "og:title", content: "Capabilities — Deepfake Auditor" },
      { property: "og:description", content: "Enterprise-Grade Detection, Built for Trust." },
    ],
  }),
  component: CapabilitiesPage,
});

function CapabilitiesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
      <SectionHeading
        kicker="Capabilities"
        title="Enterprise-Grade Detection, Built for Trust"
        sub="A unified trust layer that fuses computer vision, audio forensics, and identity intelligence to protect every customer interaction."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { icon: ShieldCheck, t: "Deepfake Detection", d: "Frame-level neural inspection of uploaded videos surfaces synthetic faces, face-swaps, and reenactments with confidence scoring." },
          { icon: Radar, t: "Live Webcam Analysis", d: "Continuous monitoring of webcam feeds raises real-time alerts the moment authenticity drifts." },
          { icon: Fingerprint, t: "KYC & Voice Forensics", d: "Match ID documents to live captures and fingerprint voice spectra to catch cloned audio impersonation." },
        ].map(({ icon: Icon, t, d }) => (
          <GlassCard key={t} className="p-6">
            <div className="grid h-11 w-11 place-items-center rounded-lg neon-border glass-strong">
              <Icon className="h-5 w-5 text-cyan-neon" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </GlassCard>
        ))}
      </div>

      <div className="mt-16">
        <SectionHeading kicker="Detection Surfaces" title="Seven layers working in concert" sub="Each capability is independently auditable and produces evidence you can export." />
        <FeaturesGrid />
      </div>

      <div className="mt-16 glass-strong rounded-2xl p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-neon">Try it now</p>
        <h3 className="mt-2 font-display text-2xl font-bold">Run a capability against your own media</h3>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/analyze"><NeonButton>Analyze Video <ArrowRight className="h-4 w-4" /></NeonButton></Link>
          <Link to="/kyc"><NeonButton variant="outline">KYC Verification</NeonButton></Link>
          <Link to="/voice"><NeonButton variant="ghost">Voice Clone Check</NeonButton></Link>
        </div>
      </div>
    </div>
  );
}
