import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionHeading } from "@/components/ui/primitives";
import { Brain, Code2, Layers, Rocket, Target, AlertOctagon } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — Deepfake Auditor" }, { name: "description", content: "Problem statement, objectives, technologies, applications, and future scope of the Deepfake Auditor platform." }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <SectionHeading kicker="About the Project" title="Real-Time Digital Trust Protection" sub="Deepfake Auditor is an AI-powered platform built to defend identity, media, and customer-onboarding flows against synthetic deception." />

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <GlassCard className="p-6">
          <Section icon={<AlertOctagon className="h-5 w-5 text-[oklch(0.78_0.27_350)]" />} title="Problem Statement">
            Generative AI now produces video and audio indistinguishable to the human eye and ear. Banks, fintechs, and KYC platforms face a rising wave of synthetic identities, deepfake video calls, and voice-cloned fraud — undermining digital trust at the point of onboarding.
          </Section>
        </GlassCard>
        <GlassCard className="p-6">
          <Section icon={<Target className="h-5 w-5 text-cyan-neon" />} title="Objectives">
            <ul className="list-disc list-inside space-y-1">
              <li>Detect deepfake video and synthetic faces in real time.</li>
              <li>Score voice authenticity against known clone signatures.</li>
              <li>Verify identity through document-to-face matching.</li>
              <li>Provide auditable, downloadable forensic reports.</li>
            </ul>
          </Section>
        </GlassCard>
        <GlassCard className="p-6">
          <Section icon={<Code2 className="h-5 w-5 text-cyan-neon" />} title="Technologies Used">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {["React 19", "TypeScript", "TanStack Start", "Tailwind v4", "Framer Motion", "Recharts", "WebAudio API", "WebRTC / getUserMedia", "Lucide Icons"].map((t) => (
                <span key={t} className="rounded-md glass px-2.5 py-1 text-xs font-mono text-center">{t}</span>
              ))}
            </div>
          </Section>
        </GlassCard>
        <GlassCard className="p-6">
          <Section icon={<Layers className="h-5 w-5 text-cyan-neon" />} title="Applications">
            <ul className="list-disc list-inside space-y-1">
              <li>Bank & fintech customer onboarding.</li>
              <li>Digital identity providers and KYC vendors.</li>
              <li>Newsrooms and media authenticity verification.</li>
              <li>Enterprise video-call deepfake monitoring.</li>
              <li>Insurance fraud and remote claim verification.</li>
            </ul>
          </Section>
        </GlassCard>
        <GlassCard className="p-6 md:col-span-2">
          <Section icon={<Rocket className="h-5 w-5 text-cyan-neon" />} title="Future Scope">
            <ul className="list-disc list-inside space-y-1">
              <li>On-device inference for sub-100ms verdicts at the edge.</li>
              <li>Federated learning across customer deployments for fresher signatures.</li>
              <li>C2PA provenance integration and signed media chains.</li>
              <li>Multi-language voice clone detection models.</li>
              <li>Native SDKs for iOS, Android, and video-conferencing platforms.</li>
            </ul>
          </Section>
        </GlassCard>
      </div>

      <GlassCard className="mt-6 p-8 text-center">
        <Brain className="h-6 w-6 text-cyan-neon mx-auto" />
        <div className="mt-2 font-display text-xl">AI-Powered Security Intelligence</div>
        <div className="text-sm text-muted-foreground">Real-Time Digital Trust Protection.</div>
      </GlassCard>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg glass neon-border">{icon}</div>
        <h3 className="font-display text-lg font-semibold">{title}</h3>
      </div>
      <div className="mt-3 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}
